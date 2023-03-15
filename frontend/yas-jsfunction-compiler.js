import { YasListener } from './yas/YasListener'

// Library of ops
// Keep these functions pure.

// General ops
const just = (n) => env => n
const read = (v) => env => env[v]

// Binary ops (comparison, logic)
const lt = (a, b) => env => a(env) < b(env)
const lte = (a, b) => env => a(env) <= b(env)
const gt = (a, b) => env => a(env) > b(env)
const gte = (a, b) => env => a(env) >= b(env)
const eq = (a, b) => env => a(env) == b(env)
const neq = (a, b) => env => a(env) != b(env)
const and = (a, b) => env => a(env) && b(env)
const or = (a, b) => env => a(env) || b(env)
const not = (a) => env => !a(env)

// Math functions
const max = (a) => env => Math.max(...a(env))
const min = (a) => env => Math.min(...a(env))
const sum = (a) => env => {
  let o = 0
  for (const i of a(env))
    o += i;
  return o
}

// Set membership
const intIn = (a, b) => env => b(env).has(a(env))
const intNotin = (a, b) => env => !b(env).has(a(env))

// Set construction
const set = (args) => env => new Set(args.map(arg => arg(env)))

// Set equality
const setEq = (a, b) => env => {
  const av = a(env)
  const bv = b(env)
  if (av.size != bv.size) return false;
  for (const i of av) if (!bv.has(i)) return false;
  return true
}
const setNeq = (a, b) => env => {
  const av = a(env)
  const bv = b(env)
  if (av.size != bv.size) return true;
  for (const i of av) if (!bv.has(i)) return true;
  return false
}

// Int-set comparison
const allLt = (a, b) => env => {
  const bv = b(env)
  for (const i of a(env)) if (!(i < bv)) return false;
  return true
}
const allLte = (a, b) => env => {
  const bv = b(env)
  for (const i of a(env)) if (!(i <= bv)) return false;
  return true
}
const allGt = (a, b) => env => {
  const bv = b(env)
  for (const i of a(env)) if (!(i > bv)) return false;
  return true
}
const allGte = (a, b) => env => {
  const bv = b(env)
  for (const i of a(env)) if (!(i >= bv)) return false;
  return true
}
const anyLt = (a, b) => env => {
  const bv = b(env)
  for (const i of a(env)) if (i < bv) return true;
  return false
}
const anyLte = (a, b) => env => {
  const bv = b(env)
  for (const i of a(env)) if (i <= bv) return true;
  return false
}
const anyGt = (a, b) => env => {
  const bv = b(env)
  for (const i of a(env)) if (i > bv) return true;
  return false
}
const anyGte = (a, b) => env => {
  const bv = b(env)
  for (const i of a(env)) if (i >= bv) return true;
  return false
}

// Set-set comparison
const allIn = (a, b) => env => {
  const av = a(env)
  const bv = b(env)
  if (av.size < bv.size) {
    for (const i of av) if (!bv.has(i)) return false;
  } else {
    for (const i of bv) if (!av.has(i)) return false;
  }
  return true
}
const anyIn = (a, b) => env => {
  const av = a(env)
  const bv = b(env)
  if (av.size < bv.size) {
    for (const i of av) if (bv.has(i)) return true;
  } else {
    for (const i of bv) if (av.has(i)) return true;
  }
  return false
}
const allNotin = (a, b) => env => !anyIn(a, b)(env)
const anyNotin = (a, b) => env => !allIn(a, b)(env)

// Set operations
const diff = (a, b) => env => {
  const o = new Set()
  const bv = b(env)
  for (const i of a(env)) if (!bv.has(i)) o.add(i);
  return o
}
const inter = (a, b) => env => {
  const o = new Set()
  const av = a(env)
  const bv = b(env)
  if (av.size < bv.size) {
    for (const i of av) if (bv.has(i)) o.add(i);
  } else {
    for (const i of bv) if (av.has(i)) o.add(i);
  }
  return o
}
const union = (a, b) => env => {
  const o = new Set()
  for (const i of a(env)) o.add(i);
  for (const i of b(env)) o.add(i);
  return o
}

// In general, each exit function:
// - pops the arguments for the op from the stack
// - pushes a function (env => result) on to the stack
// and each op only reads from env, never writes.
// Usually exit*(Literal|Paren|Var)Expr don't need to do anything.

export class YasJsFunctionCompiler extends YasListener {
  constructor(output) {
    super()

    this.stack = output.stack
    this.vars = output.vars
  }

  pop() {
    return this.stack.pop()
  }

  push(thing) {
    this.stack.push(thing)
  }

  // exitExpr(ctx) {}

  exitIntLiteral(ctx) {
    const prefixes = {
      'k': 1e3,
      'M': 1e6,
      'G': 1e9,
      'T': 1e12,
      'P': 1e15,
      'E': 1e18,
      'Z': 1e21,
      'Y': 1e24,
    }

    let n = parseInt(ctx.NUMBER().getText(), 10)

    if (ctx.METRIC_PREFIX())
      n *= prefixes[ctx.METRIC_PREFIX().getText()];

    this.push(just(n))
  }

