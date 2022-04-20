import React from 'react';
import { BusinessUnits } from 'features/businessUnits/BusinessUnits';
import { Route, Switch } from 'react-router-dom';

export const BusinessUnitsRoutes: React.FC = () => (
  <Switch>
    <Route path="/:organizationId/scoring/:tab(business-units)" component={BusinessUnits} />
  </Switch>
);
