import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from 'app/App';
import '@pec/aion-ui-core/index.css';
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import '@pec/aion-ui-i18next';

ReactDOM.render(<App />, document.getElementById('root'));
