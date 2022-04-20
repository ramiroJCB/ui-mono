import axios, { AxiosError } from 'axios';
import { ITrainingRequirement } from '@pec/aion-ui-core/interfaces/trainingRequirement';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchInitialTrainingsRequest = () =>
  ({
    type: 'FETCH_INITIAL_TRAININGS_REQUEST'
  } as const);

const fetchTrainingsRequest = () =>
  ({
    type: 'FETCH_TRAININGS_REQUEST'
  } as const);

const fetchTrainingsSuccess = (payload: ITrainingRequirement[], totalCount: number) =>
  ({
    type: 'FETCH_TRAININGS_SUCCESS',
    payload,
    totalCount
  } as const);

const fetchTrainingsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_TRAININGS_FAILURE',
    error
  } as const;
};

export const fetchTrainings = (
  organizationId: string,
  top: number = 0,
  skip: number = 0,
  name?: string | string[],
  trainingIds?: string
): ThunkAction<Promise<ITrainingRequirement[]>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch((top === 0 ? fetchInitialTrainingsRequest : fetchTrainingsRequest)());

      const { Contains, Equals } = OdataComparator;
      const params = new QueryBuilder()
        .top(top)
        .skip(skip)
        .filter(({ filterBy }) => {
          const filter = filterBy('name', Contains, name)
            .filterBy('isDeleted', Equals, false)
            .filterBy('organizationId', Equals, organizationId)
            .or(({ filterBy }) =>
              filterBy('name', Contains, name)
                .filterBy('isDeleted', Equals, false)
                .filterBy('organizationId', Equals, null)
            );

          if (trainingIds && !Array.isArray(trainingIds)) {
            filter.and(f => {
              trainingIds.split(',').map(id => f.or(e => e.filterBy('id', Equals, id)));
              return f;
            });
          }

          return filter;
        })
        .orderBy('name')
        .toQueryParam();

      const response = await axios.get<{ value: ITrainingRequirement[]; '@odata.count': number }>(
        '/api/trainingCompliance/v3.01/trainingRequirements',
        { params }
      );
      const training = response.data.value;
      const totalCount = response.data['@odata.count'] !== undefined ? response.data['@odata.count'] : 0;

      dispatch(fetchTrainingsSuccess(training, totalCount));
      resolve(training);
    } catch (error) {
      dispatch(fetchTrainingsFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof fetchInitialTrainingsRequest>
  | ReturnType<typeof fetchTrainingsRequest>
  | ReturnType<typeof fetchTrainingsSuccess>
  | ReturnType<typeof fetchTrainingsFailure>;
