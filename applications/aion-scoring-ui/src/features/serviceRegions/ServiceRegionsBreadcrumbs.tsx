import React, { useEffect } from 'react';
import { Breadcrumbs } from '@pec/aion-ui-components/components/Breadcrumbs';
import { IBreadcrumbLink } from '@pec/aion-ui-core/interfaces/breadcrumbLink';
import { Grid } from '@material-ui/core';
import { matchPath, useLocation, useParams } from 'react-router-dom';
import { fetchServiceRegions, serviceRegionsSelectors } from './slice';
import { useAppDispatch, useTypedSelector } from 'app/reducer';

export const ServiceRegionsBreadcrumbs: React.FC = () => {
  const dispatch = useAppDispatch();
  const { pathname, search } = useLocation();
  const { organizationId, serviceRegionId } = useParams<{
    organizationId: string;
    serviceRegionId?: string;
  }>();
  const { isFetching: isFetchingServiceRegions } = useTypedSelector(state => state.serviceRegions);
  const serviceRegion = useTypedSelector(state => {
    if (serviceRegionId) {
      return serviceRegionsSelectors.selectById(state, serviceRegionId);
    }
    return null;
  });

  useEffect(() => {
    !serviceRegion && dispatch(fetchServiceRegions(organizationId));
  }, [dispatch, organizationId, serviceRegion]);

  const links: IBreadcrumbLink[] = [
    {
      to: { pathname: `/${organizationId}/scoring/service-regions`, search },
      label: 'Service Regions'
    }
  ];

  if (serviceRegionId)
    if (matchPath(pathname, '/:organizationId/scoring/service-regions/:serviceRegionId/score-set/add')) {
      links.push({
        to: {
          pathname: `/${organizationId}/scoring/service-regions/${serviceRegionId}/score-set/add`,
          search
        },
        label: !isFetchingServiceRegions && serviceRegion ? `Add Score Set to ${serviceRegion.serviceRegionName}` : '⋯'
      });
    }

  return (
    <Grid item style={{ paddingLeft: 0 }}>
      <Breadcrumbs links={links.map((link, i) => ({ ...link, i }))} />
    </Grid>
  );
};
