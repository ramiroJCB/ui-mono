import axios from 'axios';
import { Actions, fetchTraineesFailure, fetchTraineesRequest, fetchTraineesSuccess } from './fetchTrainees';
import { addTrainee } from './addTrainee';
import { History } from 'history';
import { ITrainee } from '../interfaces/trainee';
import { RootState } from '../combineReducers';
import { ThunkAction } from 'redux-thunk';
import { updateTrainee } from './updateTrainee';

export const searchTrainees = (
  { firstName, lastName, birthDate, organizationId, phoneNumber, ssnLastFour }: Partial<ITrainee>,
  history: History
): ThunkAction<Promise<ITrainee[]>, RootState, null, Actions> => dispatch => {
  return new Promise<ITrainee[]>(async (resolve, reject) => {
    try {
      dispatch(fetchTraineesRequest());

      const response = await axios.get<ITrainee[]>('/api/v3/trainees', {
        params: {
          firstName,
          lastName,
          birthDate,
          ssnLastFour,
          unregistered: true
        }
      });

      const trainees = response.data;
      const unregisteredTrainees = trainees.filter(t => t.userId === null);

      dispatch(fetchTraineesSuccess(unregisteredTrainees, null));

      if (unregisteredTrainees.length === 0) {
        dispatch(addTrainee({ firstName, lastName, birthDate, organizationId, phoneNumber, ssnLastFour }));
      } else if (organizationId && unregisteredTrainees.length === 1) {
        dispatch(updateTrainee({ ...unregisteredTrainees[0], organizationId }));
      } else {
        history.push({
          state: { hasMultipleResults: true }
        });
      }

      resolve(unregisteredTrainees);
    } catch (error) {
      dispatch(fetchTraineesFailure(error, null));
      reject(error);
    }
  });
};
