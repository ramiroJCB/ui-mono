import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { ContractorRequirementsContainer } from '../containers/ContractorRequirements';
import { DocumentsContainer } from 'features/documents/containers/Documents';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import { useSharedTabStyles } from 'hooks/useSharedTabStyles';
import { useTranslation } from 'react-i18next';

type RouteParams = {
  organizationId: string;
  tab?: 'documents';
};

type Props = RouteComponentProps<RouteParams>;

export const ContractorRequirementsTabs: React.FC<Props> = props => {
  const {
    match: {
      params: { organizationId, tab }
    }
  } = props;

  const classes = useSharedTabStyles();
  const { t } = useTranslation();

  return (
    <GridContainer>
      <Grid item>
        <Typography variant="h6">{t('safetyPrograms.common.programReviews', 'Program Reviews')}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Tabs value={tab || 0} indicatorColor="primary">
          <Tab
            className={classes.tab}
            component={Link}
            label={t('safetyPrograms.common.programReviews', 'Program Reviews')}
            to={`/organizations/${organizationId}/safety-program-requirements`}
          />
          <Tab
            className={classes.tab}
            component={Link}
            label={t('safetyPrograms.common.allDocuments', 'All Documents')}
            to={`/organizations/${organizationId}/safety-program-requirements/documents`}
            value="documents"
          />
        </Tabs>
      </Grid>
      <Grid item xs={12}>
        {tab === 'documents' ? (
          <DocumentsContainer isContractor={true} organizationId={organizationId} {...props} />
        ) : (
          <ContractorRequirementsContainer {...props} />
        )}
      </Grid>
    </GridContainer>
  );
};
