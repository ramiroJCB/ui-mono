import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { ClientScoresTileContainer } from 'containers/Dashboard/ClientScoresTile';
import { CompanyProfileIncompleteContainer } from 'containers/Dashboard/CompanyProfileIncomplete';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { InsuranceExpiredContainer } from 'containers/Dashboard/InsuranceExpired';
import { InsuranceExpiringContainer } from 'containers/Dashboard/InsuranceExpiring';
import { OfferingsTile } from './OfferingsTile';
import { QuestionnaireTileContainer } from 'containers/Dashboard/QuestionnaireTile';
import { ReleasesContainer } from 'containers/Dashboard/Releases';
import { SubscriptionsExpiredContainer } from 'containers/Dashboard/SubscriptionsExpired';
import { SubscriptionsExpiringContainer } from 'containers/Dashboard/SubscriptionsExpiring';
import { VerificationsExpiredContainer } from 'containers/Dashboard/VerificationsExpired';
import { VerificationsExpiringContainer } from 'containers/Dashboard/VerificationsExpiring';
import { VerificationsTileContainer } from 'containers/Dashboard/VerificationsTile';
import { VeriforceIntegrationContainer } from 'containers/Dashboard/VeriforceIntegration';

export const DashboardContainer: React.FC = () => (
  <GridContainer spacing={0}>
    <Grid item xs={12}>
      <GridContainer>
        <VeriforceIntegrationContainer />
        <SubscriptionsExpiredContainer />
        <SubscriptionsExpiringContainer />
        <VerificationsExpiredContainer />
        <VerificationsExpiringContainer />
        <CompanyProfileIncompleteContainer />
        <InsuranceExpiredContainer />
        <InsuranceExpiringContainer />
        <ReleasesContainer />
      </GridContainer>
    </Grid>
    <Grid item xs={12} sm={5}>
      <GridContainer>
        <Grid item xs={12}>
          <QuestionnaireTileContainer />
        </Grid>
        <Grid item xs={12}>
          <OfferingsTile />
        </Grid>
      </GridContainer>
    </Grid>
    <Grid item xs={12} sm={7}>
      <GridContainer>
        <Grid item xs={12}>
          <ClientScoresTileContainer />
        </Grid>
        <Grid item xs={12}>
          <VerificationsTileContainer />
        </Grid>
      </GridContainer>
    </Grid>
  </GridContainer>
);
