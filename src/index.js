import React from 'react';
import ReactDOM from 'react-dom';
import App from './js/components/App';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);


if (module.hot) {
  module.hot.accept('./js/components/App', () => {
    const NextApp = require('./js/components/App').default;
    ReactDOM.render(
      <NextApp />,
      document.getElementById('root')
    );
  });
}