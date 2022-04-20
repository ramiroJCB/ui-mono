import axios, { AxiosError } from 'axios';
import { IProject } from 'interfaces/project';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchProjectsRequest = () =>
  ({
    type: 'FETCH_PROJECTS_REQUEST'
  } as const);

const fetchProjectsSuccess = (payload: IProject[]) =>
  ({
    type: 'FETCH_PROJECTS_SUCCESS',
    payload
  } as const);

const fetchProjectsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_PROJECTS_FAILURE',
    error
  } as const;
};

export const fetchProjects = (
  organizationId: string
): ThunkAction<Promise<IProject[]>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchProjectsRequest());

      const { Equals } = OdataComparator;
      const params = new QueryBuilder()
        .orderBy('endDateUtc desc')
        .filter(f => f.filterBy('isDeleted', Equals, false))
        .toQueryParam();

      const {
        data: { value }
      } = await axios.get<{ value: IProject[]; '@odata.count': number }>(
        `/api/v3.01/organizations(${organizationId})/projects`,
        { params }
      );

      dispatch(fetchProjectsSuccess(value));
      resolve(value);
    } catch (error) {
      dispatch(fetchProjectsFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof fetchProjectsRequest>
  | ReturnType<typeof fetchProjectsSuccess>
  | ReturnType<typeof fetchProjectsFailure>;
