import React, { useEffect } from 'react';
import { defaultPageSize, DesktopInspections } from './DesktopInspections';
import { fetchInspections } from '../../inspections/slice';
import { maxCount, MobileInspections } from './MobileInspections';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { useAppDispatch } from 'app/reducer';
import { useLocation, useParams } from 'react-router-dom';
import { useScreenSize } from '@pec/aion-ui-components/hooks/useScreenSize';

export const ViewClientInspections: React.FC = () => {
  const { isLargeUp, isSmallDown } = useScreenSize();
  const dispatch = useAppDispatch();
  const { search } = useLocation();
  const { organizationId } = useParams<{ organizationId: string }>();

  useEffect(() => {
    if (isLargeUp || isSmallDown) {
      dispatch(
        fetchInspections({
          organizationId,
          urlQuery: parse(search || ''),
          pageSize: isLargeUp ? defaultPageSize : maxCount,
          isClientOrg: true
        })
      );
    }
  }, [dispatch, organizationId, search, isLargeUp, isSmallDown]);

  return <div>{isLargeUp ? <DesktopInspections /> : <MobileInspections />}</div>;
};
