import * as React from 'react';
import { RequirementOverrides } from 'features/requirementOverrides/components/RequirementOverrides';
import { DocumentContainer } from 'features/document/containers/Document';
import { EvaluationsTabs } from './components/EvaluationsTabs';
import { EvaluatorQuestionContainer } from 'features/question/containers/EvaluatorQuestion';
import { EvaluatorReferenceContainer } from 'features/reference/containers/EvaluatorReference';
import { EvaluatorRequirementContainer } from 'features/requirement/containers/EvaluatorRequirement';
import { Route, Switch } from 'react-router-dom';

export const EvaluationsRoutes: React.FC = () => (
  <Switch>
    <Route
      path="/safety-program-requirements/:safetyProgramRequirementId/answers/:questionAnswerId/references/:documentReferenceId"
      component={EvaluatorReferenceContainer}
    />
    <Route
      path="/safety-program-requirements/:safetyProgramRequirementId/questions/:questionId"
      component={EvaluatorQuestionContainer}
    />
    <Route path="/safety-program-requirements/documents/:documentMetadataId" component={DocumentContainer} />
    <Route exact path="/safety-program-requirements/:tab(documents)?" component={EvaluationsTabs} />
    <Route
      exact
      path="/safety-program-requirements/:safetyProgramRequirementId"
      component={EvaluatorRequirementContainer}
    />
    <Route
      path="/safety-program-requirements/:safetyProgramRequirementId/exceptions"
      component={RequirementOverrides}
    />
  </Switch>
);
