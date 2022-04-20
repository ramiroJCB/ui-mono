import '@pec/aion-ui-core/index.css';
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import 'draft-js/dist/Draft.css';
import 'react-image-gallery/styles/css/image-gallery.css';
import './styles/image-gallery.css';
import 'react-virtualized/styles.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import '@pec/aion-ui-i18next';
import { App } from 'App';

ReactDOM.render(<App />, document.getElementById('root'));
