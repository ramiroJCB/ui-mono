import * as React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { addRequirementOverride } from '../actions/addRequirementOverride';
import { ContractorRequirementBreadcrumbs } from 'features/requirement/components/ContractorBreadcrumbs';
import { EvaluatorRequirementBreadcrumbs } from 'features/requirement/components/EvaluatorBreadcrumbs';
import { fetchRequirementOverrides } from '../actions/fetchRequirementOverrides';
import { fetchRequirement } from 'features/requirement/actions/fetchRequirement';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { Link } from 'react-router-dom';
import { RootState } from 'combineReducers';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { RequirementOverrideRequestForm } from './RequirementOverrideRequestForm';

import { Box } from '@material-ui/core';
import { ClientOverrideStatus } from 'interfaces/requirementOverride';
import { OrganizationFeature } from '@pec/aion-ui-core/interfaces/organization';
import { fetchClientRequirementOverridesByRequirementClientId } from 'features/requirementClientOverrides/fetchRequirementClientOverrides';
import { ExceptionRequestsBreadcrumbs } from 'features/requirement/components/ExceptionRequestsBreadcrumbs';
import { OverrideHistory } from 'features/overrideHistory/OverrideHistory';
import { Paper } from 'components/Paper';
import { useTranslation } from 'react-i18next';
import { RequirementOverrideFormContainer } from '../containers/RequirementOverrideForm';
import { ContractorRequirementOverrides } from './ContractorRequirementOverrides';
import { GrantRequirementOverrideFormContainer } from '../containers/GrantRequirementOverrideForm';

type RequirementOverrideParams = {
  safetyProgramRequirementId: string;
  organizationId?: string;
};

export type IRequirementOverrideRequestForm = {
  safetyProgramRequirementId: string;
  comment: string;
};

export type IRequirementOverrideForm = {
  safetyProgramRequirementClientId: string;
  status: ClientOverrideStatus;
  comment: string;
};

export const RequirementOverrides: React.FC = () => {
  const dispatch = useDispatch();
  const path = useLocation().pathname;
  const { organizationId, safetyProgramRequirementId } = useParams<RequirementOverrideParams>();

  const previousPath =
    path.includes('organizations') && organizationId
      ? `/organizations/${organizationId}/safety-program-requirements/${safetyProgramRequirementId}`
      : `/safety-program-requirements/${safetyProgramRequirementId}`;

  const { search } = useSelector((state: RootState) => state.requirements);
  const { isFetching: requirementFetching, requirement } = useSelector((state: RootState) => state.requirement);
  const { organization } = useSelector((state: RootState) => state.organization);
  const { userInfo } = useSelector((state: RootState) => state.userInfo);
  const { requirementOverrides, isFetching } = useSelector((state: RootState) => state.requirementOverrides);

  const { t } = useTranslation();

  const isClient = organization && organization.features.includes(OrganizationFeature.Client) ? true : false;

  useEffect(() => {
    requirement === null && userInfo && dispatch(fetchRequirement(safetyProgramRequirementId));
  }, [dispatch, requirement, safetyProgramRequirementId, userInfo]);

  const { clientRequirementOverrides } = useSelector((state: RootState) => state.clientRequirementOverrides);

  useEffect(() => {
    isClient &&
      requirement &&
      !clientRequirementOverrides &&
      dispatch(fetchClientRequirementOverridesByRequirementClientId(requirement.clientScoreOverrides[0].id));
  }, [dispatch, requirement, clientRequirementOverrides, isClient]);

  useEffect(() => {
    userInfo && dispatch(fetchRequirementOverrides(safetyProgramRequirementId, userInfo.primaryOrganizationId));
  }, [dispatch, safetyProgramRequirementId, userInfo]);

  const overrideRequest = requirementOverrides ? requirementOverrides[0] : undefined;

  const onSubmitRequest = async (values: IRequirementOverrideRequestForm) => {
    userInfo && (await Promise.resolve(dispatch(addRequirementOverride(values, userInfo.primaryOrganizationId))));
  };

  const requirementClientOverride = clientRequirementOverrides ? clientRequirementOverrides[0] : null;

  return (
    <GridContainer>
      {path.includes('organizations') && organizationId && !path.includes('requests') ? (
        <ContractorRequirementBreadcrumbs
          organizationId={organizationId}
          safetyProgramRequirementId={safetyProgramRequirementId}
          isFetching={requirementFetching}
          requirement={requirement}
          links={[
            {
              to: `${previousPath}/exceptions`,
              children: t('safetyPrograms.requirementOverrides.exceptions', 'Exceptions')
            }
          ]}
        />
      ) : path.includes('organizations') && organizationId && path.includes('requests') ? (
        <ExceptionRequestsBreadcrumbs
          organizationId={organizationId}
          safetyProgramRequirementId={safetyProgramRequirementId}
          isFetching={isFetching}
          overrideRequest={overrideRequest}
        />
      ) : (
        <EvaluatorRequirementBreadcrumbs
          organizationId={organizationId}
          safetyProgramRequirementId={safetyProgramRequirementId}
          isFetching={requirementFetching}
          requirement={requirement}
          search={search}
          links={[
            {
              to: `${previousPath}/exceptions`,
              children: t('safetyPrograms.requirementOverrides.exceptions', 'Exceptions')
            }
          ]}
        />
      )}

      <Grid item xs={12}>
        <Paper isLoading={isFetching}>
          {overrideRequest && requirement ? (
            <>
              {isClient ? (
                <RequirementOverrideFormContainer
                  requirementClientOverride={requirementClientOverride}
                  requirement={requirement}
                  overrideRequest={overrideRequest}
                  previousPath={previousPath}
                />
              ) : (
                <ContractorRequirementOverrides
                  requirement={requirement}
                  previousPath={previousPath}
                  overrideRequest={overrideRequest}
                />
              )}
            </>
          ) : (
            <GrantRequirementOverrideFormContainer
              requirement={requirement}
              requirementClientOverride={requirementClientOverride}
              isClient={isClient}
              previousPath={previousPath}
            />
          )}
          {requirementOverrides && requirementOverrides.length === 0 && requirement && !isClient && (
            <RequirementOverrideRequestForm
              requirement={requirement}
              cancelTo={previousPath}
              onSubmit={onSubmitRequest}
            />
          )}
          {requirement && (
            <OverrideHistory requirementId={requirement.id} clientId={isClient ? organizationId : undefined} />
          )}
          <Grid item xs={12}>
            <Box mt={3} p={3}>
              <Button variant="contained" color="primary" component={Link} to={previousPath}>
                {t('safetyPrograms.requirementOverrides.backToProgram', 'Back To Program')}
              </Button>
            </Box>
          </Grid>
        </Paper>
      </Grid>
    </GridContainer>
  );
};
