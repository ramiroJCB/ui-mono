import React from 'react';
import { Redirect, Route, Switch, useParams } from 'react-router-dom';
import { AdminRoutes } from './Admin';
import { BusinessUnitsRoutes } from './BusinessUnits';
import { CompareServiceRegionsRoutes } from './comparisons/ServiceRegions';
import { ReportsRoutes } from './Reports';
import { ServiceRegionsRoutes } from './ServiceRegions';

type RouteParams = {
  organizationId: string;
};

export const Routes: React.FC = () => {
  const { organizationId } = useParams<RouteParams>();

  return (
    <Switch>
      <Route path="/:organizationId/scoring/comparison/service-regions" component={CompareServiceRegionsRoutes} />
      <Route path="/:organizationId/scoring/service-regions" component={ServiceRegionsRoutes} />
      <Route path="/:organizationId/scoring/business-units" component={BusinessUnitsRoutes} />
      <Route path="/:organizationId/scoring/reports" component={ReportsRoutes} />
      <Route path="/:organizationId/scoring/admin" component={AdminRoutes} />
      <Redirect exact from="/:organizationId/scoring" to={`/${organizationId}/scoring/service-regions`} />
    </Switch>
  );
};
