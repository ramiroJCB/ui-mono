import React, { useEffect } from 'react';
import { DesktopInspectionSections } from './DesktopInspectionSections';
import { fetchInspection } from '../../inspection/slice';
import { fetchInspectionSections } from '../../inspectionSections/slice';
import { MobileInspectionSections } from './MobileInspectionSections';
import { useAppDispatch } from 'app/reducer';
import { useParams } from 'react-router-dom';
import { useScreenSize } from '@pec/aion-ui-components/hooks/useScreenSize';

export const ViewClientInspectionSections: React.FC = () => {
  const { isLargeUp } = useScreenSize();
  const dispatch = useAppDispatch();
  const { organizationId, inspectionId } = useParams<{ organizationId: string; inspectionId: string }>();

  useEffect(() => {
    dispatch(fetchInspection(inspectionId));
    dispatch(fetchInspectionSections(inspectionId));
  }, [dispatch, organizationId, inspectionId]);

  return <div>{isLargeUp ? <DesktopInspectionSections /> : <MobileInspectionSections />}</div>;
};
