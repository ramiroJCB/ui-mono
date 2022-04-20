import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { CompareServiceRegionScores } from 'features/compareServiceRegions/CompareServiceRegionScores';
import { CompareServiceRegionScoresBreadcrumbs } from 'features/compareServiceRegions/CompareServiceRegionScoresBreadcrumbs';

export const CompareServiceRegionsRoutes: React.FC = () => {
  return (
    <>
      <Route
        path="/:organizationId/scoring/comparison/:tab(service-regions)"
        component={CompareServiceRegionScoresBreadcrumbs}
      />
      <Switch>
        <Route
          exact
          path="/:organizationId/scoring/comparison/:tab(service-regions)"
          component={CompareServiceRegionScores}
        />
      </Switch>
    </>
  );
};
