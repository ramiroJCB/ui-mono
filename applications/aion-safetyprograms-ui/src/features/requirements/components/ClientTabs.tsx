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
import { ExceptionRequestsContainer } from 'features/exceptionRequests/containers/ExceptionRequests';
import { DotBadge } from '@pec/aion-ui-components/components/DotBadge';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'combineReducers';
import { useEffect } from 'react';
import { fetchClientRequirementOverridesByClientId } from 'features/requirementClientOverrides/fetchRequirementClientOverrides';
import { useTranslation } from 'react-i18next';
import { usePermission } from 'hooks/usePermission';

type RouteParams = {
  organizationId: string;
  tab?: 'documents' | 'requests';
};

type Props = RouteComponentProps<RouteParams>;

export const ClientRequirementsTabs: React.FC<Props> = props => {
  const {
    match: {
      params: { organizationId, tab }
    },
    location: { search }
  } = props;

  const classes = useSharedTabStyles();

  const { clientRequirementOverrides } = useSelector((state: RootState) => state.clientRequirementOverrides);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { disabled } = usePermission();

  useEffect(() => {
    dispatch(fetchClientRequirementOverridesByClientId(search, organizationId));
  }, [dispatch, organizationId, search]);

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
          {!disabled && (
            <Tab
              className={classes.tab}
              component={Link}
              label={
                clientRequirementOverrides && clientRequirementOverrides.length > 0 ? (
                  <DotBadge> {t('safetyPrograms.requirement.exceptionRequests', 'Exception Requests')}</DotBadge>
                ) : (
                  t('safetyPrograms.requirement.exceptionRequests', 'Exception Requests')
                )
              }
              to={`/organizations/${organizationId}/safety-program-requirements/requests`}
              value="requests"
            />
          )}
        </Tabs>
      </Grid>
      <Grid item xs={12}>
        {tab === 'documents' ? (
          <DocumentsContainer isContractor={false} organizationId={organizationId} {...props} />
        ) : tab === 'requests' ? (
          <ExceptionRequestsContainer {...props} />
        ) : (
          <FilteredRequirementsContainer {...props} />
        )}
      </Grid>
    </GridContainer>
  );
};
