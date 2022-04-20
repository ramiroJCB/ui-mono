import * as React from 'react';
import { AddMandateContainer } from 'features/mandate/containers/AddMandate';
import { AddQuestionContainer } from 'features/question/containers/AddQuestion';
import { AddSafetyProgramContainer } from 'features/safetyProgram/containers/AddSafetyProgram';
import { ClientsContainer } from 'features/clients/containers/Clients';
import { EditMandateContainer } from 'features/mandate/containers/EditMandate';
import { EditQuestionContainer } from 'features/question/containers/EditQuestion';
import { MandatesContainer } from 'features/mandates/containers/Mandates';
import { Route, Switch } from 'react-router-dom';
import { SafetyProgramContainer } from 'features/safetyProgram/containers/SafetyProgram';
import { SafetyProgramsContainer } from './containers/SafetyPrograms';
import { EditSafetyProgramContainer } from 'features/safetyProgram/containers/EditSafetyProgram';
import { EditShopLinksContainer } from 'features/shopLinks/containers/EditShopLinks';
import { ReportsContainer } from 'features/reports/containers/Reports';

export const SafetyProgramsRoutes: React.FC = () => (
  <Switch>
    <Route path="/safety-programs/add" component={AddSafetyProgramContainer} />
    <Route path="/safety-programs/clients/:clientId/mandates/add" component={AddMandateContainer} />
    <Route path="/safety-programs/clients/:clientId/mandates/:mandateId" component={EditMandateContainer} />
    <Route path="/safety-programs/clients/:clientId" component={MandatesContainer} />
    <Route path="/safety-programs/clients" component={ClientsContainer} />
    <Route path="/safety-programs/reports" component={ReportsContainer} />
    <Route path="/safety-programs/edit-shop-links" component={EditShopLinksContainer} />
    <Route path="/safety-programs/:safetyProgramId/questions/add" component={AddQuestionContainer} />
    <Route path="/safety-programs/:safetyProgramId/questions/:questionId" component={EditQuestionContainer} />
    <Route path="/safety-programs/:safetyProgramId/edit" component={EditSafetyProgramContainer} />
    <Route path="/safety-programs/:safetyProgramId" component={SafetyProgramContainer} />
    <Route path="/safety-programs" component={SafetyProgramsContainer} />
  </Switch>
);
