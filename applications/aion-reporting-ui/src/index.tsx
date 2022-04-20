import './index.css';
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import '@pec/aion-ui-i18next';
import App from 'App';

ReactDOM.render(<App />, document.getElementById('root'));
