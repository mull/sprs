import React, { Component } from 'react';
import Input from './Input';
import Sheet from './Sheet';
import '../../sass/document.sass';

export default class Document extends Component {
  render() {
    return (
      <div className="document">
        <Input />
        <Sheet />
      </div>
    );
  }
}
