import Adapter from 'enzyme-adapter-react-16';
import { configure } from 'enzyme';
import { createMatchMedia, StorageMock } from '@pec/aion-ui-core/mocks';

configure({ adapter: new Adapter() });

window.localStorage = new StorageMock();
window.sessionStorage = new StorageMock();
window.URL.createObjectURL = jest.fn();
global.console.error = jest.fn();
global.console.warn = jest.fn();

process.on('unhandledRejection', err => {
  fail(err);
});

const google: any = {
  maps: {
    Geocoder: class {
      geocode(
        _request: google.maps.GeocoderRequest,
        callback: (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => void
      ) {
        return callback(
          [{ geometry: { location: { lat: () => 123, lng: () => 456 } } }] as any,
          'OK' as google.maps.GeocoderStatus.OK
        );
      }
    },
    GeocoderStatus: {
      ERROR: 'ERROR',
      INVALID_REQUEST: 'INVALID_REQUEST',
      OK: 'OK',
      OVER_QUERY_LIMIT: 'OVER_QUERY_LIMIT',
      REQUEST_DENIED: 'REQUEST_DENIED',
      UNKNOWN_ERROR: 'UNKNOWN_ERROR',
      ZERO_RESULTS: 'ZERO_RESULTS'
    }
  }
};

window.google = google;
window.matchMedia = createMatchMedia(window.innerWidth);
