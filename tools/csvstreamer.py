#!/usr/bin/env python3

import argparse
from datetime import datetime, timedelta, timezone
import dateutil.parser
from http.server import BaseHTTPRequestHandler
from os import listdir
from os.path import getsize, isfile, join as joinPath
import random
import shutil
import sys
from tempfile import TemporaryDirectory
from time import sleep

try:
  # Requires Python 3.7
  from http.server import ThreadingHTTPServer as Server
except ImportError:
  print('Warning: No threading support (upgrade to Python 3.7+). You will only be able to stream to 1 client at a time.')
  from http.server import HTTPServer as Server

def parse_date(line, col):
  try:
    sep = ','
    for s in ',\t':
      if s in line:
        sep = s
        break
    first_sep = line.index(sep)
    try:
      date = datetime.fromtimestamp(float(line[:first_sep-1]), timezone.utc)
    except ValueError:
      date = dateutil.parser.parse(line[1:first_sep-1])
    return date
  except Exception as e:
    print('parse_date({}): {}'.format(repr(line), repr(e)))
    return None

def si_prefix(val, unit):
  # Must be in descending order of magnitude
  prefixes = [(1e12, 'P'), (1e9, 'G'), (1e6, 'M'), (1e3, 'k'), (1e0, '')]
  for power, prefix in prefixes:
    if val > power:
      return '{:.1f} {}{}'.format(val / power, prefix, unit)

class RequestHandler(BaseHTTPRequestHandler):
  # Gamma distributions
  delay = 0.0           # For each client, delay before first response (seconds)
  batch_size = (40, 25) # Lines per batch (mean, stdev)
  jitter = (1, 0.25)     # Delay between batches (mean, stdev)

  realrate = False
  buffer = None

  # (mean, std) -> (alpha, beta) = (k, theta) on Wikipedia
  gamma_params = lambda mean, std: ((mean / std)**2, std**2 / mean)

  def batch_dump(self):
    if self.line_idx < len(RequestHandler.buffer):
      self.line_idx += len(RequestHandler.buffer)
      return RequestHandler.buffer
    else:
      return None

  def batch_regular(self):
    batch_size = round(random.gammavariate(*RequestHandler.gamma_params(*RequestHandler.batch_size)))

    if self.line_idx < len(RequestHandler.buffer):
      batch = RequestHandler.buffer[self.line_idx:(self.line_idx + batch_size)]
      self.line_idx += batch_size
      return batch
    else:
      return None

  # A bit hacky -- return as many lines as there "would have been" flows since last batch
  def batch_realrate(self):
    batch = []

    buffer = RequestHandler.buffer

    # Initialize realrate state
    if not hasattr(self, 'first_date'):
      # Skip header lines
      for idx, (line, date) in enumerate(buffer):
        if date is not None:
          break
        batch.append(line)
        self.line_idx += 1

      self.first_date = buffer[self.line_idx][1]
      print('first_date: {}'.format(self.first_date))
      return batch

    now = datetime.now()
    last_date_in_batch = self.first_date + (now - self.reply_start)

    if self.line_idx < len(RequestHandler.buffer):
      # Add lines
      for idx, (line, date) in enumerate(buffer[self.line_idx:]):
        if date > last_date_in_batch:
          break
        batch.append(line)
        self.line_idx += 1

      return batch

    else:
      return None

  def do_POST(self):
    self.send_response(200)
    self.end_headers()

    sleep(RequestHandler.delay)

    self.line_idx = 0
    self.cumulative_bytes = 0
    self.reply_start = datetime.now()

    while True:
      if RequestHandler.dump:
        batch = self.batch_dump()
      elif RequestHandler.realrate:
        batch = self.batch_realrate()
      else:
        batch = self.batch_regular()

      if batch is None:
        print('{}:{} file sent ({} B), hanging up'.format(*self.client_address, self.cumulative_bytes))
        break

      batch = list(filter(bool, batch))
      if len(batch) > 0:
        output = '\n'.join(batch) + '\n'
        self.cumulative_bytes += len(output)
        try:
          self.wfile.write(output.encode())
        except BrokenPipeError:
          print('{}:{} has disconnected, hanging up'.format(*self.client_address))
          break

      avg_bandwidth = self.cumulative_bytes / (datetime.now() - self.reply_start).total_seconds()
      jitter = random.gammavariate(*RequestHandler.gamma_params(*RequestHandler.jitter))
      print('{}:{} sent {} lines ({} B, {}), sleeping {:.3f} s'.format(*self.client_address, len(batch), len(output), si_prefix(avg_bandwidth, 'B/s'), jitter), file=sys.stderr)
      sleep(jitter)

def main(ip, port, path, delay, dump, realrate):
  RequestHandler.path = path
  RequestHandler.delay = delay
  RequestHandler.dump = dump
  RequestHandler.realrate = realrate
  RequestHandler.buffer = []

  # Try to extract archive
  try:
    td = TemporaryDirectory()
    tmpdir = td.name

    shutil.unpack_archive(path, tmpdir)

    # Find path of biggest file in tmpdir
    paths = [joinPath(tmpdir, p) for p in listdir(tmpdir)]
    paths = list(filter(isfile, paths))
    if paths:
      biggest_file = sorted(((p, getsize(p)) for p in paths), key=lambda x: -x[1])[0][0]
      print('Reading from {}...'.format(biggest_file))
      path = biggest_file
    else:
      print('No files found in {}'.format(path))
      return 1

  except shutil.ReadError as e:
    pass

  with open(path, 'r') as f:
    RequestHandler.buffer = list(map(str.rstrip, f.readlines()))

  len_bytes = len('\n'.join(RequestHandler.buffer))
  print('Read {} lines ({} B ≈ {})'.format(len(RequestHandler.buffer), len_bytes, si_prefix(len_bytes, 'B')))

  if realrate:
    # Parse by date & sort ascending
    parse_start = datetime.now()
    RequestHandler.buffer = [(line, parse_date(line, 0)) for line in RequestHandler.buffer]
    none_date = datetime.fromtimestamp(0, timezone.utc)
    RequestHandler.buffer.sort(key=lambda item: item[1] if item[1] is not None else none_date)
    print('realrate: dates parsed in {:.3f} s'.format((datetime.now() - parse_start).total_seconds()))

  httpd = Server((ip, port), RequestHandler)
  print('Serving {} on http://{}:{}/ {}...'.format(path, ip, port, 'with {} s delay '.format(delay) if delay else ''))
  httpd.serve_forever()

if __name__ == '__main__':
  parser = argparse.ArgumentParser()
  parser.add_argument('path', type=str, help='file to replay line-by-line')
  parser.add_argument('--ip', nargs='?', default='127.0.0.1', help='address to bind server on [default: 127.0.0.1]')
  parser.add_argument('port', nargs='?', type=int, default=8000, help='port to serve on [default: 8000]')
  parser.add_argument('--delay', nargs='?', type=float, default=0.0, help='delay in secs before starting each stream [default: 0.0]')
  parser.add_argument('--dump', action='store_true', help='output entire file at once (cannot be used with --real)')
  parser.add_argument('--real', action='store_true', help='output lines at same rate as its timestamp (cannot be used with --dump)')

  args = parser.parse_args()

  if args.dump and args.real:
    print('cannot use --dump & --real together')
    sys.exit(1)

  main(args.ip, args.port, args.path, delay=args.delay, dump=args.dump, realrate=args.real)
