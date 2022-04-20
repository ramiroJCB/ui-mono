import * as mocks from '@pec/aion-ui-core/mocks';
import Adapter from 'enzyme-adapter-react-16';
import { configure } from 'enzyme';

const { StorageMock, XHRMock, createMatchMedia } = mocks;

configure({ adapter: new Adapter() });

window.localStorage = new StorageMock();
window.sessionStorage = new StorageMock();
window.XMLHttpRequest = jest.fn().mockImplementation(XHRMock) as any;
window.matchMedia = createMatchMedia(window.innerWidth);

process.on('unhandledRejection', err => {
  fail(err);
});
