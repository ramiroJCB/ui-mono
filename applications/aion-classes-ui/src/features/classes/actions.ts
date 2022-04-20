import axios, { AxiosError } from 'axios';
import moment from 'moment';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { ITrainingClass } from '@pec/aion-ui-core/interfaces/trainingClass';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { OdataParams } from '@pec/aion-ui-odata/types/odataParams';
import { ParsedUrlQuery } from 'querystring';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const { Equals, GreaterThanOrEqualTo, In } = OdataComparator;

export const top = 10;
const today = moment();

const fetchTrainingClassesRequest = () =>
  ({
    type: 'FETCH_TRAINING_CLASSES_REQUEST'
  } as const);

const fetchTrainingClassesSuccess = (payload: ITrainingClass[], totalCount: number) =>
  ({
    type: 'FETCH_TRAINING_CLASSES_SUCCESS',
    payload,
    totalCount
  } as const);

const fetchTrainingClassesFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_TRAINING_CLASSES_FAILURE',
    error
  } as const;
};

const shouldFetchTrainingClasses = (startDate?: string | string[]) =>
  startDate === undefined || today.isSameOrBefore(startDate.toString(), 'day');

const handleFetchRequests = (
  odataParams: OdataParams,
  languagesFilter?: string | string[],
  latitude?: number,
  longitude?: number,
  radius?: number
): ThunkAction<Promise<void>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      const params = { ...odataParams, languagesFilter, latitude, longitude, radius };

      const {
        data: { '@odata.count': totalCount, value }
      } = await axios.get<{ '@odata.count': number; value: ITrainingClass[] }>('/api/v3.00/classes', {
        params
      });

      dispatch(fetchTrainingClassesSuccess(value, totalCount));
      resolve();
    } catch (error) {
      reject(error);
    }
  });

const fetchTrainingClasses = ({
  page,
  sortOrder = 'asc',
  startDate = today.format('YYYY-MM-DD'),
  supportedLanguages: languagesFilter,
  programs,
  providers,
  city,
  state,
  distance
}: ParsedUrlQuery): ThunkAction<Promise<void>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchTrainingClassesRequest());

      const programIds = programs ? programs.toString().split(',') : undefined;
      const providerIds = providers ? providers.toString().split(',') : undefined;

      const odataParams = new QueryBuilder()
        .orderBy(`startDate ${sortOrder}`)
        .top(top)
        .skipByPage(page || '1', top)
        .filter(f =>
          f
            .filterBy('acceptsReservations', Equals, true)
            .filterBy('startDate', GreaterThanOrEqualTo, startDate)
            .filterBy('programId', In, programIds)
            .filterBy('trainingProviderId', In, providerIds)
        )
        .toQueryParam();

      if (city && state) {
        const geocoder = new window.google.maps.Geocoder();
        const { OK } = window.google.maps.GeocoderStatus;

        geocoder.geocode({ address: `${city}, ${state}` }, async (results, status) => {
          try {
            if (status === OK) {
              const {
                geometry: { location }
              } = results[0];

              const latitude = location.lat();
              const longitude = location.lng();
              const radius = distance && distance !== '>500' ? Number(distance.toString()) : undefined;

              await dispatch(handleFetchRequests(odataParams, languagesFilter, latitude, longitude, radius));
            } else {
              await dispatch(handleFetchRequests(odataParams, languagesFilter));
              dispatch(
                enqueueRequestErrorSnackbar(`Unable to locate ${city}, ${state}. Results are not filtered by distance.`)
              );
            }
            resolve();
          } catch (error) {
            dispatch(fetchTrainingClassesFailure(error));
            dispatch(enqueueRequestErrorSnackbar());
            reject(error);
          }
        });
      } else {
        await dispatch(handleFetchRequests(odataParams, languagesFilter));
        resolve();
      }
    } catch (error) {
      dispatch(fetchTrainingClassesFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export const fetchTrainingClassesIfNeeded = (
  search: ParsedUrlQuery
): ThunkAction<void, RootState, null, Actions> => dispatch => {
  const { startDate } = search;
  if (shouldFetchTrainingClasses(startDate)) {
    dispatch(fetchTrainingClasses(search));
  }
};

export type Actions =
  | ReturnType<typeof fetchTrainingClassesRequest>
  | ReturnType<typeof fetchTrainingClassesSuccess>
  | ReturnType<typeof fetchTrainingClassesFailure>;
