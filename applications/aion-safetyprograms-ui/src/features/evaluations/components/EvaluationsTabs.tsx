import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { DocumentsContainer } from 'features/documents/containers/Documents';
import { FilteredRequirementsContainer } from 'features/requirements/containers/FilteredRequirements';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import { useSharedTabStyles } from 'hooks/useSharedTabStyles';
import { useTranslation } from 'react-i18next';

type RouteParams = {
  tab?: 'documents';
};

type Props = RouteComponentProps<RouteParams>;

export const EvaluationsTabs: React.FC<Props> = props => {
  const {
    match: {
      params: { tab }
    }
  } = props;
  const { t } = useTranslation();

  const classes = useSharedTabStyles();

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
            label={t('safetyPrograms.common.programEvaluations', 'Program Evaluations')}
            to="/safety-program-requirements"
          />
          <Tab
            className={classes.tab}
            component={Link}
            label={t('safetyPrograms.common.allDocuments', 'All Documents')}
            to="/safety-program-requirements/documents"
            value="documents"
          />
        </Tabs>
      </Grid>
      <Grid item xs={12}>
        {tab === 'documents' ? (
          <DocumentsContainer isContractor={false} />
        ) : (
          <FilteredRequirementsContainer {...props} />
        )}
      </Grid>
    </GridContainer>
  );
};
