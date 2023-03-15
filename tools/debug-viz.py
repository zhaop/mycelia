# Run this file in interactive mode: python3 -i debug-viz.py

import argparse
from datetime import datetime, timedelta
from dateutil.parser import parse as parse_date
from dateutil.tz import tzutc
from math import isnan
import pandas as pd
from time import time

def iat(t):
	return (d['start'] <= t) & (d['end'] >= t)

# Return all flows happening at `t`
def at(t):
	return d[iat(t)]

# Return flow differences between `t1` and `t2`
def diff(t1, t2):
	return {
		'removed': d[iat(t1) & ~iat(t2)],
		'added': d[~iat(t1) & iat(t2)],
	}

if __name__ == '__main__':

	parser = argparse.ArgumentParser()
	parser.add_argument('path')
	args = parser.parse_args()

	print('Reading from {}... '.format(args.path), end='', flush=True)
	t0 = time()
	d = pd.read_csv(args.path, memory_map=True, parse_dates=['ts'])
	print('done [{:.3} s].'.format(time() - t0))

	print('Processing... ', end='', flush=True)
	t0 = time()
	d['start'] = d['ts']
	d['duration'] = d['duration'].map(lambda x: timedelta(seconds=x))
	d['mid'] = d['start'] + 0.5*d['duration']
	d['end'] = d['start'] + d['duration']
	print('done [{:.3} s].'.format(time() - t0))

	t0 = d['start'].min()
	dt = timedelta(seconds=1000/20)

	t1 = parse_date('2019-08-28T06:05:00Z')
	t2 = parse_date('2019-08-28T06:05:00.2Z')
