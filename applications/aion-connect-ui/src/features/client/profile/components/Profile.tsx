import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { JumbotronContainer } from '../containers/Jumbotron';
import { ProfileContentContainer } from '../containers/ProfileContent';
import { SearchContractorsBreadcrumbsContainer } from 'features/client/searchContractors/containers/SearchContractorsBreadcrumbsContainer';

export const Profile: React.FC = () => (
  <React.Fragment>
    <GridContainer spacing={5}>
      <Grid item xs={12} style={{ paddingBottom: 0 }}>
        <SearchContractorsBreadcrumbsContainer />
      </Grid>
      <JumbotronContainer />
    </GridContainer>
    <ProfileContentContainer />
  </React.Fragment>
);
