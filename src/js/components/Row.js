import React, { Component } from 'react';

export default class Row  extends Component {
	shouldComponentUpdate() {
		return false;
	}

	render() {
		const { children } = this.props;

    return (
      <div className="row">
        {children}
      </div>
    );
	}
}