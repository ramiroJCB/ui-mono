import * as React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { ContractorIncidentsTableComponent } from '../components/ContractorIncidentsTable';
import { DeepReadonly } from 'utility-types';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IIncident } from 'interfaces/incident';
import { Link } from '@pec/aion-ui-components/components/Link';
import { useTranslation } from 'react-i18next';

type Props = {
  incidents: DeepReadonly<IIncident[]>;
  organizationId: string;
};

const ContractorIncidents: React.FC<Props> = ({ incidents, organizationId }) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <GridContainer alignItems="flex-start" justify="space-between" style={{ flex: 0 }}>
        <Grid item xs={8}>
          <Typography variant="h5" component="h1">
            {t('reporting.incidents.contractorIncidents.leadingIndicatorReports', 'Leading Indicator Reports')}
          </Typography>
        </Grid>
        <Grid item xs={4} style={{ textAlign: 'right' }}>
          <Button
            variant="contained"
            color="secondary"
            component={Link}
            to={`/${organizationId}/reporting/incidents/add`}
          >
            {t('reporting.incidents.contractorIncidents.reportLeadingIndicator', 'Report a Leading Indicator')}
          </Button>
        </Grid>
      </GridContainer>
      <ContractorIncidentsTableComponent incidents={incidents} />
    </React.Fragment>
  );
};

export const ContractorIncidentsComponent = ContractorIncidents;
