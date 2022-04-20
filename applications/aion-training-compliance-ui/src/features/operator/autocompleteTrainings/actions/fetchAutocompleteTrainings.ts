import axios, { AxiosError } from 'axios';
import { AsyncResult } from 'react-select-async-paginate';
import { ITrainingRequirement } from '@pec/aion-ui-core/interfaces/trainingRequirement';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { SelectAdditional } from '@pec/aion-ui-form/types/selectAdditional';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchAutocompleteTrainingsRequest = () =>
  ({
    type: 'FETCH_AUTOCOMPLETE_TRAININGS_REQUEST'
  } as const);

const fetchAutocompleteTrainingsSuccess = (payload: ITrainingRequirement[], totalCount: number, currentPage: number) =>
  ({
    type: 'FETCH_AUTOCOMPLETE_TRAININGS_SUCCESS',
    payload,
    totalCount,
    currentPage
  } as const);

const fetchAutocompleteTrainingsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_AUTOCOMPLETE_TRAININGS_FAILURE',
    error
  } as const;
};

export const fetchAutocompleteTrainings = (
  organizationId: string,
  inputValue?: string,
  page: number = 1,
  top: number = 10
): ThunkAction<
  Promise<AsyncResult<ITrainingRequirement, SelectAdditional>>,
  RootState,
  null,
  Actions
> => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchAutocompleteTrainingsRequest());

      const { Contains, Equals } = OdataComparator;
      const params = new QueryBuilder()
        .top(top)
        .skip((page - 1) * top)
        .filter(({ filterBy }) =>
          filterBy('name', Contains, inputValue)
            .filterBy('isDeleted', Equals, false)
            .filterBy('organizationId', Equals, organizationId)
            .or(({ filterBy }) =>
              filterBy('name', Contains, inputValue)
                .filterBy('isDeleted', Equals, false)
                .filterBy('organizationId', Equals, null)
            )
        )
        .orderBy('name')
        .toQueryParam();

      const { data } = await axios.get<{ value: ITrainingRequirement[]; '@odata.count': number }>(
        '/api/trainingCompliance/v3.01/trainingRequirements',
        { params }
      );

      const total = data['@odata.count'];
      const payload = data.value;

      dispatch(fetchAutocompleteTrainingsSuccess(payload, total, page));
      resolve({
        options: payload,
        hasMore: Math.ceil(total / top) > page,
        additional: { page: page + 1 }
      });
    } catch (error) {
      dispatch(fetchAutocompleteTrainingsFailure(error));
      reject(error);
    }
  });
};

export type Actions =
  | ReturnType<typeof fetchAutocompleteTrainingsRequest>
  | ReturnType<typeof fetchAutocompleteTrainingsSuccess>
  | ReturnType<typeof fetchAutocompleteTrainingsFailure>;
