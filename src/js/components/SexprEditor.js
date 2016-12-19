import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import Builder from '../Builder';

@observer
export default class SexprEditor extends Component {
  @observable builder = new Builder();


  _handleChange = e => {
    debugger;
    this.builder = Builder.receive(e.target.value);
  }

  render() {
    return (
      <input 
        type="text" 
        value={this.builder.toString()} 
        onKeyPress={this._handleChange}
      />
    );
  }
}
