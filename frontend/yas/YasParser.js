// Generated from Yas.g4 by ANTLR 4.7.2
// jshint ignore: start
var antlr4 = require('antlr4/index');
var YasListener = require('./YasListener').YasListener;
var grammarFileName = "Yas.g4";

var serializedATN = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964",
    "\u0003\'\u00a2\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004\u0004\t",
    "\u0004\u0004\u0005\t\u0005\u0004\u0006\t\u0006\u0004\u0007\t\u0007\u0004",
    "\b\t\b\u0004\t\t\t\u0004\n\t\n\u0004\u000b\t\u000b\u0004\f\t\f\u0003",
    "\u0002\u0003\u0002\u0003\u0003\u0003\u0003\u0003\u0003\u0007\u0003\u001e",
    "\n\u0003\f\u0003\u000e\u0003!\u000b\u0003\u0003\u0003\u0005\u0003$\n",
    "\u0003\u0003\u0004\u0003\u0004\u0005\u0004(\n\u0004\u0003\u0005\u0003",
    "\u0005\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006\u0003",
    "\u0006\u0003\u0006\u0003\u0006\u0005\u00064\n\u0006\u0003\u0007\u0003",
    "\u0007\u0003\u0007\u0003\u0007\u0007\u0007:\n\u0007\f\u0007\u000e\u0007",
    "=\u000b\u0007\u0003\u0007\u0005\u0007@\n\u0007\u0003\u0007\u0003\u0007",
    "\u0003\b\u0003\b\u0003\t\u0003\t\u0003\t\u0003\t\u0003\t\u0003\t\u0003",
    "\t\u0003\t\u0003\t\u0003\t\u0003\t\u0003\t\u0003\t\u0003\t\u0003\t\u0003",
    "\t\u0003\t\u0003\t\u0005\tX\n\t\u0003\n\u0003\n\u0003\u000b\u0003\u000b",
    "\u0003\f\u0003\f\u0003\f\u0003\f\u0003\f\u0003\f\u0003\f\u0003\f\u0003",
    "\f\u0003\f\u0003\f\u0003\f\u0003\f\u0003\f\u0003\f\u0003\f\u0003\f\u0003",
    "\f\u0003\f\u0003\f\u0003\f\u0003\f\u0003\f\u0003\f\u0003\f\u0003\f\u0003",
    "\f\u0003\f\u0003\f\u0003\f\u0003\f\u0003\f\u0003\f\u0003\f\u0003\f\u0003",
    "\f\u0003\f\u0003\f\u0003\f\u0003\f\u0003\f\u0003\f\u0003\f\u0003\f\u0003",
    "\f\u0003\f\u0003\f\u0003\f\u0003\f\u0003\f\u0003\f\u0003\f\u0003\f\u0003",
    "\f\u0003\f\u0003\f\u0003\f\u0003\f\u0005\f\u0098\n\f\u0003\f\u0003\f",
    "\u0003\f\u0007\f\u009d\n\f\f\f\u000e\f\u00a0\u000b\f\u0003\f\u0002\u0003",
    "\u0016\r\u0002\u0004\u0006\b\n\f\u000e\u0010\u0012\u0014\u0016\u0002",
    "\n\u0003\u0002\u0011\u0013\u0004\u0002\u001d\u001d\u001f \u0003\u0002",
    "\u001b\u001c\u0003\u0002!\"\u0003\u0002\u0015\u001a\u0003\u0002\u0017",
    "\u0018\u0004\u0002\u0015\u0016\u0019\u001a\u0004\u0002\u000e\u000e\u0014",
    "\u0014\u0002\u00b1\u0002\u0018\u0003\u0002\u0002\u0002\u0004\u001a\u0003",
    "\u0002\u0002\u0002\u0006%\u0003\u0002\u0002\u0002\b)\u0003\u0002\u0002",
    "\u0002\n3\u0003\u0002\u0002\u0002\f5\u0003\u0002\u0002\u0002\u000eC",
    "\u0003\u0002\u0002\u0002\u0010W\u0003\u0002\u0002\u0002\u0012Y\u0003",
    "\u0002\u0002\u0002\u0014[\u0003\u0002\u0002\u0002\u0016\u0097\u0003",
    "\u0002\u0002\u0002\u0018\u0019\u0005\u0016\f\u0002\u0019\u0003\u0003",
    "\u0002\u0002\u0002\u001a\u001f\u0005\u0002\u0002\u0002\u001b\u001c\u0007",
    "&\u0002\u0002\u001c\u001e\u0005\u0002\u0002\u0002\u001d\u001b\u0003",
    "\u0002\u0002\u0002\u001e!\u0003\u0002\u0002\u0002\u001f\u001d\u0003",
    "\u0002\u0002\u0002\u001f \u0003\u0002\u0002\u0002 #\u0003\u0002\u0002",
    "\u0002!\u001f\u0003\u0002\u0002\u0002\"$\u0007&\u0002\u0002#\"\u0003",
    "\u0002\u0002\u0002#$\u0003\u0002\u0002\u0002$\u0005\u0003\u0002\u0002",
    "\u0002%\'\u0007#\u0002\u0002&(\u0007\u000b\u0002\u0002\'&\u0003\u0002",
    "\u0002\u0002\'(\u0003\u0002\u0002\u0002(\u0007\u0003\u0002\u0002\u0002",
    ")*\u0007\u001e\u0002\u0002*\t\u0003\u0002\u0002\u0002+,\u0007\u0003",
    "\u0002\u0002,-\u0005\n\u0006\u0002-.\u0007\u0004\u0002\u0002.4\u0003",
    "\u0002\u0002\u0002/0\t\u0002\u0002\u000204\u0005\u0010\t\u000214\u0005",
    "\b\u0005\u000224\u0005\u0006\u0004\u00023+\u0003\u0002\u0002\u00023",
    "/\u0003\u0002\u0002\u000231\u0003\u0002\u0002\u000232\u0003\u0002\u0002",
    "\u00024\u000b\u0003\u0002\u0002\u000256\u0007\u0005\u0002\u00026;\u0005",
    "\n\u0006\u000278\u0007\u0006\u0002\u00028:\u0005\n\u0006\u000297\u0003",
    "\u0002\u0002\u0002:=\u0003\u0002\u0002\u0002;9\u0003\u0002\u0002\u0002",
    ";<\u0003\u0002\u0002\u0002<?\u0003\u0002\u0002\u0002=;\u0003\u0002\u0002",
    "\u0002>@\u0007\u0006\u0002\u0002?>\u0003\u0002\u0002\u0002?@\u0003\u0002",
    "\u0002\u0002@A\u0003\u0002\u0002\u0002AB\u0007\u0007\u0002\u0002B\r",
    "\u0003\u0002\u0002\u0002CD\t\u0003\u0002\u0002D\u000f\u0003\u0002\u0002",
    "\u0002EF\u0007\u0003\u0002\u0002FG\u0005\u0010\t\u0002GH\u0007\u0004",
    "\u0002\u0002HX\u0003\u0002\u0002\u0002IJ\u0005\f\u0007\u0002JK\u0007",
    "\b\u0002\u0002KL\u0005\f\u0007\u0002LX\u0003\u0002\u0002\u0002MN\u0005",
    "\f\u0007\u0002NO\u0007\t\u0002\u0002OP\u0005\f\u0007\u0002PX\u0003\u0002",
    "\u0002\u0002QR\u0005\f\u0007\u0002RS\u0007\n\u0002\u0002ST\u0005\f\u0007",
    "\u0002TX\u0003\u0002\u0002\u0002UX\u0005\u000e\b\u0002VX\u0005\f\u0007",
    "\u0002WE\u0003\u0002\u0002\u0002WI\u0003\u0002\u0002\u0002WM\u0003\u0002",
    "\u0002\u0002WQ\u0003\u0002\u0002\u0002WU\u0003\u0002\u0002\u0002WV\u0003",
    "\u0002\u0002\u0002X\u0011\u0003\u0002\u0002\u0002YZ\t\u0004\u0002\u0002",
    "Z\u0013\u0003\u0002\u0002\u0002[\\\t\u0005\u0002\u0002\\\u0015\u0003",
    "\u0002\u0002\u0002]^\b\f\u0001\u0002^_\u0007\u0003\u0002\u0002_`\u0005",
    "\u0016\f\u0002`a\u0007\u0004\u0002\u0002a\u0098\u0003\u0002\u0002\u0002",
    "bc\u0005\n\u0006\u0002cd\t\u0006\u0002\u0002de\u0005\n\u0006\u0002e",
    "\u0098\u0003\u0002\u0002\u0002fg\u0005\n\u0006\u0002gh\u0007\u0010\u0002",
    "\u0002hi\u0007\u000f\u0002\u0002ij\u0005\u0010\t\u0002j\u0098\u0003",
    "\u0002\u0002\u0002kl\u0005\n\u0006\u0002lm\u0007\u000f\u0002\u0002m",
    "n\u0005\u0010\t\u0002n\u0098\u0003\u0002\u0002\u0002op\u0005\u0010\t",
    "\u0002pq\t\u0007\u0002\u0002qr\u0005\u0010\t\u0002r\u0098\u0003\u0002",
    "\u0002\u0002st\u0007\r\u0002\u0002tu\u0005\u0010\t\u0002uv\t\b\u0002",
    "\u0002vw\u0005\n\u0006\u0002w\u0098\u0003\u0002\u0002\u0002xy\u0007",
    "\f\u0002\u0002yz\u0005\u0010\t\u0002z{\t\b\u0002\u0002{|\u0005\n\u0006",
    "\u0002|\u0098\u0003\u0002\u0002\u0002}~\u0007\r\u0002\u0002~\u007f\u0005",
    "\u0010\t\u0002\u007f\u0080\u0007\u0010\u0002\u0002\u0080\u0081\u0007",
    "\u000f\u0002\u0002\u0081\u0082\u0005\u0010\t\u0002\u0082\u0098\u0003",
    "\u0002\u0002\u0002\u0083\u0084\u0007\r\u0002\u0002\u0084\u0085\u0005",
    "\u0010\t\u0002\u0085\u0086\u0007\u000f\u0002\u0002\u0086\u0087\u0005",
    "\u0010\t\u0002\u0087\u0098\u0003\u0002\u0002\u0002\u0088\u0089\u0007",
    "\f\u0002\u0002\u0089\u008a\u0005\u0010\t\u0002\u008a\u008b\u0007\u0010",
    "\u0002\u0002\u008b\u008c\u0007\u000f\u0002\u0002\u008c\u008d\u0005\u0010",
    "\t\u0002\u008d\u0098\u0003\u0002\u0002\u0002\u008e\u008f\u0007\f\u0002",
    "\u0002\u008f\u0090\u0005\u0010\t\u0002\u0090\u0091\u0007\u000f\u0002",
    "\u0002\u0091\u0092\u0005\u0010\t\u0002\u0092\u0098\u0003\u0002\u0002",
    "\u0002\u0093\u0094\u0007\u0010\u0002\u0002\u0094\u0098\u0005\u0016\f",
    "\u0006\u0095\u0098\u0005\u0014\u000b\u0002\u0096\u0098\u0005\u0012\n",
    "\u0002\u0097]\u0003\u0002\u0002\u0002\u0097b\u0003\u0002\u0002\u0002",
    "\u0097f\u0003\u0002\u0002\u0002\u0097k\u0003\u0002\u0002\u0002\u0097",
    "o\u0003\u0002\u0002\u0002\u0097s\u0003\u0002\u0002\u0002\u0097x\u0003",
    "\u0002\u0002\u0002\u0097}\u0003\u0002\u0002\u0002\u0097\u0083\u0003",
    "\u0002\u0002\u0002\u0097\u0088\u0003\u0002\u0002\u0002\u0097\u008e\u0003",
    "\u0002\u0002\u0002\u0097\u0093\u0003\u0002\u0002\u0002\u0097\u0095\u0003",
    "\u0002\u0002\u0002\u0097\u0096\u0003\u0002\u0002\u0002\u0098\u009e\u0003",
    "\u0002\u0002\u0002\u0099\u009a\f\u0005\u0002\u0002\u009a\u009b\t\t\u0002",
    "\u0002\u009b\u009d\u0005\u0016\f\u0006\u009c\u0099\u0003\u0002\u0002",
    "\u0002\u009d\u00a0\u0003\u0002\u0002\u0002\u009e\u009c\u0003\u0002\u0002",
    "\u0002\u009e\u009f\u0003\u0002\u0002\u0002\u009f\u0017\u0003\u0002\u0002",
    "\u0002\u00a0\u009e\u0003\u0002\u0002\u0002\u000b\u001f#\'3;?W\u0097",
    "\u009e"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

