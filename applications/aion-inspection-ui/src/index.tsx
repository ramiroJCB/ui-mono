import '@pec/aion-ui-core/index.css';
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import 'react-virtualized/styles.css';
import React from 'react';
import { render } from 'react-dom';
import '@pec/aion-ui-i18next';
import { App } from 'app/App';

render(<App />, document.getElementById('root'));
