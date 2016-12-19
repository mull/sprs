// @flow
import { observable, computed, action, transaction } from 'mobx';
import { 
  DIMENSIONS,
} from './constants';
import type {
  T_MOVEMENT_DIRECTIONS
} from './constants';
import { 
  parseInput,
  ValueNothing,
  SExpr,
  Reference,
  ReferenceRange,
} from './Parser';
import type {
  T_DATA,
  T_SEXPR,
} from './Parser';

class InvalidExpr {
  toString() {
    return '!!!!';
  }

}

class EvaluatedValue {
  value : any = null;

  constructor(val) {
    this.value = val;
  }

  toString() {
    return this.value.toString();
  }
}

function sum(values) {
  return values.reduce((s, v) => {
    if (Array.isArray(v))
      return s + sum(v);
    else 
      return s + v;
  }, 0);
}

const OPERATORS = {
  "+":    sum,
  'sum':  sum,
  "*":    values => values.reduce((sum, i) => sum * i),
  "join": values => {
    if (values[1] && Array.isArray(values[1])) {
      return values[1].join(values[0]);
    } else {
      return values.join(' ');
    }
  },
}

function splitReference(str) : Array<string> {
  const matches = str.match(/\$([A-Z]+)(\d+)/) || [];

  return matches.slice(1).reverse();
}
function referenceToIndex(str) {
  const [row, columnParts] = splitReference(str);
  const finalRow = Number.parseInt(row, 10) - 1;
  const column = columnParts
    .split('')
    .map(p => p.charCodeAt(0) - 65)
    .reduce((sum, i) => sum + i, 0);
    
  return (finalRow * DIMENSIONS) + column;
}


// assumes range is $A1:$A5 not $A1:$C1, column shouldn't change
function expandRange(range) {
  const [start, end] = range.toString().split(':');
  const [startRow, startColumn] = splitReference(start);
  const [endRow] = splitReference(end);
  const result = [];

  for (let i = Number.parseInt(startRow, 10); i <= Number.parseInt(endRow, 10); i++) {
    result.push(`$${startColumn}${i}`);
  }

  return result;
}

function evaluateRange(range : ReferenceRange, getValue) {
  const allReferences = expandRange(range);

  return allReferences.map(ref => 
    getValue( referenceToIndex(ref) )
  );
}

function evaluate(sexpr : T_SEXPR, getValue) : EvaluatedValue | InvalidExpr {
  const fn : Function = OPERATORS[sexpr.fn.toString()];

  if (!fn) {
    return new InvalidExpr();
  }

  const values = sexpr.data.map(v => {
    if (v instanceof SExpr) 
      return evaluate(v, getValue);
    
    if (v instanceof Reference)
      return getValue( referenceToIndex(v.toString()) ).value;
    
    if (v instanceof ReferenceRange) {
      return evaluateRange(v, getValue).map(ev => ev.value);
    }
    
    return v.value;
  }, []);

  return new EvaluatedValue(fn(values));
}


type T_NODE_VALUE = T_DATA | ValueNothing;
class Node {
  @observable value : T_NODE_VALUE;
  @observable isFocused = false;

  constructor(value : T_NODE_VALUE) {
    this.set(value);
  }

  @action set(value : T_NODE_VALUE) {
    this.value = value;
  }
}

function initialArray(N : number) : Array<Node> {
  const size = N * N;
  const result = Array(size);
  for (let i = 0; i < size; i++) {
    result[i] = new Node(new ValueNothing());
  }
  return result;
}

export default class Store {
  @observable nodes : Array<Node> = initialArray(DIMENSIONS);
  @observable editIndex = -1;
  @observable editValue = '';
  @observable documentSettings = {
    width: 0,
    height: 0,
  };

  @action init(windowWidth: number, windowHeight: number) {
    this.documentSettings.width = windowWidth;
    this.documentSettings.height = windowHeight;
  }

  @computed get columnWidth() : number {
    return Math.floor(this.documentSettings.width / DIMENSIONS);
  }

  @computed get columnHeight() : number {
    return Math.floor(this.documentSettings.height / DIMENSIONS)
  }

  @computed get isEditing() : bool {
    return this.editIndex !== -1;
  }

  getNode(index: number) {
    return this.nodes[index];
  }

  getComputed = (index: number) => {
    return computed(() => {
      const node = this.getNode(index);
      const { value } = node;

      if (value instanceof SExpr) {
        return evaluate(value, this.getComputed);
      } else {
        return value;
      }
    }).get();
  }

  @action set(index: number, value: string) {
    this.nodes[index].set(parseInput(value));
  }

  @action startEdit(index: number) : void {
    this.editIndex = index;
    this.editValue = this.nodes[index].value.toString();
  }

  @action setEditValue(str: string) : void {
    this.editValue = str;
  }

  @action finishEdit() : void {
    transaction(() => {
      this.nodes[this.editIndex].set(parseInput(this.editValue));
    });
  }

  @action cancelEdit(index : number) : void {
    this.editIndex = -1;
    this.editValue = '';
  }

  @action move(direction : T_MOVEMENT_DIRECTIONS) : void {
    console.log(direction + 1); 
  }
}

export type T_STORE = Store;