var sharedContextCache = new antlr4.PredictionContextCache();

var literalNames = [ null, "'('", "')'", "'['", "','", "']'", "'-'", "'&'", 
                     "'|'", null, "'any'", "'all'", "'and'", "'in'", "'not'", 
                     "'max'", "'min'", "'sum'", "'or'", "'<'", "'<='", "'='", 
                     "'!='", "'>='", "'>'", "'true'", "'false'", "'bytes'", 
                     "'duration'", "'packets'", "'ports'", "'tcp'", "'udp'" ];

var symbolicNames = [ null, null, null, null, null, null, null, null, null, 
                      "METRIC_PREFIX", "ANY", "ALL", "AND", "IN", "NOT", 
                      "MAX", "MIN", "SUM", "OR", "LT", "LTE", "EQ", "NEQ", 
                      "GTE", "GT", "TRUE", "FALSE", "BYTES", "DURATION", 
                      "PACKETS", "PORTS", "TCP", "UDP", "NUMBER", "WORD", 
                      "WHITESPACE", "NEWLINE", "LEFTOVER" ];

var ruleNames =  [ "expr", "doc", "intLiteral", "intVar", "intExpr", "intsetLiteral", 
                   "intsetVar", "intsetExpr", "boolLiteral", "boolVar", 
                   "boolExpr" ];

