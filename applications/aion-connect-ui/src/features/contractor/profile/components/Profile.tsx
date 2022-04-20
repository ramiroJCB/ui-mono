import * as React from 'react';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { JumbotronContainer } from '../containers/Jumbotron';
import { ProfileContentContainer } from '../containers/ProfileContent';
import { ToggleViewContainer } from 'features/contractor/profile/containers/ToggleView';

export const Profile: React.FC = () => (
  <React.Fragment>
    <GridContainer spacing={5}>
      <ToggleViewContainer />
      <JumbotronContainer />
    </GridContainer>
    <ProfileContentContainer />
  </React.Fragment>
);
