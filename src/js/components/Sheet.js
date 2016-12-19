// @flow
import React, { Component } from 'react';
import Row from './Row';
import Column from './Column';
import { DIMENSIONS } from '../constants';
// $FlowFixMe
import '../../sass/sheet.sass';


const EMPTY_ARR = Array(DIMENSIONS).fill(null);

function indexToLetter(i) {
  return String.fromCharCode(i + 65);
}

class Sheet extends Component {
	shouldComponentUpdate() {
		return false;
	}

	render() {
		const rows = EMPTY_ARR
			.map((n, row) => {
        const columns = EMPTY_ARR
          .fill(null)
          .map((b, column) => {
            const index = row * DIMENSIONS + column;

            return <Column index={index} key={`row-${row}-col-${column}`} />;
          });

				return (
					<Row index={row} key={`row-${row}`} children={columns} />
        );
			});

    return (
      <div className="sheet document__sheet">
        <div className="sheet__row-labels">
          {EMPTY_ARR.map((_, i) => (
            <div 
              className="sheet__row-labels__row" 
              key={`sheet-row-label-${i}`}
              children={i+1}
              style={{height: `calc(100% / ${DIMENSIONS})`}}
            />
          ))}
        </div>
        <div className="sheet__col-labels">
          {EMPTY_ARR.map((_, i) => (
            <div 
              className="sheet__col-labels__col" 
              key={`sheet-col-label-${i}`}
              children={indexToLetter(i)}
              style={{width: `calc(100% / ${DIMENSIONS})`}}
            />
          ))}
        </div>
        <div className="sheet__rows" children={rows} />
      </div>
    );
	}	
}

export default Sheet;