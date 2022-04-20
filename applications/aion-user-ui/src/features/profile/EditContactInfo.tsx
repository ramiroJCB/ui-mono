import React, { useEffect } from 'react';
import { EditContactInfoForm } from './EditContactInfoForm';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchTrainee, updateTrainee } from 'features/trainee/slice';
import { getOptionsIfNeeded } from '@pec/aion-ui-core/actions/options';
import { ITrainee } from '@pec/aion-ui-core/interfaces/trainee';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { RegisterPrompt } from './RegisterPrompt';
import { useAppDispatch, useTypedSelector } from 'app/reducer';
import { useHistory, useLocation } from 'react-router-dom';

export const EditContactInfo: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { isFetching, error, trainee } = useTypedSelector(state => state.trainee);

  const onSubmit = async (editContactInfoForm: ITrainee) => {
    await dispatch(updateTrainee(editContactInfoForm));

    const userReferredByCbt = parse(location.search).from === 'eLearning/Student/';
    userReferredByCbt ? window.location.assign('/eLearning/Student/') : history.push('/contact-info');
  };

  useEffect(() => {
    dispatch(fetchTrainee());
    dispatch(getOptionsIfNeeded());
  }, [dispatch]);

  return !isFetching ? (
    trainee ? (
      <EditContactInfoForm onSubmit={onSubmit} initialValues={trainee} trainee={trainee} location={location} />
    ) : trainee === undefined ? (
      <RegisterPrompt />
    ) : (
      error && <Error />
    )
  ) : (
    <Loading />
  );
};
