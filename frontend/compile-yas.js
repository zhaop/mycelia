import antlr4 from 'antlr4/index'
import { ParseCancellationException } from 'antlr4/error/Errors'
import memoize from 'lodash/memoize'
import { YasJsFunctionCompiler } from './yas-jsfunction-compiler'
import { YasLexer } from './yas/YasLexer'
import { YasParser } from './yas/YasParser'

// Thanks https://stackoverflow.com/questions/18132078/handling-errors-in-antlr4
class ThrowingErrorListener {
  syntaxError(recognizer, offendingSymbol, line, charPositionInLine, msg, exception) {
    throw new ParseCancellationException(msg)
  }
}

function compile(source) {
  const errorListener = new ThrowingErrorListener()

  const chars = new antlr4.InputStream(source)
  const lexer = new YasLexer(chars)
  lexer.removeErrorListeners()
  lexer.addErrorListener(errorListener)

  const tokens = new antlr4.CommonTokenStream(lexer)
  const parser = new YasParser(tokens)
  parser.buildParseTrees = true
  parser.removeErrorListeners()
  parser.addErrorListener(errorListener)

  try {
    const tree = parser.boolExpr()
    const output = {stack: [], vars: new Set()}
    const listener = new YasJsFunctionCompiler(output)
    antlr4.tree.ParseTreeWalker.DEFAULT.walk(listener, tree)

    const {stack, vars} = output

    if (stack.length != 1)
      console.warn('unclean stack (should only have 1 entry left)', stack);

    if (!stack.length)
      return false

    return {fn: stack[0], vars: vars}

  } catch (e) {
    return false
  }
}

export const compileYas = memoize(compile)