function YasParser (input) {
	antlr4.Parser.call(this, input);
    this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
    this.ruleNames = ruleNames;
    this.literalNames = literalNames;
    this.symbolicNames = symbolicNames;
    return this;
}

YasParser.prototype = Object.create(antlr4.Parser.prototype);
YasParser.prototype.constructor = YasParser;

Object.defineProperty(YasParser.prototype, "atn", {
	get : function() {
		return atn;
	}
});

YasParser.EOF = antlr4.Token.EOF;
YasParser.T__0 = 1;
YasParser.T__1 = 2;
YasParser.T__2 = 3;
YasParser.T__3 = 4;
YasParser.T__4 = 5;
YasParser.T__5 = 6;
YasParser.T__6 = 7;
YasParser.T__7 = 8;
YasParser.METRIC_PREFIX = 9;
YasParser.ANY = 10;
YasParser.ALL = 11;
YasParser.AND = 12;
YasParser.IN = 13;
YasParser.NOT = 14;
YasParser.MAX = 15;
YasParser.MIN = 16;
YasParser.SUM = 17;
YasParser.OR = 18;
YasParser.LT = 19;
YasParser.LTE = 20;
YasParser.EQ = 21;
YasParser.NEQ = 22;
YasParser.GTE = 23;
YasParser.GT = 24;
YasParser.TRUE = 25;
YasParser.FALSE = 26;
YasParser.BYTES = 27;
YasParser.DURATION = 28;
YasParser.PACKETS = 29;
YasParser.PORTS = 30;
YasParser.TCP = 31;
YasParser.UDP = 32;
YasParser.NUMBER = 33;
YasParser.WORD = 34;
YasParser.WHITESPACE = 35;
YasParser.NEWLINE = 36;
YasParser.LEFTOVER = 37;

YasParser.RULE_expr = 0;
YasParser.RULE_doc = 1;
YasParser.RULE_intLiteral = 2;
YasParser.RULE_intVar = 3;
YasParser.RULE_intExpr = 4;
YasParser.RULE_intsetLiteral = 5;
YasParser.RULE_intsetVar = 6;
YasParser.RULE_intsetExpr = 7;
YasParser.RULE_boolLiteral = 8;
YasParser.RULE_boolVar = 9;
YasParser.RULE_boolExpr = 10;

function ExprContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = YasParser.RULE_expr;
    return this;
}

ExprContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ExprContext.prototype.constructor = ExprContext;

ExprContext.prototype.boolExpr = function() {
    return this.getTypedRuleContext(BoolExprContext,0);
};

ExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.enterExpr(this);
	}
};

ExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.exitExpr(this);
	}
};




YasParser.ExprContext = ExprContext;

YasParser.prototype.expr = function() {

    var localctx = new ExprContext(this, this._ctx, this.state);
    this.enterRule(localctx, 0, YasParser.RULE_expr);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 22;
        this.boolExpr(0);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function DocContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = YasParser.RULE_doc;
    return this;
}

DocContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
DocContext.prototype.constructor = DocContext;

DocContext.prototype.expr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(ExprContext);
    } else {
        return this.getTypedRuleContext(ExprContext,i);
    }
};

DocContext.prototype.NEWLINE = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(YasParser.NEWLINE);
    } else {
        return this.getToken(YasParser.NEWLINE, i);
    }
};


DocContext.prototype.enterRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.enterDoc(this);
	}
};

DocContext.prototype.exitRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.exitDoc(this);
	}
};




YasParser.DocContext = DocContext;

YasParser.prototype.doc = function() {

    var localctx = new DocContext(this, this._ctx, this.state);
    this.enterRule(localctx, 2, YasParser.RULE_doc);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 24;
        this.expr();
        this.state = 29;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,0,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                this.state = 25;
                this.match(YasParser.NEWLINE);
                this.state = 26;
                this.expr(); 
            }
            this.state = 31;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,0,this._ctx);
        }

        this.state = 33;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===YasParser.NEWLINE) {
            this.state = 32;
            this.match(YasParser.NEWLINE);
        }

    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function IntLiteralContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = YasParser.RULE_intLiteral;
    return this;
}

IntLiteralContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
IntLiteralContext.prototype.constructor = IntLiteralContext;

IntLiteralContext.prototype.NUMBER = function() {
    return this.getToken(YasParser.NUMBER, 0);
};

IntLiteralContext.prototype.METRIC_PREFIX = function() {
    return this.getToken(YasParser.METRIC_PREFIX, 0);
};

IntLiteralContext.prototype.enterRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.enterIntLiteral(this);
	}
};

IntLiteralContext.prototype.exitRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.exitIntLiteral(this);
	}
};




YasParser.IntLiteralContext = IntLiteralContext;

YasParser.prototype.intLiteral = function() {

    var localctx = new IntLiteralContext(this, this._ctx, this.state);
    this.enterRule(localctx, 4, YasParser.RULE_intLiteral);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 35;
        this.match(YasParser.NUMBER);
        this.state = 37;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,2,this._ctx);
        if(la_===1) {
            this.state = 36;
            this.match(YasParser.METRIC_PREFIX);

        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function IntVarContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = YasParser.RULE_intVar;
    return this;
}

IntVarContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
IntVarContext.prototype.constructor = IntVarContext;

IntVarContext.prototype.DURATION = function() {
    return this.getToken(YasParser.DURATION, 0);
};

IntVarContext.prototype.enterRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.enterIntVar(this);
	}
};

IntVarContext.prototype.exitRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.exitIntVar(this);
	}
};




YasParser.IntVarContext = IntVarContext;

YasParser.prototype.intVar = function() {

    var localctx = new IntVarContext(this, this._ctx, this.state);
    this.enterRule(localctx, 6, YasParser.RULE_intVar);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 39;
        this.match(YasParser.DURATION);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function IntExprContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = YasParser.RULE_intExpr;
    return this;
}

IntExprContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
IntExprContext.prototype.constructor = IntExprContext;


 
IntExprContext.prototype.copyFrom = function(ctx) {
    antlr4.ParserRuleContext.prototype.copyFrom.call(this, ctx);
};


function IntLiteralExprContext(parser, ctx) {
	IntExprContext.call(this, parser);
    IntExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

IntLiteralExprContext.prototype = Object.create(IntExprContext.prototype);
IntLiteralExprContext.prototype.constructor = IntLiteralExprContext;

YasParser.IntLiteralExprContext = IntLiteralExprContext;

IntLiteralExprContext.prototype.intLiteral = function() {
    return this.getTypedRuleContext(IntLiteralContext,0);
};
IntLiteralExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.enterIntLiteralExpr(this);
	}
};

IntLiteralExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.exitIntLiteralExpr(this);
	}
};


