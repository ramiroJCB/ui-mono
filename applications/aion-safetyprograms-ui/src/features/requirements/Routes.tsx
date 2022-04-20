import * as React from 'react';
import { AddReferenceContainer } from 'features/reference/containers/AddReference';
import { RequirementOverrides } from 'features/requirementOverrides/components/RequirementOverrides';
import { ClientQuestionContainer } from 'features/question/containers/ClientQuestion';
import { ClientRequirementContainer } from 'features/requirement/containers/ClientRequirement';
import { ClientRequirementsTabs } from './components/ClientTabs';
import { ContractorQuestionContainer } from 'features/question/containers/ContractorQuestion';
import { ContractorReferenceContainer } from 'features/reference/containers/ContractorReference';
import { ContractorRequirementContainer } from 'features/requirement/containers/ContractorRequirement';
import { ContractorRequirementsTabs } from './components/ContractorTabs';
import { DocumentContainer } from 'features/document/containers/Document';
import { EvaluatorReferenceContainer } from 'features/reference/containers/EvaluatorReference';
import { OrganizationFeatureSwitch } from '@pec/aion-ui-components/containers/OrganizationFeatureSwitch';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ReferenceDocumentsContainer } from 'features/documents/containers/ReferenceDocuments';

export const RequirementsRoutes: React.FC = () => (
  <Switch>
    <Route
      path="/organizations/:organizationId/safety-program-requirements/:safetyProgramRequirementId/answers/:questionAnswerId/references/add/:documentMetadataId"
      component={AddReferenceContainer}
    />
    <Route
      path="/organizations/:organizationId/safety-program-requirements/:safetyProgramRequirementId/answers/:questionAnswerId/references/add"
      component={ReferenceDocumentsContainer}
    />
    <Route
      path="/organizations/:organizationId/safety-program-requirements/:safetyProgramRequirementId/answers/:questionAnswerId/references/:documentReferenceId"
      render={props => (
        <OrganizationFeatureSwitch
          clientComponent={EvaluatorReferenceContainer}
          subscriberComponent={ContractorReferenceContainer}
          {...props}
        />
      )}
    />
    <Route
      path="/organizations/:organizationId/safety-program-requirements/:safetyProgramRequirementId/questions/:questionId"
      render={props => (
        <OrganizationFeatureSwitch
          clientComponent={ClientQuestionContainer}
          subscriberComponent={ContractorQuestionContainer}
          {...props}
        />
      )}
    />
    <Route
      path="/organizations/:organizationId/safety-program-requirements/documents/:documentMetadataId"
      component={DocumentContainer}
    />
    <Route
      exact
      path="/organizations/:organizationId/safety-program-requirements/:tab(documents)?"
      render={props => (
        <OrganizationFeatureSwitch
          clientComponent={ClientRequirementsTabs}
          subscriberComponent={ContractorRequirementsTabs}
          {...props}
        />
      )}
    />
    <Route
      exact
      path="/organizations/:organizationId/safety-program-requirements/:tab(requests)?"
      render={props => (
        <OrganizationFeatureSwitch
          clientComponent={ClientRequirementsTabs}
          subscriberComponent={ContractorRequirementsTabs}
          {...props}
        />
      )}
    />
    <Route
      exact
      path="/organizations/:organizationId/safety-program-requirements/:safetyProgramRequirementId"
      render={props => (
        <OrganizationFeatureSwitch
          clientComponent={ClientRequirementContainer}
          subscriberComponent={ContractorRequirementContainer}
          {...props}
        />
      )}
    />
    <Route
      path="/organizations/:organizationId/safety-program-requirements/requests/:safetyProgramRequirementId/exceptions"
      component={RequirementOverrides}
    />
    <Route
      path="/organizations/:organizationId/safety-program-requirements/:safetyProgramRequirementId/exceptions"
      component={RequirementOverrides}
    />
    <Redirect to="/organizations/:organizationId/safety-program-requirements" />
  </Switch>
);
