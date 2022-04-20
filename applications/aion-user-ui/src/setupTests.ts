import * as mocks from '@pec/aion-ui-core/mocks';

const { StorageMock, XHRMock, createMatchMedia } = mocks;

window.localStorage = new StorageMock();
window.sessionStorage = new StorageMock();
window.XMLHttpRequest = jest.fn().mockImplementation(XHRMock) as any;
window.matchMedia = createMatchMedia(window.innerWidth);
global.console.error = jest.fn();
global.console.warn = jest.fn();

process.on('unhandledRejection', err => {
  fail(err);
});
