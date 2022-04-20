import React from 'react';
import { EditServiceRegionScoreSetBreadcrumbs } from 'features/serviceRegions/EditServiceRegionScoreSetBreadcrumbs';
import { Route, useLocation, Switch } from 'react-router-dom';
import { ScoreItemForm } from 'features/scoreItems/ScoreItemForm';
import { EditScoreItemBreadcrumbs } from 'features/scoreItems/EditScoreItemBreadcrumbs';
import { ScoreSetForm } from 'features/scoreSets/ScoreSetForm';
import { ServiceRegions } from 'features/serviceRegions/ServiceRegions';
import { ServiceRegionsBreadcrumbs } from 'features/serviceRegions/ServiceRegionsBreadcrumbs';

export const ServiceRegionsRoutes: React.FC = () => {
  const path = useLocation().pathname;
  const isEdittingScoreSet =
    (path.includes('score-set') && path.includes('edit') && !path.includes('score-item')) ||
    path.includes('score-item/add');
  const isEdittingScoreItem = path.includes('score-item') && path.includes('edit');

  return (
    <>
      {isEdittingScoreItem ? (
        <Route
          path="/:organizationId/scoring/:tab(service-regions)/:serviceRegionId([^/]{36})?/score-set/:scoreSetId([^/]{36})?/score-item/:scoreItemId([^/]{36})?"
          component={EditScoreItemBreadcrumbs}
        />
      ) : isEdittingScoreSet ? (
        <Route
          path="/:organizationId/scoring/:tab(service-regions)/:serviceRegionId([^/]{36})?/score-set/:scoreSetId([^/]{36})?"
          component={EditServiceRegionScoreSetBreadcrumbs}
        />
      ) : (
        <Route
          path="/:organizationId/scoring/:tab(service-regions)/:serviceRegionId([^/]{36})?"
          component={ServiceRegionsBreadcrumbs}
        />
      )}
      <Switch>
        <Route exact path="/:organizationId/scoring/:tab(service-regions)" component={ServiceRegions} />
        <Route
          exact
          path="/:organizationId/scoring/:tab(service-regions)/:serviceRegionId/score-set/add"
          component={ScoreSetForm}
        />
        <Route
          exact
          path="/:organizationId/scoring/:tab(service-regions)/:serviceRegionId/score-set/:scoreSetId/edit"
          component={ScoreSetForm}
        />
        <Route
          exact
          path="/:organizationId/scoring/:tab(service-regions)/:serviceRegionId/score-set/:scoreSetId/score-item/add"
          component={ScoreItemForm}
        />
        <Route
          exact
          path="/:organizationId/scoring/:tab(service-regions)/:serviceRegionId/score-set/:scoreSetId/score-item/:scoreItemId/edit"
          component={ScoreItemForm}
        />
      </Switch>
    </>
  );
};