function IntVarExprContext(parser, ctx) {
	IntExprContext.call(this, parser);
    IntExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

IntVarExprContext.prototype = Object.create(IntExprContext.prototype);
IntVarExprContext.prototype.constructor = IntVarExprContext;

YasParser.IntVarExprContext = IntVarExprContext;

IntVarExprContext.prototype.intVar = function() {
    return this.getTypedRuleContext(IntVarContext,0);
};
IntVarExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.enterIntVarExpr(this);
	}
};

IntVarExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.exitIntVarExpr(this);
	}
};


function IntParenExprContext(parser, ctx) {
	IntExprContext.call(this, parser);
    IntExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

IntParenExprContext.prototype = Object.create(IntExprContext.prototype);
IntParenExprContext.prototype.constructor = IntParenExprContext;

YasParser.IntParenExprContext = IntParenExprContext;

IntParenExprContext.prototype.intExpr = function() {
    return this.getTypedRuleContext(IntExprContext,0);
};
IntParenExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.enterIntParenExpr(this);
	}
};

IntParenExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.exitIntParenExpr(this);
	}
};


function IntFunExprContext(parser, ctx) {
	IntExprContext.call(this, parser);
    IntExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

IntFunExprContext.prototype = Object.create(IntExprContext.prototype);
IntFunExprContext.prototype.constructor = IntFunExprContext;

YasParser.IntFunExprContext = IntFunExprContext;

IntFunExprContext.prototype.intsetExpr = function() {
    return this.getTypedRuleContext(IntsetExprContext,0);
};

IntFunExprContext.prototype.MAX = function() {
    return this.getToken(YasParser.MAX, 0);
};

IntFunExprContext.prototype.MIN = function() {
    return this.getToken(YasParser.MIN, 0);
};

IntFunExprContext.prototype.SUM = function() {
    return this.getToken(YasParser.SUM, 0);
};
IntFunExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.enterIntFunExpr(this);
	}
};

IntFunExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.exitIntFunExpr(this);
	}
};



YasParser.IntExprContext = IntExprContext;

YasParser.prototype.intExpr = function() {

    var localctx = new IntExprContext(this, this._ctx, this.state);
    this.enterRule(localctx, 8, YasParser.RULE_intExpr);
    var _la = 0; // Token type
    try {
        this.state = 49;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case YasParser.T__0:
            localctx = new IntParenExprContext(this, localctx);
            this.enterOuterAlt(localctx, 1);
            this.state = 41;
            this.match(YasParser.T__0);
            this.state = 42;
            this.intExpr();
            this.state = 43;
            this.match(YasParser.T__1);
            break;
        case YasParser.MAX:
        case YasParser.MIN:
        case YasParser.SUM:
            localctx = new IntFunExprContext(this, localctx);
            this.enterOuterAlt(localctx, 2);
            this.state = 45;
            _la = this._input.LA(1);
            if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << YasParser.MAX) | (1 << YasParser.MIN) | (1 << YasParser.SUM))) !== 0))) {
            this._errHandler.recoverInline(this);
            }
            else {
            	this._errHandler.reportMatch(this);
                this.consume();
            }
            this.state = 46;
            this.intsetExpr();
            break;
        case YasParser.DURATION:
            localctx = new IntVarExprContext(this, localctx);
            this.enterOuterAlt(localctx, 3);
            this.state = 47;
            this.intVar();
            break;
        case YasParser.NUMBER:
            localctx = new IntLiteralExprContext(this, localctx);
            this.enterOuterAlt(localctx, 4);
            this.state = 48;
            this.intLiteral();
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function IntsetLiteralContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = YasParser.RULE_intsetLiteral;
    return this;
}

IntsetLiteralContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
IntsetLiteralContext.prototype.constructor = IntsetLiteralContext;

IntsetLiteralContext.prototype.intExpr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(IntExprContext);
    } else {
        return this.getTypedRuleContext(IntExprContext,i);
    }
};

IntsetLiteralContext.prototype.enterRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.enterIntsetLiteral(this);
	}
};

IntsetLiteralContext.prototype.exitRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.exitIntsetLiteral(this);
	}
};




YasParser.IntsetLiteralContext = IntsetLiteralContext;

YasParser.prototype.intsetLiteral = function() {

    var localctx = new IntsetLiteralContext(this, this._ctx, this.state);
    this.enterRule(localctx, 10, YasParser.RULE_intsetLiteral);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 51;
        this.match(YasParser.T__2);
        this.state = 52;
        this.intExpr();
        this.state = 57;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,4,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                this.state = 53;
                this.match(YasParser.T__3);
                this.state = 54;
                this.intExpr(); 
            }
            this.state = 59;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,4,this._ctx);
        }

        this.state = 61;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===YasParser.T__3) {
            this.state = 60;
            this.match(YasParser.T__3);
        }

        this.state = 63;
        this.match(YasParser.T__4);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function IntsetVarContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = YasParser.RULE_intsetVar;
    return this;
}

IntsetVarContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
IntsetVarContext.prototype.constructor = IntsetVarContext;

IntsetVarContext.prototype.BYTES = function() {
    return this.getToken(YasParser.BYTES, 0);
};

IntsetVarContext.prototype.PACKETS = function() {
    return this.getToken(YasParser.PACKETS, 0);
};

IntsetVarContext.prototype.PORTS = function() {
    return this.getToken(YasParser.PORTS, 0);
};

IntsetVarContext.prototype.enterRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.enterIntsetVar(this);
	}
};

IntsetVarContext.prototype.exitRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.exitIntsetVar(this);
	}
};




YasParser.IntsetVarContext = IntsetVarContext;

YasParser.prototype.intsetVar = function() {

    var localctx = new IntsetVarContext(this, this._ctx, this.state);
    this.enterRule(localctx, 12, YasParser.RULE_intsetVar);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 65;
        _la = this._input.LA(1);
        if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << YasParser.BYTES) | (1 << YasParser.PACKETS) | (1 << YasParser.PORTS))) !== 0))) {
        this._errHandler.recoverInline(this);
        }
        else {
        	this._errHandler.reportMatch(this);
            this.consume();
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function IntsetExprContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = YasParser.RULE_intsetExpr;
    return this;
}

IntsetExprContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
IntsetExprContext.prototype.constructor = IntsetExprContext;


 
IntsetExprContext.prototype.copyFrom = function(ctx) {
    antlr4.ParserRuleContext.prototype.copyFrom.call(this, ctx);
};


function IntsetParenExprContext(parser, ctx) {
	IntsetExprContext.call(this, parser);
    IntsetExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

IntsetParenExprContext.prototype = Object.create(IntsetExprContext.prototype);
IntsetParenExprContext.prototype.constructor = IntsetParenExprContext;

YasParser.IntsetParenExprContext = IntsetParenExprContext;

IntsetParenExprContext.prototype.intsetExpr = function() {
    return this.getTypedRuleContext(IntsetExprContext,0);
};
IntsetParenExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.enterIntsetParenExpr(this);
	}
};

IntsetParenExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.exitIntsetParenExpr(this);
	}
};


function IntsetLiteralExprContext(parser, ctx) {
	IntsetExprContext.call(this, parser);
    IntsetExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

IntsetLiteralExprContext.prototype = Object.create(IntsetExprContext.prototype);
IntsetLiteralExprContext.prototype.constructor = IntsetLiteralExprContext;

YasParser.IntsetLiteralExprContext = IntsetLiteralExprContext;

IntsetLiteralExprContext.prototype.intsetLiteral = function() {
    return this.getTypedRuleContext(IntsetLiteralContext,0);
};
IntsetLiteralExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.enterIntsetLiteralExpr(this);
	}
};

IntsetLiteralExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.exitIntsetLiteralExpr(this);
	}
};


function IntsetVarExprContext(parser, ctx) {
	IntsetExprContext.call(this, parser);
    IntsetExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

IntsetVarExprContext.prototype = Object.create(IntsetExprContext.prototype);
IntsetVarExprContext.prototype.constructor = IntsetVarExprContext;

YasParser.IntsetVarExprContext = IntsetVarExprContext;

IntsetVarExprContext.prototype.intsetVar = function() {
    return this.getTypedRuleContext(IntsetVarContext,0);
};
IntsetVarExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.enterIntsetVarExpr(this);
	}
};

IntsetVarExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.exitIntsetVarExpr(this);
	}
};


function IntsetDiffExprContext(parser, ctx) {
	IntsetExprContext.call(this, parser);
    IntsetExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

IntsetDiffExprContext.prototype = Object.create(IntsetExprContext.prototype);
IntsetDiffExprContext.prototype.constructor = IntsetDiffExprContext;

YasParser.IntsetDiffExprContext = IntsetDiffExprContext;

IntsetDiffExprContext.prototype.intsetLiteral = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(IntsetLiteralContext);
    } else {
        return this.getTypedRuleContext(IntsetLiteralContext,i);
    }
};
IntsetDiffExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.enterIntsetDiffExpr(this);
	}
};

IntsetDiffExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.exitIntsetDiffExpr(this);
	}
};


function IntsetUnionExprContext(parser, ctx) {
	IntsetExprContext.call(this, parser);
    IntsetExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

IntsetUnionExprContext.prototype = Object.create(IntsetExprContext.prototype);
IntsetUnionExprContext.prototype.constructor = IntsetUnionExprContext;

YasParser.IntsetUnionExprContext = IntsetUnionExprContext;

IntsetUnionExprContext.prototype.intsetLiteral = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(IntsetLiteralContext);
    } else {
        return this.getTypedRuleContext(IntsetLiteralContext,i);
    }
};
IntsetUnionExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.enterIntsetUnionExpr(this);
	}
};

IntsetUnionExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.exitIntsetUnionExpr(this);
	}
};


function IntsetInterExprContext(parser, ctx) {
	IntsetExprContext.call(this, parser);
    IntsetExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

IntsetInterExprContext.prototype = Object.create(IntsetExprContext.prototype);
IntsetInterExprContext.prototype.constructor = IntsetInterExprContext;

YasParser.IntsetInterExprContext = IntsetInterExprContext;

IntsetInterExprContext.prototype.intsetLiteral = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(IntsetLiteralContext);
    } else {
        return this.getTypedRuleContext(IntsetLiteralContext,i);
    }
};
IntsetInterExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.enterIntsetInterExpr(this);
	}
};

IntsetInterExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.exitIntsetInterExpr(this);
	}
};



YasParser.IntsetExprContext = IntsetExprContext;

YasParser.prototype.intsetExpr = function() {

    var localctx = new IntsetExprContext(this, this._ctx, this.state);
    this.enterRule(localctx, 14, YasParser.RULE_intsetExpr);
    try {
        this.state = 85;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,6,this._ctx);
        switch(la_) {
        case 1:
            localctx = new IntsetParenExprContext(this, localctx);
            this.enterOuterAlt(localctx, 1);
            this.state = 67;
            this.match(YasParser.T__0);
            this.state = 68;
            this.intsetExpr();
            this.state = 69;
            this.match(YasParser.T__1);
            break;

        case 2:
            localctx = new IntsetDiffExprContext(this, localctx);
            this.enterOuterAlt(localctx, 2);
            this.state = 71;
            this.intsetLiteral();
            this.state = 72;
            this.match(YasParser.T__5);
            this.state = 73;
            this.intsetLiteral();
            break;

        case 3:
            localctx = new IntsetInterExprContext(this, localctx);
            this.enterOuterAlt(localctx, 3);
            this.state = 75;
            this.intsetLiteral();
            this.state = 76;
            this.match(YasParser.T__6);
            this.state = 77;
            this.intsetLiteral();
            break;

        case 4:
            localctx = new IntsetUnionExprContext(this, localctx);
            this.enterOuterAlt(localctx, 4);
            this.state = 79;
            this.intsetLiteral();
            this.state = 80;
            this.match(YasParser.T__7);
            this.state = 81;
            this.intsetLiteral();
            break;

        case 5:
            localctx = new IntsetVarExprContext(this, localctx);
            this.enterOuterAlt(localctx, 5);
            this.state = 83;
            this.intsetVar();
            break;

        case 6:
            localctx = new IntsetLiteralExprContext(this, localctx);
            this.enterOuterAlt(localctx, 6);
            this.state = 84;
            this.intsetLiteral();
            break;

        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function BoolLiteralContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = YasParser.RULE_boolLiteral;
    return this;
}

BoolLiteralContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
BoolLiteralContext.prototype.constructor = BoolLiteralContext;

BoolLiteralContext.prototype.TRUE = function() {
    return this.getToken(YasParser.TRUE, 0);
};

BoolLiteralContext.prototype.FALSE = function() {
    return this.getToken(YasParser.FALSE, 0);
};

BoolLiteralContext.prototype.enterRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.enterBoolLiteral(this);
	}
};

BoolLiteralContext.prototype.exitRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.exitBoolLiteral(this);
	}
};




YasParser.BoolLiteralContext = BoolLiteralContext;

YasParser.prototype.boolLiteral = function() {

    var localctx = new BoolLiteralContext(this, this._ctx, this.state);
    this.enterRule(localctx, 16, YasParser.RULE_boolLiteral);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 87;
        _la = this._input.LA(1);
        if(!(_la===YasParser.TRUE || _la===YasParser.FALSE)) {
        this._errHandler.recoverInline(this);
        }
        else {
        	this._errHandler.reportMatch(this);
            this.consume();
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function BoolVarContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = YasParser.RULE_boolVar;
    return this;
}

BoolVarContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
BoolVarContext.prototype.constructor = BoolVarContext;

BoolVarContext.prototype.TCP = function() {
    return this.getToken(YasParser.TCP, 0);
};

BoolVarContext.prototype.UDP = function() {
    return this.getToken(YasParser.UDP, 0);
};

BoolVarContext.prototype.enterRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.enterBoolVar(this);
	}
};

