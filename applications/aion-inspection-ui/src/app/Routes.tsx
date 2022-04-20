import React from 'react';
import { AddInspection } from 'features/client/inspections/AddInspection';
import { OrganizationFeatureSwitch } from '@pec/aion-ui-components/containers/OrganizationFeatureSwitch';
import { Question } from 'features/client/question/Question';
import { Route, Switch } from 'react-router-dom';
import { ViewQuestions } from 'features/questions/ViewQuestions';
import { ViewClientInspections } from 'features/client/inspections/ViewInspections';
import { ViewClientInspectionSections } from 'features/client/inspectionSections/ViewInspectionSections';
import { ViewContractorInspections } from 'features/contractor/inspections/ViewInspections';
import { ViewContractorInspectionSections } from 'features/contractor/inspectionSections/ViewInspectionSections';

export const Routes: React.FC = () => (
  <Switch>
    <Route path="/:organizationId/reviews/add" component={AddInspection} />
    <Route
      path="/:organizationId/reviews/:inspectionId/inspection-sections/:sectionId/questions/:questionId"
      component={Question}
    />
    <Route path="/:organizationId/reviews/:inspectionId/inspection-sections/:sectionId" component={ViewQuestions} />
    <Route
      path="/:organizationId/reviews/:inspectionId"
      render={props => (
        <OrganizationFeatureSwitch
          clientComponent={ViewClientInspectionSections}
          subscriberComponent={ViewContractorInspectionSections}
          {...props}
        />
      )}
    />
    <Route
      path="/:organizationId/reviews"
      render={props => (
        <OrganizationFeatureSwitch
          clientComponent={ViewClientInspections}
          subscriberComponent={ViewContractorInspections}
          {...props}
        />
      )}
    />
  </Switch>
);
