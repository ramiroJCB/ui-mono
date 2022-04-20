import axios, { AxiosError } from 'axios';
import { IOfficeLocation } from 'interfaces/officeLocation';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchOfficeLocationsRequest = () =>
  ({
    type: 'FETCH_OFFICE_LOCATIONS_REQUEST'
  } as const);

const fetchOfficeLocationsSuccess = (payload: IOfficeLocation[]) =>
  ({
    type: 'FETCH_OFFICE_LOCATIONS_SUCCESS',
    payload
  } as const);

const fetchOfficeLocationsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_OFFICE_LOCATIONS_FAILURE',
    error
  } as const;
};

export const fetchOfficeLocations = (
  organizationId: string
): ThunkAction<Promise<IOfficeLocation[]>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchOfficeLocationsRequest());

      const { Equals } = OdataComparator;
      const params = new QueryBuilder()
        .orderBy('type desc, name asc')
        .filter(f => f.filterBy('isDeleted', Equals, false))
        .toQueryParam();

      const {
        data: { value }
      } = await axios.get<{ value: IOfficeLocation[]; '@odata.count': number }>(
        `/api/v3.01/organizations(${organizationId})/officeLocations`,
        { params }
      );

      dispatch(fetchOfficeLocationsSuccess(value));
      resolve(value);
    } catch (error) {
      dispatch(fetchOfficeLocationsFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof fetchOfficeLocationsRequest>
  | ReturnType<typeof fetchOfficeLocationsSuccess>
  | ReturnType<typeof fetchOfficeLocationsFailure>;
