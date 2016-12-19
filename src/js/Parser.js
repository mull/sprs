// @flow
import { 
  isWhiteSpace, 
  isNumeric,
  isInt,
  isReference,
  isReferenceRange,
  isStrExpr,
} from './utils';

const STATES = {
  TOKEN_START: Symbol('STATE_START'),
  READ_QUOTED_STRING: Symbol('READ_QUOTED_STRING'),
  READ_STRING_OR_NUMBER: Symbol('READ_STRING_OR_NUMBER'),
}

const TOKENS = {
  TOKEN_LBR:    'TOKEN_LBR',
  TOKEN_RBR:    'TOKEN_RBR',
  TOKEN_VALUE:  'TOKEN_VALUE',
};
type T_TOKENS = $Keys<typeof TOKENS>;
class Token {
  type : string;
  val : ?Value;

  constructor(type : T_TOKENS, val : ?Value) {
    this.type = type;
    this.val = val;
  }
}



export class Value {
  isNothing       = false;

  // primitives
  isNumber        = false;
  isInt           = false;
  isFloat         = false;
  isString        = false;
  isStringLiteral = false;

  // these are never found outside of an sexpr
  isOperand       = false;
  isReference     = false;
  isRange         = false;
  isExpression    = false;

  value           = '';

  constructor(val : string | number) {
    this.value = val;
  }

  toString() {
    return this.value.toString();
  }
}

export class ValueNothing {
  isNothing = true;

  toString() {
    return '';
  }
}

export class ValueOperand extends Value {
  isOperand = true;
}

export class ValueNumber extends Value {
  isNumber = true;
}

export class ValueInt extends ValueNumber {
  isInt = true;
}

export class ValueFloat extends ValueNumber {
  isFloat = true;
}

export class ValueString extends Value {
  isStringLiteral = true;

  toString() {
    return `"${this.value.toString()}"`;
  }
}

export class Reference extends Value {
  isReference = true;
}

export class ReferenceRange extends Value {
  isRange = true;
}

export class SExpr {
  isExpression = true;
  fn : ValueOperand;
  data : Array<T_DATA> = [];

  constructor(parts : Array<T_DATA>) {
    const [fn : ValueOperand, ...data] = parts;

    if (fn instanceof ValueOperand) {
      this.fn = fn;
    } else {
      throw new Error("First arg of an S-Expression must be a function");
    }
    this.data = data;
  }


  toString() {
    const parts = [this.fn.toString()].concat(this.data);

    return `(${parts.join(' ')})`;
  }

}
export type T_SEXPR = SExpr;
export type T_DATA = Value | SExpr;

function numericValue(word : string) {
  return isInt(word) ? 
    new ValueInt(Number.parseInt(word, 10)) : 
    new ValueFloat(Number.parseFloat(word));
}

function tokenToValueType(word) {
  if (isReferenceRange(word)) {
    return new ReferenceRange(word);
  } else if (isReference(word)) {
    return new Reference(word);
  } else if (isNumeric(word)) {
    return numericValue(word);
  } else {
    return new ValueOperand(word);
  }
}



export class SExprParser {
  static parse(str) {
    let state = STATES.TOKEN_START;
    let tokens : Array<Token> = [];
    let word = "";

    for (let i = 0; i < str.length; i++) {
      const char = str[i];

      if (state === STATES.TOKEN_START) {
        if (char === '(') {
          tokens.push(new Token(TOKENS.TOKEN_LBR));
        } else if (char === ')') {
          tokens.push(new Token(TOKENS.TOKEN_RBR));
        } else if (isWhiteSpace(char)) {
          // do nothing, just consume the whitespace
        } else if (char === '"') {
          state = STATES.READ_QUOTED_STRING;
          word = '';
        } else {
          state = STATES.READ_STRING_OR_NUMBER;
          word = char;
        }
      } else if (state === STATES.READ_QUOTED_STRING) {
        if (char === '"') {
          tokens.push(new Token(TOKENS.TOKEN_VALUE, new ValueString(word)));
          state = STATES.TOKEN_START;
        } else {
          word += char;
        }
      } else if (state === STATES.READ_STRING_OR_NUMBER) {
        if (isWhiteSpace(char)) {
          tokens.push(new Token(TOKENS.TOKEN_VALUE, tokenToValueType(word)));
          state = STATES.TOKEN_START;
        } else if (char === ')') {
          tokens.push(new Token(TOKENS.TOKEN_VALUE, tokenToValueType(word)));
          tokens.push(new Token(TOKENS.TOKEN_RBR));
          state = STATES.TOKEN_START;
        } else {
          word += char;
        }
      }
    }

    return tokens.length > 0 ?
      this.tokens_to_sexpr(tokens) :
      null;
  }

   

  static tokens_to_sexpr(tokens : Array<Token>) : SExpr {
    function convert(tokens : Array<Token>, idx : number = 0) : [SExpr, number] {
      const result : Array<T_DATA> = [];

      while (idx < tokens.length - 1) {
        const token = tokens[idx];
        
        if (token.type === TOKENS.TOKEN_RBR) {
          return [new SExpr(result), idx];
        } else if (token.type === TOKENS.TOKEN_LBR) {
          // new sexpr starting
          const [sexpr, newidx] = convert(tokens, idx + 1);
          result.push(sexpr);
          idx += newidx;
        } else {
          // operand
          idx += 1;
          if (token.val) result.push(token.val)
        }
      }

      return [new SExpr(result), idx];
    }

    return convert(tokens, 1)[0];
  }
}


export function parseInput(str : string) : T_DATA | ValueNothing {
  if (isStrExpr(str)) {
    return SExprParser.parse(str) || new ValueNothing();
  } else if (isNumeric(str)) {
    return numericValue(str);
  } else {
    return new ValueString(str);
  }
}