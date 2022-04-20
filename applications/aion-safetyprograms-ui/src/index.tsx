import '@pec/aion-ui-core/index.css';
import 'react-image-crop/dist/ReactCrop.css';
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import 'react-virtualized/styles.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { pdfjs } from 'react-pdf';
import '@pec/aion-ui-i18next';
import { App } from './App';

pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.2.1.266.min.js`;
ReactDOM.render(<App />, document.getElementById('root'));
