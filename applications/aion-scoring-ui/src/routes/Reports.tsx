import React from 'react';
import { Reports } from 'features/reports/Reports';
import { Route, Switch } from 'react-router-dom';

export const ReportsRoutes: React.FC = () => (
  <Switch>
    <Route path="/:organizationId/scoring/:tab(reports)" component={Reports} />
  </Switch>
);
