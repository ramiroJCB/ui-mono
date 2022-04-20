import React, { useEffect } from 'react';
import { Breadcrumbs } from '@pec/aion-ui-components/components/Breadcrumbs';
import { IBreadcrumbLink } from '@pec/aion-ui-core/interfaces/breadcrumbLink';
import { Grid } from '@material-ui/core';
import { matchPath, useLocation, useParams } from 'react-router-dom';
import { fetchServiceRegions, serviceRegionsSelectors } from '../serviceRegions/slice';
import { useAppDispatch, useTypedSelector } from 'app/reducer';

export const EditScoreItemBreadcrumbs: React.FC = () => {
  const dispatch = useAppDispatch();
  const { pathname, search } = useLocation();
  const { organizationId, serviceRegionId, scoreSetId, scoreItemId } = useParams<{
    organizationId: string;
    serviceRegionId?: string;
    scoreSetId?: string;
    scoreItemId?: string;
  }>();
  const { isFetching: isFetchingServiceRegions } = useTypedSelector(state => state.serviceRegions);
  const { scoreItem, isFetching: isFetchingScoreItem } = useTypedSelector(state => state.scoreItem);
  const serviceRegion = useTypedSelector(state => {
    if (serviceRegionId) {
      return serviceRegionsSelectors.selectById(state, serviceRegionId);
    }
    return null;
  });
  const { isFetching: isFetchingScoreSet, scoreSet } = useTypedSelector(state => state.scoreSet);

  useEffect(() => {
    !serviceRegion && dispatch(fetchServiceRegions(organizationId));
  }, [dispatch, organizationId, serviceRegion]);

  const links: IBreadcrumbLink[] = [
    {
      to: { pathname: `/${organizationId}/scoring/service-regions`, search },
      label: 'Service Regions'
    },
    {
      to: { pathname: `/${organizationId}/scoring/service-regions`, search },
      label: !isFetchingServiceRegions && serviceRegion ? serviceRegion.serviceRegionName : '⋯'
    },
    {
      to: {
        pathname: `/${organizationId}/scoring/service-regions/${serviceRegionId}/score-set/${scoreSetId}/edit`,
        search
      },
      label: !isFetchingScoreSet && serviceRegionId && scoreSetId && scoreSet ? scoreSet.name : '⋯'
    }
  ];

  if (
    matchPath(
      pathname,
      '/:organizationId/scoring/service-regions/:serviceRegionId/score-set/:scoreSetId/score-item/:scoreItemId/edit'
    )
  ) {
    links.push({
      to: {
        pathname: `/${organizationId}/scoring/service-regions/${serviceRegionId}/score-set/${scoreSetId}/score-item/${scoreItemId}/edit`,
        search
      },
      label: !isFetchingScoreItem && scoreItem ? `Edit ${scoreItem.name}` : '⋯'
    });
  }

  return (
    <Grid item style={{ paddingLeft: 0 }}>
      <Breadcrumbs links={links.map((link, i) => ({ ...link, i }))} />
    </Grid>
  );
};
