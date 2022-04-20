import React, { useEffect } from 'react';
import { defaultPageSize, DesktopInspections } from './DesktopInspections';
import { fetchInspections } from 'features/inspections/slice';
import { maxCount } from 'features/client/inspections/MobileInspections';
import { MobileInspections } from './MobileInspections';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { useAppDispatch } from 'app/reducer';
import { useLocation, useParams } from 'react-router-dom';
import { useScreenSize } from '@pec/aion-ui-components/hooks/useScreenSize';

export const ViewContractorInspections: React.FC = () => {
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
          isClientOrg: false
        })
      );
    }
  }, [dispatch, organizationId, search, isLargeUp, isSmallDown]);

  return isLargeUp ? <DesktopInspections /> : <MobileInspections />;
};
