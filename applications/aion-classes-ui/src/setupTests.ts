import Adapter from 'enzyme-adapter-react-16';
import { configure } from 'enzyme';
import { StorageMock } from '@pec/aion-ui-core/mocks';

configure({ adapter: new Adapter() });

window.localStorage = new StorageMock();
window.sessionStorage = new StorageMock();
window.URL.createObjectURL = jest.fn();
global.console.error = jest.fn();
global.console.warn = jest.fn();

process.on('unhandledRejection', err => {
  fail(err);
});
