import React, { useEffect } from 'react';
import { ContactInfo } from './ContactInfo';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchTrainee } from 'features/trainee/slice';
import { fetchTraineeCourseCredits, traineeCourseCreditsSelectors } from 'features/traineeCourseCredits/slice';
import { getOptionsIfNeeded } from '@pec/aion-ui-core/actions/options';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { RegisterPrompt } from './RegisterPrompt';
import { Route, Switch } from 'react-router-dom';
import { TrainingHistory } from './TrainingHistory';
import { useAppDispatch, useTypedSelector } from 'app/reducer';

export const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isFetching: isFetchingTrainee, error: traineeError, trainee } = useTypedSelector(state => state.trainee);
  const { isFetching: isFetchingTraineeCourseCredits, error: traineeCourseCreditsError } = useTypedSelector(
    state => state.traineeCourseCredits
  );
  const traineeCourseCredits = useTypedSelector(traineeCourseCreditsSelectors.selectAll);

  const isFetching = isFetchingTrainee || isFetchingTraineeCourseCredits;
  const error = traineeError || traineeCourseCreditsError;

  useEffect(() => {
    dispatch(fetchTrainee());
    dispatch(fetchTraineeCourseCredits());
    dispatch(getOptionsIfNeeded());
  }, [dispatch]);

  return !isFetching ? (
    trainee && traineeCourseCredits && !error ? (
      <Switch>
        <Route
          exact
          path="/"
          render={() => <TrainingHistory trainee={trainee} traineeCourseCredits={traineeCourseCredits} />}
        />
        <Route
          exact
          path="/contact-info"
          render={() => <ContactInfo trainee={trainee} traineeCourseCredits={traineeCourseCredits} />}
        />
      </Switch>
    ) : trainee === undefined ? (
      <RegisterPrompt />
    ) : (
      error && <Error />
    )
  ) : (
    <Loading />
  );
};
