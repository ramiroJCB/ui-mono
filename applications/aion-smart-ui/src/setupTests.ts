import * as mocks from '@pec/aion-ui-core/mocks';
import Adapter from 'enzyme-adapter-react-16';
import { configure } from 'enzyme';

const { StorageMock, XHRMock, createMatchMedia } = mocks;

configure({ adapter: new Adapter() });

declare global {
  interface Window {
    google: any;
  }
}

window.google = {
  maps: {
    GeocoderStatus: {}
  }
};
window.localStorage = new StorageMock();
window.sessionStorage = new StorageMock();
window.XMLHttpRequest = jest.fn().mockImplementation(XHRMock) as any;
window.matchMedia = createMatchMedia(window.innerWidth);
global.console.error = jest.fn();
global.console.warn = jest.fn();

process.on('unhandledRejection', err => {
  fail(err);
});
