// @flow
import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import cx from 'classnames';
import type { T_STORE } from '../Store';


type Props = {
  index : number
};

type Context = {
  store : T_STORE
};

@observer
export default class Column extends Component {
  props: Props;
  context: Context;

  static contextTypes = {
    store: PropTypes.object.isRequired,
  };

  _handleEdit = () => {
    const { store } = this.context;
    const { index } = this.props;

    store.startEdit(index);
  }
  
  render() {
    const { index } = this.props;
    const { store  } = this.context;
    const node = store.getNode(index);
    const value = store.getComputed(index)
    const className = cx('col', {
      'col--focused': node.isFocused
    });
    const style = {
      width: `${store.columnWidth}px`,
      height: `${store.columnHeight}px`
    };

    return (
      <div className={className} onClick={this._handleEdit} style={style}>
        <span className="col__value" children={value.toString()} />
      </div>
    );
  }
}