BoolVarContext.prototype.exitRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.exitBoolVar(this);
	}
};




YasParser.BoolVarContext = BoolVarContext;

YasParser.prototype.boolVar = function() {

    var localctx = new BoolVarContext(this, this._ctx, this.state);
    this.enterRule(localctx, 18, YasParser.RULE_boolVar);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 89;
        _la = this._input.LA(1);
        if(!(_la===YasParser.TCP || _la===YasParser.UDP)) {
        this._errHandler.recoverInline(this);
        }
        else {
        	this._errHandler.reportMatch(this);
            this.consume();
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function BoolExprContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = YasParser.RULE_boolExpr;
    return this;
}

BoolExprContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
BoolExprContext.prototype.constructor = BoolExprContext;


 
BoolExprContext.prototype.copyFrom = function(ctx) {
    antlr4.ParserRuleContext.prototype.copyFrom.call(this, ctx);
};

function AllCmpExprContext(parser, ctx) {
	BoolExprContext.call(this, parser);
    BoolExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

AllCmpExprContext.prototype = Object.create(BoolExprContext.prototype);
AllCmpExprContext.prototype.constructor = AllCmpExprContext;

YasParser.AllCmpExprContext = AllCmpExprContext;

AllCmpExprContext.prototype.ALL = function() {
    return this.getToken(YasParser.ALL, 0);
};

AllCmpExprContext.prototype.intsetExpr = function() {
    return this.getTypedRuleContext(IntsetExprContext,0);
};

AllCmpExprContext.prototype.intExpr = function() {
    return this.getTypedRuleContext(IntExprContext,0);
};

AllCmpExprContext.prototype.LT = function() {
    return this.getToken(YasParser.LT, 0);
};

AllCmpExprContext.prototype.LTE = function() {
    return this.getToken(YasParser.LTE, 0);
};

AllCmpExprContext.prototype.GT = function() {
    return this.getToken(YasParser.GT, 0);
};

AllCmpExprContext.prototype.GTE = function() {
    return this.getToken(YasParser.GTE, 0);
};
AllCmpExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.enterAllCmpExpr(this);
	}
};

AllCmpExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.exitAllCmpExpr(this);
	}
};


function AnyInExprContext(parser, ctx) {
	BoolExprContext.call(this, parser);
    BoolExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

AnyInExprContext.prototype = Object.create(BoolExprContext.prototype);
AnyInExprContext.prototype.constructor = AnyInExprContext;

YasParser.AnyInExprContext = AnyInExprContext;

AnyInExprContext.prototype.ANY = function() {
    return this.getToken(YasParser.ANY, 0);
};

AnyInExprContext.prototype.intsetExpr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(IntsetExprContext);
    } else {
        return this.getTypedRuleContext(IntsetExprContext,i);
    }
};

AnyInExprContext.prototype.IN = function() {
    return this.getToken(YasParser.IN, 0);
};
AnyInExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.enterAnyInExpr(this);
	}
};

AnyInExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.exitAnyInExpr(this);
	}
};


function BoolVarExprContext(parser, ctx) {
	BoolExprContext.call(this, parser);
    BoolExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

BoolVarExprContext.prototype = Object.create(BoolExprContext.prototype);
BoolVarExprContext.prototype.constructor = BoolVarExprContext;

YasParser.BoolVarExprContext = BoolVarExprContext;

BoolVarExprContext.prototype.boolVar = function() {
    return this.getTypedRuleContext(BoolVarContext,0);
};
BoolVarExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.enterBoolVarExpr(this);
	}
};

BoolVarExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.exitBoolVarExpr(this);
	}
};


function IntNotinExprContext(parser, ctx) {
	BoolExprContext.call(this, parser);
    BoolExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

IntNotinExprContext.prototype = Object.create(BoolExprContext.prototype);
IntNotinExprContext.prototype.constructor = IntNotinExprContext;

YasParser.IntNotinExprContext = IntNotinExprContext;

IntNotinExprContext.prototype.intExpr = function() {
    return this.getTypedRuleContext(IntExprContext,0);
};

IntNotinExprContext.prototype.NOT = function() {
    return this.getToken(YasParser.NOT, 0);
};

IntNotinExprContext.prototype.IN = function() {
    return this.getToken(YasParser.IN, 0);
};

IntNotinExprContext.prototype.intsetExpr = function() {
    return this.getTypedRuleContext(IntsetExprContext,0);
};
IntNotinExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.enterIntNotinExpr(this);
	}
};

IntNotinExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.exitIntNotinExpr(this);
	}
};


function BoolParenExprContext(parser, ctx) {
	BoolExprContext.call(this, parser);
    BoolExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

BoolParenExprContext.prototype = Object.create(BoolExprContext.prototype);
BoolParenExprContext.prototype.constructor = BoolParenExprContext;

YasParser.BoolParenExprContext = BoolParenExprContext;

BoolParenExprContext.prototype.boolExpr = function() {
    return this.getTypedRuleContext(BoolExprContext,0);
};
BoolParenExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.enterBoolParenExpr(this);
	}
};

BoolParenExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.exitBoolParenExpr(this);
	}
};


function IntsetCmpExprContext(parser, ctx) {
	BoolExprContext.call(this, parser);
    BoolExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

IntsetCmpExprContext.prototype = Object.create(BoolExprContext.prototype);
IntsetCmpExprContext.prototype.constructor = IntsetCmpExprContext;

YasParser.IntsetCmpExprContext = IntsetCmpExprContext;

IntsetCmpExprContext.prototype.intsetExpr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(IntsetExprContext);
    } else {
        return this.getTypedRuleContext(IntsetExprContext,i);
    }
};

IntsetCmpExprContext.prototype.EQ = function() {
    return this.getToken(YasParser.EQ, 0);
};

IntsetCmpExprContext.prototype.NEQ = function() {
    return this.getToken(YasParser.NEQ, 0);
};
IntsetCmpExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.enterIntsetCmpExpr(this);
	}
};

IntsetCmpExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.exitIntsetCmpExpr(this);
	}
};


function IntInExprContext(parser, ctx) {
	BoolExprContext.call(this, parser);
    BoolExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

IntInExprContext.prototype = Object.create(BoolExprContext.prototype);
IntInExprContext.prototype.constructor = IntInExprContext;

YasParser.IntInExprContext = IntInExprContext;

IntInExprContext.prototype.intExpr = function() {
    return this.getTypedRuleContext(IntExprContext,0);
};

IntInExprContext.prototype.IN = function() {
    return this.getToken(YasParser.IN, 0);
};

IntInExprContext.prototype.intsetExpr = function() {
    return this.getTypedRuleContext(IntsetExprContext,0);
};
IntInExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.enterIntInExpr(this);
	}
};

IntInExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.exitIntInExpr(this);
	}
};


