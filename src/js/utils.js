export function isNumeric(string) {
  return /^-?\d+$/.test(string) ||
         /^-?\d+\.?\d*$/.test(string);
}

export function isInt(string) {
  return /^-?\d+$/.test(string);
}

export function isWhiteSpace(char) {
  return /\s/.test(char);
}


// matches $A1, $AA22 etc
export function isReference(str) {
  return /^\$[A-Z]+\d+$/.test(str);
}

export function isReferenceRange(str) {
  return /^\$[A-Z]+\d+:\$[A-Z]+\d+$/.test(str);
}

export function isStrExpr(val) {
  return val[0] === '(' && val[val.length -1 ] === ')';
}