  exitIntVar(ctx) {
    if (ctx.DURATION()) {
      this.vars.add('duration')
      this.push(read('duration'))
    }
  }

  // exitIntParenExpr(ctx) {}

  exitIntFunExpr(ctx) {
    const a = this.pop()

    if (ctx.MAX())
      this.push(max(a));
    else if (ctx.MIN())
      this.push(min(a));
    else if (ctx.SUM())
      this.push(sum(a));
  }

  // exitIntVarExpr(ctx) {}

  // exitIntLiteralExpr(ctx) {}

  enterIntsetLiteral(ctx) {
    // Push 'undefined' placeholder on stack
    // (Popping an empty stack also results in undefined)
    this.push(undefined)
  }

  exitIntsetLiteral(ctx) {
    const args = []

    let arg
    while ((arg = this.pop()) !== undefined) {
      args.push(arg)
    }

    this.push(set(args))
  }

  exitIntsetVar(ctx) {
    if (ctx.BYTES()) {
      this.vars.add('bytes')
      this.push(read('bytes'))

    } else if (ctx.PACKETS()) {
      this.vars.add('packets')
      this.push(read('packets'))

    } else if (ctx.PORTS()) {
      this.vars.add('ports')
      this.push(read('ports'))
    }
  }

  // exitIntsetParenExpr(ctx) {}

  exitIntsetDiffExpr(ctx) {
    const b = this.pop()
    const a = this.pop()

    this.push(diff(a, b))
  }

  exitIntsetInterExpr(ctx) {
    const b = this.pop()
    const a = this.pop()

    this.push(inter(a, b))
  }

  exitIntsetUnionExpr(ctx) {
    const b = this.pop()
    const a = this.pop()

    this.push(union(a, b))
  }

  // exitIntsetVarExpr(ctx) {}

  // exitIntsetLiteralExpr(ctx) {}

  exitBoolLiteral(ctx) {
    if (ctx.TRUE())
      this.push(just(true));
    else if (ctx.FALSE())
      this.push(just(false));
  }

  exitBoolVar(ctx) {
    if (ctx.TCP()) {
      this.vars.add('tcp')
      this.push(read('tcp'))

    } else if (ctx.UDP()) {
      this.vars.add('udp')
      this.push(read('udp'))
    }
  }

  exitAllCmpExpr(ctx) {
    const b = this.pop()  // intExpr
    const a = this.pop()  // intsetExpr

    if (ctx.LT())
      this.push(allLt(a, b));
    else if (ctx.LTE())
      this.push(allLte(a, b));
    else if (ctx.GT())
      this.push(allGt(a, b));
    else if (ctx.GTE())
      this.push(allGte(a, b));
  }

  exitAnyInExpr(ctx) {
    const b = this.pop()
    const a = this.pop()

    this.push(anyIn(a, b))
  }

  // exitBoolVarExpr(ctx) {}

  exitIntNotinExpr(ctx) {
    const b = this.pop()  // intsetExpr
    const a = this.pop()  // intExpr

    this.push(intNotin(a, b))
  }

  // exitBoolParenExpr(ctx) {}

  exitIntsetCmpExpr(ctx) {
    const b = this.pop()
    const a = this.pop()

    if (ctx.EQ())
      this.push(setEq(a, b));
    else if (ctx.NEQ())
      this.push(setNeq(a, b));
  }

  exitIntInExpr(ctx) {
    const b = this.pop()  // intsetExpr
    const a = this.pop()  // intExpr

    this.push(intIn(a, b))
  }

  exitIntCmpExpr(ctx) {
    const b = this.pop()
    const a = this.pop()

    if (ctx.LT())
      this.push(lt(a, b));
    else if (ctx.GT())
      this.push(gt(a, b));
    else if (ctx.LTE())
      this.push(lte(a, b));
    else if (ctx.GTE())
      this.push(gte(a, b));
    else if (ctx.EQ())
      this.push(eq(a, b));
    else if (ctx.NEQ())
      this.push(neq(a, b));
  }

  exitNotExpr(ctx) {
    const a = this.pop()
    this.push(not(a))
  }

  exitAllInExpr(ctx) {
    const b = this.pop()
    const a = this.pop()

    this.push(allIn(a, b))
  }

  exitAnyNotinExpr(ctx) {
    const b = this.pop()
    const a = this.pop()

    this.push(anyNotin(a, b))
  }

  exitAnyCmpExpr(ctx) {
    const b = this.pop()  // intExpr
    const a = this.pop()  // intsetExpr

    if (ctx.LT())
      this.push(anyLt(a, b));
    else if (ctx.LTE())
      this.push(anyLte(a, b));
    else if (ctx.GT())
      this.push(anyGt(a, b));
    else if (ctx.GTE())
      this.push(anyGte(a, b));
  }

  exitAndOrExpr(ctx) {
    const b = this.pop()
    const a = this.pop()

    if (ctx.AND())
      this.push(and(a, b));
    if (ctx.OR())
      this.push(or(a, b));
  }

  // exitBoolLiteralExpr(ctx) {}

  exitAllNotinExpr(ctx) {
    const b = this.pop()
    const a = this.pop()

    this.push(allNotin(a, b))
  }
}