function IntCmpExprContext(parser, ctx) {
	BoolExprContext.call(this, parser);
    BoolExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

IntCmpExprContext.prototype = Object.create(BoolExprContext.prototype);
IntCmpExprContext.prototype.constructor = IntCmpExprContext;

YasParser.IntCmpExprContext = IntCmpExprContext;

IntCmpExprContext.prototype.intExpr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(IntExprContext);
    } else {
        return this.getTypedRuleContext(IntExprContext,i);
    }
};

IntCmpExprContext.prototype.LT = function() {
    return this.getToken(YasParser.LT, 0);
};

IntCmpExprContext.prototype.LTE = function() {
    return this.getToken(YasParser.LTE, 0);
};

IntCmpExprContext.prototype.EQ = function() {
    return this.getToken(YasParser.EQ, 0);
};

IntCmpExprContext.prototype.NEQ = function() {
    return this.getToken(YasParser.NEQ, 0);
};

IntCmpExprContext.prototype.GTE = function() {
    return this.getToken(YasParser.GTE, 0);
};

IntCmpExprContext.prototype.GT = function() {
    return this.getToken(YasParser.GT, 0);
};
IntCmpExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.enterIntCmpExpr(this);
	}
};

IntCmpExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.exitIntCmpExpr(this);
	}
};


function NotExprContext(parser, ctx) {
	BoolExprContext.call(this, parser);
    BoolExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

NotExprContext.prototype = Object.create(BoolExprContext.prototype);
NotExprContext.prototype.constructor = NotExprContext;

YasParser.NotExprContext = NotExprContext;

NotExprContext.prototype.NOT = function() {
    return this.getToken(YasParser.NOT, 0);
};

NotExprContext.prototype.boolExpr = function() {
    return this.getTypedRuleContext(BoolExprContext,0);
};
NotExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.enterNotExpr(this);
	}
};

NotExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.exitNotExpr(this);
	}
};


function AllInExprContext(parser, ctx) {
	BoolExprContext.call(this, parser);
    BoolExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

AllInExprContext.prototype = Object.create(BoolExprContext.prototype);
AllInExprContext.prototype.constructor = AllInExprContext;

YasParser.AllInExprContext = AllInExprContext;

AllInExprContext.prototype.ALL = function() {
    return this.getToken(YasParser.ALL, 0);
};

AllInExprContext.prototype.intsetExpr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(IntsetExprContext);
    } else {
        return this.getTypedRuleContext(IntsetExprContext,i);
    }
};

AllInExprContext.prototype.IN = function() {
    return this.getToken(YasParser.IN, 0);
};
AllInExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.enterAllInExpr(this);
	}
};

AllInExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.exitAllInExpr(this);
	}
};


function AnyNotinExprContext(parser, ctx) {
	BoolExprContext.call(this, parser);
    BoolExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

AnyNotinExprContext.prototype = Object.create(BoolExprContext.prototype);
AnyNotinExprContext.prototype.constructor = AnyNotinExprContext;

YasParser.AnyNotinExprContext = AnyNotinExprContext;

AnyNotinExprContext.prototype.ANY = function() {
    return this.getToken(YasParser.ANY, 0);
};

AnyNotinExprContext.prototype.intsetExpr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(IntsetExprContext);
    } else {
        return this.getTypedRuleContext(IntsetExprContext,i);
    }
};

AnyNotinExprContext.prototype.NOT = function() {
    return this.getToken(YasParser.NOT, 0);
};

AnyNotinExprContext.prototype.IN = function() {
    return this.getToken(YasParser.IN, 0);
};
AnyNotinExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.enterAnyNotinExpr(this);
	}
};

AnyNotinExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.exitAnyNotinExpr(this);
	}
};


function AnyCmpExprContext(parser, ctx) {
	BoolExprContext.call(this, parser);
    BoolExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

AnyCmpExprContext.prototype = Object.create(BoolExprContext.prototype);
AnyCmpExprContext.prototype.constructor = AnyCmpExprContext;

YasParser.AnyCmpExprContext = AnyCmpExprContext;

AnyCmpExprContext.prototype.ANY = function() {
    return this.getToken(YasParser.ANY, 0);
};

AnyCmpExprContext.prototype.intsetExpr = function() {
    return this.getTypedRuleContext(IntsetExprContext,0);
};

AnyCmpExprContext.prototype.intExpr = function() {
    return this.getTypedRuleContext(IntExprContext,0);
};

AnyCmpExprContext.prototype.LT = function() {
    return this.getToken(YasParser.LT, 0);
};

AnyCmpExprContext.prototype.LTE = function() {
    return this.getToken(YasParser.LTE, 0);
};

AnyCmpExprContext.prototype.GT = function() {
    return this.getToken(YasParser.GT, 0);
};

AnyCmpExprContext.prototype.GTE = function() {
    return this.getToken(YasParser.GTE, 0);
};
AnyCmpExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.enterAnyCmpExpr(this);
	}
};

AnyCmpExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.exitAnyCmpExpr(this);
	}
};


function AndOrExprContext(parser, ctx) {
	BoolExprContext.call(this, parser);
    BoolExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

AndOrExprContext.prototype = Object.create(BoolExprContext.prototype);
AndOrExprContext.prototype.constructor = AndOrExprContext;

YasParser.AndOrExprContext = AndOrExprContext;

AndOrExprContext.prototype.boolExpr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(BoolExprContext);
    } else {
        return this.getTypedRuleContext(BoolExprContext,i);
    }
};

AndOrExprContext.prototype.AND = function() {
    return this.getToken(YasParser.AND, 0);
};

AndOrExprContext.prototype.OR = function() {
    return this.getToken(YasParser.OR, 0);
};
AndOrExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.enterAndOrExpr(this);
	}
};

AndOrExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.exitAndOrExpr(this);
	}
};


function BoolLiteralExprContext(parser, ctx) {
	BoolExprContext.call(this, parser);
    BoolExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

BoolLiteralExprContext.prototype = Object.create(BoolExprContext.prototype);
BoolLiteralExprContext.prototype.constructor = BoolLiteralExprContext;

YasParser.BoolLiteralExprContext = BoolLiteralExprContext;

BoolLiteralExprContext.prototype.boolLiteral = function() {
    return this.getTypedRuleContext(BoolLiteralContext,0);
};
BoolLiteralExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.enterBoolLiteralExpr(this);
	}
};

BoolLiteralExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.exitBoolLiteralExpr(this);
	}
};


function AllNotinExprContext(parser, ctx) {
	BoolExprContext.call(this, parser);
    BoolExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

AllNotinExprContext.prototype = Object.create(BoolExprContext.prototype);
AllNotinExprContext.prototype.constructor = AllNotinExprContext;

YasParser.AllNotinExprContext = AllNotinExprContext;

AllNotinExprContext.prototype.ALL = function() {
    return this.getToken(YasParser.ALL, 0);
};

AllNotinExprContext.prototype.intsetExpr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(IntsetExprContext);
    } else {
        return this.getTypedRuleContext(IntsetExprContext,i);
    }
};

