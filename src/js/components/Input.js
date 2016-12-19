import React, { Component, PropTypes } from 'react';
import { reaction } from 'mobx';
import { observer } from 'mobx-react';

@observer
export default class ColumnEditOverlay extends Component {
  static contextTypes = {
    store: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { store } = this.context;
    this.dispose = reaction(
      () => store.isEditing,
      bool => {
        if (bool) this.refs.input.focus();
        else this.refs.input.blur();
      },
      false
    );
  }

  componentWillUnmount() {
    this.dispose();
  }

  _preventPropagation = e => {
    e.stopPropagation();
  }

  _handleChange = e => {
    const { value } = e.target;
    const { store } = this.context;

    store.setEditValue(value);
  }

  _handleKeyDown = e => {
    const { store } = this.context;

    if (e.key === 'Enter') {
      store.finishEdit();
    } else if (e.key === 'Escape') {
      store.cancelEdit();
    }
  }

  _handleCancel = e => {
    const { store } = this.context;
    store.cancelEdit();
  }

  render() {
    const { store } = this.context;

    return (
      <div className='document__input'>
        <input
          ref="input"
          type="text"
          onChange={this._handleChange} 
          value={store.editValue} 
          onClick={this._preventPropagation}
          onKeyDown={this._handleKeyDown}
          onBlur={this._handleCancel}
        />
      </div>
    );
  }
}