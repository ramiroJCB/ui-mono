import * as React from 'react';
import { AddTrainingContainer } from 'features/operator/training/containers/AddTraining';
import { Route, Switch } from 'react-router-dom';
import { RouteTransition } from 'components/RouteTransition';
import { TrainingGeneralInfoContainer } from 'features/operator/training/containers/TrainingGeneralInfo';
import { TrainingRequirementsBreadcrumbsContainer } from 'features/breadcrumbs/containers/operator/TrainingRequirementsBreadcrumbs';
import { TrainingsContainer } from 'features/operator/trainings/containers/Trainings';

export const OperatorTrainingRequirementsRoutes: React.FC = () => (
  <RouteTransition>
    {location => (
      <React.Fragment>
        <Route
          path="/:organizationId/training-compliance/training/:trainingRequirementId([^/]{36})?"
          component={TrainingRequirementsBreadcrumbsContainer}
        />
        <Switch location={location}>
          <Route
            path="/:organizationId/training-compliance/training/:trainingRequirementId/general-info"
            component={TrainingGeneralInfoContainer}
          />
          <Route path="/:organizationId/training-compliance/training/add" component={AddTrainingContainer} />
          <Route path="/:organizationId/training-compliance/training" component={TrainingsContainer} />
        </Switch>
      </React.Fragment>
    )}
  </RouteTransition>
);
