import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Specialist } from 'features/specialist/verificationSpecialist/VerificationSpecialist';
import { ViolationDetails } from 'features/specialist/violationDetails/ViolationDetails';
import { ContractorDetails } from 'features/contractor/ContractorDetails';
import { ClientDetails } from 'features/client/ClientDetails';

export const Routes: React.FC = () => (
  <Switch>
    <Route exact path="/osha-violations/:status?" component={Specialist} />
    <Route exact path="/organizations/:organizationId/osha-violations" component={ContractorDetails} />
    <Route path="/osha-violations/details/:status?" component={ViolationDetails} />
    <Route exact path="/organizations/:organizationId/osha-violations/client/information" component={ClientDetails} />
  </Switch>
);