AllNotinExprContext.prototype.NOT = function() {
    return this.getToken(YasParser.NOT, 0);
};

AllNotinExprContext.prototype.IN = function() {
    return this.getToken(YasParser.IN, 0);
};
AllNotinExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.enterAllNotinExpr(this);
	}
};

AllNotinExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof YasListener ) {
        listener.exitAllNotinExpr(this);
	}
};



YasParser.prototype.boolExpr = function(_p) {
	if(_p===undefined) {
	    _p = 0;
	}
    var _parentctx = this._ctx;
    var _parentState = this.state;
    var localctx = new BoolExprContext(this, this._ctx, _parentState);
    var _prevctx = localctx;
    var _startState = 20;
    this.enterRecursionRule(localctx, 20, YasParser.RULE_boolExpr, _p);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 149;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,7,this._ctx);
        switch(la_) {
        case 1:
            localctx = new BoolParenExprContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;

            this.state = 92;
            this.match(YasParser.T__0);
            this.state = 93;
            this.boolExpr(0);
            this.state = 94;
            this.match(YasParser.T__1);
            break;

        case 2:
            localctx = new IntCmpExprContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 96;
            this.intExpr();
            this.state = 97;
            _la = this._input.LA(1);
            if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << YasParser.LT) | (1 << YasParser.LTE) | (1 << YasParser.EQ) | (1 << YasParser.NEQ) | (1 << YasParser.GTE) | (1 << YasParser.GT))) !== 0))) {
            this._errHandler.recoverInline(this);
            }
            else {
            	this._errHandler.reportMatch(this);
                this.consume();
            }
            this.state = 98;
            this.intExpr();
            break;

        case 3:
            localctx = new IntNotinExprContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 100;
            this.intExpr();
            this.state = 101;
            this.match(YasParser.NOT);
            this.state = 102;
            this.match(YasParser.IN);
            this.state = 103;
            this.intsetExpr();
            break;

        case 4:
            localctx = new IntInExprContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 105;
            this.intExpr();
            this.state = 106;
            this.match(YasParser.IN);
            this.state = 107;
            this.intsetExpr();
            break;

        case 5:
            localctx = new IntsetCmpExprContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 109;
            this.intsetExpr();
            this.state = 110;
            _la = this._input.LA(1);
            if(!(_la===YasParser.EQ || _la===YasParser.NEQ)) {
            this._errHandler.recoverInline(this);
            }
            else {
            	this._errHandler.reportMatch(this);
                this.consume();
            }
            this.state = 111;
            this.intsetExpr();
            break;

        case 6:
            localctx = new AllCmpExprContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 113;
            this.match(YasParser.ALL);
            this.state = 114;
            this.intsetExpr();
            this.state = 115;
            _la = this._input.LA(1);
            if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << YasParser.LT) | (1 << YasParser.LTE) | (1 << YasParser.GTE) | (1 << YasParser.GT))) !== 0))) {
            this._errHandler.recoverInline(this);
            }
            else {
            	this._errHandler.reportMatch(this);
                this.consume();
            }
            this.state = 116;
            this.intExpr();
            break;

        case 7:
            localctx = new AnyCmpExprContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 118;
            this.match(YasParser.ANY);
            this.state = 119;
            this.intsetExpr();
            this.state = 120;
            _la = this._input.LA(1);
            if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << YasParser.LT) | (1 << YasParser.LTE) | (1 << YasParser.GTE) | (1 << YasParser.GT))) !== 0))) {
            this._errHandler.recoverInline(this);
            }
            else {
            	this._errHandler.reportMatch(this);
                this.consume();
            }
            this.state = 121;
            this.intExpr();
            break;

        case 8:
            localctx = new AllNotinExprContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 123;
            this.match(YasParser.ALL);
            this.state = 124;
            this.intsetExpr();
            this.state = 125;
            this.match(YasParser.NOT);
            this.state = 126;
            this.match(YasParser.IN);
            this.state = 127;
            this.intsetExpr();
            break;

        case 9:
            localctx = new AllInExprContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 129;
            this.match(YasParser.ALL);
            this.state = 130;
            this.intsetExpr();
            this.state = 131;
            this.match(YasParser.IN);
            this.state = 132;
            this.intsetExpr();
            break;

        case 10:
            localctx = new AnyNotinExprContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 134;
            this.match(YasParser.ANY);
            this.state = 135;
            this.intsetExpr();
            this.state = 136;
            this.match(YasParser.NOT);
            this.state = 137;
            this.match(YasParser.IN);
            this.state = 138;
            this.intsetExpr();
            break;

        case 11:
            localctx = new AnyInExprContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 140;
            this.match(YasParser.ANY);
            this.state = 141;
            this.intsetExpr();
            this.state = 142;
            this.match(YasParser.IN);
            this.state = 143;
            this.intsetExpr();
            break;

        case 12:
            localctx = new NotExprContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 145;
            this.match(YasParser.NOT);
            this.state = 146;
            this.boolExpr(4);
            break;

        case 13:
            localctx = new BoolVarExprContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 147;
            this.boolVar();
            break;

        case 14:
            localctx = new BoolLiteralExprContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 148;
            this.boolLiteral();
            break;

        }
        this._ctx.stop = this._input.LT(-1);
        this.state = 156;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,8,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                if(this._parseListeners!==null) {
                    this.triggerExitRuleEvent();
                }
                _prevctx = localctx;
                localctx = new AndOrExprContext(this, new BoolExprContext(this, _parentctx, _parentState));
                this.pushNewRecursionContext(localctx, _startState, YasParser.RULE_boolExpr);
                this.state = 151;
                if (!( this.precpred(this._ctx, 3))) {
                    throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 3)");
                }
                this.state = 152;
                _la = this._input.LA(1);
                if(!(_la===YasParser.AND || _la===YasParser.OR)) {
                this._errHandler.recoverInline(this);
                }
                else {
                	this._errHandler.reportMatch(this);
                    this.consume();
                }
                this.state = 153;
                this.boolExpr(4); 
            }
            this.state = 158;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,8,this._ctx);
        }

    } catch( error) {
        if(error instanceof antlr4.error.RecognitionException) {
	        localctx.exception = error;
	        this._errHandler.reportError(this, error);
	        this._errHandler.recover(this, error);
	    } else {
	    	throw error;
	    }
    } finally {
        this.unrollRecursionContexts(_parentctx)
    }
    return localctx;
};


YasParser.prototype.sempred = function(localctx, ruleIndex, predIndex) {
	switch(ruleIndex) {
	case 10:
			return this.boolExpr_sempred(localctx, predIndex);
    default:
        throw "No predicate with index:" + ruleIndex;
   }
};

YasParser.prototype.boolExpr_sempred = function(localctx, predIndex) {
	switch(predIndex) {
		case 0:
			return this.precpred(this._ctx, 3);
		default:
			throw "No predicate with index:" + predIndex;
	}
};


exports.YasParser = YasParser;
