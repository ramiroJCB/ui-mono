import React from 'react';
import { Admin } from 'features/admin/Admin';
import { Route, Switch } from 'react-router-dom';

export const AdminRoutes: React.FC = () => (
  <Switch>
    <Route path="/:organizationId/scoring/:tab(admin)" component={Admin} />
  </Switch>
);
