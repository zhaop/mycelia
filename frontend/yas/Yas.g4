/*

Example expressions:

135 in ports
any [3, 4] in [2k, 2,]
any ports in [20, 21, 23]
any ports < 1024
all ports < 1024
min ports > 1024
true
sum bytes > 100M or min bytes > 10M
sum bytes > 1k and sum bytes < 10k
udp and sum bytes = 1 + 2 + 3
sum(bytes) = sum[1, 2, 3]

any ips in 10.252.0.0/16 + 10.251.0.0/16
all ips in 10.252.0.0/16

any [2,2..10] in ports


Boolean fun:

not any x in y == all x not in y
not all x in y == any x not in y

any [1, 2] in [2, 3]  // true
any [1, 2] in [3, 4]  // false
all [1, 2] not in [2, 3]  // false
all [1, 2] not in [3, 4]  // true

any [1, 2] not in [2, 3]  // true
any [1, 2] not in [1, 2, 3] // false
all [1, 2] in [1, 2, 3] // true
all [1, 2] in [2, 3]  // false


Variables:
  Bool:
    tcp
    udp
  Ints:
    duration
  Int sets:
    ports
    // bytes
    // packets
  IP sets:
    // ips

*/

grammar Yas;
// Yet another syntax?

expr : boolExpr ;

doc : expr (NEWLINE expr)* NEWLINE?;

intLiteral : NUMBER METRIC_PREFIX? ;

intVar : DURATION ;

intExpr  : '(' intExpr ')'            #intParenExpr
          // | intExpr ('*'|'/') intExpr #intMuldivExpr
          // | intExpr ('+'|'-') intExpr #intAddsubExpr
          | (MAX|MIN|SUM) intsetExpr  #intFunExpr
          | intVar                    #intVarExpr
          | intLiteral                #intLiteralExpr
          ;

intsetLiteral : '[' intExpr (',' intExpr)* ','? ']' ;

intsetVar : (BYTES|PACKETS|PORTS) ;

intsetExpr  : '(' intsetExpr ')'                #intsetParenExpr
              | intsetLiteral '-' intsetLiteral #intsetDiffExpr
              | intsetLiteral '&' intsetLiteral #intsetInterExpr
              | intsetLiteral '|' intsetLiteral #intsetUnionExpr
              | intsetVar                       #intsetVarExpr
              | intsetLiteral                   #intsetLiteralExpr
              ;

boolLiteral : (TRUE|FALSE) ;

boolVar : (TCP|UDP) ;

boolExpr : '(' boolExpr ')'                         #boolParenExpr
          | intExpr (LT|LTE|EQ|NEQ|GTE|GT) intExpr  #intCmpExpr
          | intExpr NOT IN intsetExpr               #intNotinExpr
          | intExpr IN intsetExpr                   #intInExpr
          | intsetExpr (EQ|NEQ) intsetExpr          #intsetCmpExpr
          | ALL intsetExpr (LT|LTE|GT|GTE) intExpr  #allCmpExpr
          | ANY intsetExpr (LT|LTE|GT|GTE) intExpr  #anyCmpExpr
          | ALL intsetExpr NOT IN intsetExpr        #allNotinExpr
          | ALL intsetExpr IN intsetExpr            #allInExpr
          | ANY intsetExpr NOT IN intsetExpr        #anyNotinExpr
          | ANY intsetExpr IN intsetExpr            #anyInExpr
          | NOT boolExpr                            #notExpr
          | boolExpr (AND|OR) boolExpr              #andOrExpr
          | boolVar                                 #boolVarExpr
          | boolLiteral                             #boolLiteralExpr
          ;

fragment LOWER : [a-z] ;
fragment UPPER : [A-Z] ;
fragment DIGIT : [0-9] ;

METRIC_PREFIX : ('k' | 'M' | 'G' | 'T' | 'P' | 'E' | 'Z' | 'Y') ;

ANY : 'any' ;
ALL : 'all' ;
AND : 'and' ;
IN : 'in' ;
NOT : 'not' ;
MAX : 'max' ;
MIN : 'min' ;
SUM : 'sum' ;
OR : 'or' ;
LT : '<' ;
LTE : '<=' ;
EQ : '=' ;
NEQ: '!=' ;
GTE : '>=' ;
GT : '>' ;

TRUE : 'true' ;
FALSE : 'false' ;

BYTES : 'bytes' ;
DURATION : 'duration' ;
PACKETS : 'packets' ;
PORTS : 'ports' ;
TCP : 'tcp' ;
UDP : 'udp' ;

NUMBER : DIGIT+ ;

WORD : (LOWER | UPPER)+ ;

WHITESPACE : (' ' | '\t')+ -> skip;
NEWLINE : ('\r' | '\n')+;

LEFTOVER : . ;
