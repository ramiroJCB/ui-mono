import React, { useEffect } from 'react';
import { DesktopQuestions } from './DesktopQuestions';
import { fetchInspection } from '../inspection/slice';
import { fetchInspectionSections } from '../inspectionSections/slice';
import { fetchQuestions } from './slice';
import { MobileQuestions } from './MobileQuestions';
import { useAppDispatch } from 'app/reducer';
import { useParams } from 'react-router-dom';
import { useScreenSize } from '@pec/aion-ui-components/hooks/useScreenSize';

export const ViewQuestions: React.FC = () => {
  const { isLargeUp } = useScreenSize();
  const dispatch = useAppDispatch();
  const { organizationId, inspectionId, sectionId } = useParams<{
    organizationId: string;
    inspectionId: string;
    sectionId: string;
  }>();

  useEffect(() => {
    dispatch(fetchInspection(inspectionId));
    dispatch(fetchInspectionSections(inspectionId));
    dispatch(fetchQuestions({ organizationId, sectionId }));
  }, [dispatch, organizationId, inspectionId, sectionId]);

  return <div>{isLargeUp ? <DesktopQuestions /> : <MobileQuestions />}</div>;
};
