import React, { useEffect } from 'react';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchInspection } from 'features/inspection/slice';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { MobileInspectionInfo } from '../inspectionSections/MobileInspectionInfo';
import { useAppDispatch, useTypedSelector } from 'app/reducer';
import { useParams } from 'react-router-dom';

export const InspectionInfo: React.FC = () => {
  const dispatch = useAppDispatch();
  const { organizationId, inspectionId } = useParams<{ organizationId: string; inspectionId: string }>();
  const { isFetching, error, inspection } = useTypedSelector(state => state.inspection);

  useEffect(() => {
    dispatch(fetchInspection(inspectionId));
  }, [dispatch, organizationId, inspectionId]);

  return !isFetching && !error && inspection ? (
    <MobileInspectionInfo inspection={inspection} />
  ) : error ? (
    <Error message="There was an error processing your request." />
  ) : (
    <Loading />
  );
};
