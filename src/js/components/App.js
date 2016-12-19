// @flow
import React, { Component, PropTypes } from 'react';
import { useStrict } from 'mobx';
import DevTools from 'mobx-react-devtools';
import Document from './Document';
import Store from '../Store';
import { 
  MOVEMENT_DIRECTIONS
} from '../constants';

// $FlowFixMe
import '../../sass/app.sass';

useStrict(true);

const store : Store = new Store();

/*const ops = [
  () => store.init(600, 400),

  () => store.set(0, 'hej'),
  () => store.set(3, 'hoj'),
  () => store.set(6, 'moj'),
  () => store.set(1, '(join ", " $A1:$A3)'),

  () => store.init(800, 400),
  () => store.init(600, 400),
  () => store.init(400, 400),
  () => store.init(600, 400),
]

function delayCalls(array, interval) {
  function process() {
    var fn = array.shift();
    fn();

    if (array.length > 0)
      setTimeout(process, interval);
  }

  process();
};

delayCalls(ops, 250);*/


store.init(600, 400);
store.set(0, '1');
store.set(3, '2');
store.set(6, '3');
store.set(1, '(sum $A1:$A3)');

export default class App extends Component {
  static childContextTypes = {
    store: PropTypes.object,
  };

  getChildContext() {
    return { store };
  }

  componentDidMount() {
    window.addEventListener('keydown', this._handleKeyPress, true);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this._handleKeyPress, true); 
  }

  _handleKeyPress = (e : KeyboardEvent) => {
    if (store.isEditing) return;
    console.log(e);
    
    switch (e.key) {
      case "ArrowUp":
      
        store.move(MOVEMENT_DIRECTIONS.TO_HELL);
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <div className="App">
        <Document />
        <DevTools />
      </div>
    );
  }
}


