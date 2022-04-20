import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ViewForms } from '../features/forms/ViewForms';
import { AddForm } from '../features/forms/AddForm';
import { Section } from '../features/formSections/Section';

export const Routes: React.FC = () => (
  <Switch>
    <Route path="/:organizationId/forms/:formId/sections/:sectionId" component={Section} />
    <Route path="/:organizationId/forms/add" component={AddForm} />
    <Route path="/:organizationId/forms" component={ViewForms} />
  </Switch>
);
