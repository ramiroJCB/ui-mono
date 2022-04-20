import { AxiosError } from 'axios';
import { ISiteLocation } from 'interfaces/site';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchCurrentLocationRequest = () =>
  ({
    type: 'FETCH_CURRENT_LOCATION_REQUEST'
  } as const);

const fetchCurrentLocationDone = () =>
  ({
    type: 'FETCH_CURRENT_LOCATION_DONE'
  } as const);

const fetchSiteLocationRequest = () =>
  ({
    type: 'FETCH_SITE_LOCATION_REQUEST'
  } as const);

const fetchSiteLocationSuccess = (payload: ISiteLocation) =>
  ({
    type: 'FETCH_SITE_LOCATION_SUCCESS',
    payload
  } as const);

const fetchSiteLocationFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_SITE_LOCATION_FAILURE',
    error
  } as const;
};

export const resetSiteLocation = () =>
  ({
    type: 'RESET_SITE_LOCATION'
  } as const);

export const fetchSiteLocation = (
  geocoder: google.maps.Geocoder,
  address: string
): ThunkAction<Promise<ISiteLocation>, RootState, null, Actions> => dispatch => {
  return new Promise<ISiteLocation>(async (resolve, reject) => {
    try {
      dispatch(fetchSiteLocationRequest());

      const { OK, ZERO_RESULTS } = window.google.maps.GeocoderStatus;

      geocoder.geocode({ address }, (results, status) => {
        if (status === OK) {
          const {
            geometry: { location },
            formatted_address
          } = results[0];
          const payload = {
            latitude: location.lat(),
            longitude: location.lng(),
            formattedAddress: formatted_address
          };
          dispatch(fetchSiteLocationSuccess(payload));
          resolve(payload);
        } else if (status === ZERO_RESULTS) {
          const [latitude, longitude] = address.split(',').map(parseFloat);
          const payload = {
            latitude,
            longitude,
            formattedAddress: null
          };
          dispatch(fetchSiteLocationSuccess(payload));
          resolve(payload);
        } else {
          throw new Error(status.toString());
        }
      });
    } catch (error) {
      dispatch(fetchSiteLocationFailure(error));
      reject(error);
    }
  });
};

export const fetchCurrentLocation = (
  geocoder: google.maps.Geocoder,
  errorCallback: () => void
): ThunkAction<void, RootState, null, Actions> => dispatch => {
  dispatch(fetchCurrentLocationRequest());
  navigator.geolocation.getCurrentPosition(
    ({ coords: { latitude, longitude } }) => {
      dispatch(fetchCurrentLocationDone());
      dispatch(fetchSiteLocation(geocoder, `${latitude},${longitude}`));
    },
    () => {
      dispatch(fetchCurrentLocationDone());
      errorCallback();
    }
  );
};

export type Actions =
  | ReturnType<typeof fetchCurrentLocationRequest>
  | ReturnType<typeof fetchCurrentLocationDone>
  | ReturnType<typeof fetchSiteLocationRequest>
  | ReturnType<typeof fetchSiteLocationSuccess>
  | ReturnType<typeof fetchSiteLocationFailure>
  | ReturnType<typeof resetSiteLocation>;
