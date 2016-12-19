const { describe, it } = global;

import {
  SExprParser,
  SExpr,
  ValueInt,
  ValueFloat,
  ValueString,
  Reference,
  ReferenceRange
} from './Parser';

describe("SExprParser", () => {
  it("handles a simple (+ 1 1)", () => {
    const expr = SExprParser.parse("(+ 1 1)");
    expect(expr).toBeInstanceOf(SExpr);
    expect(expr.fn.toString()).toBe('+');
  });

  it("handles simple nested sexpr", () => {
    const expr = SExprParser.parse("(+ 1 (+ 1 1))");
    expect(expr).toBeInstanceOf(SExpr);
    expect(expr.data[1]).toBeInstanceOf(SExpr);
  });

  it("handles nested expressions purrfectly", () => {
    const expr = SExprParser.parse("(+ 1 2 (* 1.0 2.413))");
    expect(expr).toBeInstanceOf(SExpr);
    expect(expr.fn.toString()).toBe('+');
    expr.data.slice(0, 2).forEach(t => expect(t).toBeInstanceOf(ValueInt));

    const inner = expr.data[2];
    expect(inner).toBeInstanceOf(SExpr);
    expect(inner.fn.toString()).toBe('*');
    inner.data.forEach(t => expect(t).toBeInstanceOf(ValueFloat));
  });

  it("recognizes references", () => {
    const expr = SExprParser.parse("(+ $A1 $B2)");
    expect(expr).toBeInstanceOf(SExpr);
    expect(expr.fn.toString()).toBe('+');
    expr.data.forEach(t => expect(t).toBeInstanceOf(Reference));
  });

  it("recognizes ranges", () => {
    const expr = SExprParser.parse("(+ 2 $A1:$A5)");
    expect(expr).toBeInstanceOf(SExpr);
    expect(expr.data[1]).toBeInstanceOf(ReferenceRange);
  });

  it.only("recognizes string literals", () => {
    const expr = SExprParser.parse('(join "," 1 2 3 4)');

    expect(expr.data[0]).toBeInstanceOf(ValueString);
  });
});


