import * as React from 'react';
import { DeepReadonly } from 'ts-essentials';
import { IContractorRequirement } from 'interfaces/requirement';
import { Grid, Typography, Box, Divider, Button } from '@material-ui/core';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import { gracePeriodExpired } from 'helpers/gracePeriodExpired';
import { SafetyProgramRequirementStatus } from '@pec/aion-ui-core/interfaces/safetyProgramRequirementStatus';
import { sortGracePeriodEffectiveDates } from 'helpers/sortGracePeriodEffectiveDates';
import { useLocation } from 'react-router-dom';
import { WrappingLink } from '@pec/aion-ui-components/components/WrappingLink';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'combineReducers';
import { OrganizationFeature } from '@pec/aion-ui-core/interfaces/organization';
import { fetchClientRequirementOverridesIfNeeded } from 'features/requirementClientOverrides/fetchRequirementClientOverrides';
import { localizeDate } from '@pec/aion-ui-i18next/helpers/localize';
import { useTranslation } from 'react-i18next';
import { getClientOverrideStatusDisplayValue } from 'helpers/getStatusDisplayValues';

type Props = {
  requirement: DeepReadonly<IContractorRequirement>;
};

const DETAIL_LIMIT = 3;
const EXPIRATION_DAYS_LIMIT = 14;
const ONE_DAY_MS = 86400000;

const { Accepted, AcceptedNotApplicable } = SafetyProgramRequirementStatus;

const getDifferenceInDays = (date1: Date, date2: Date) => Math.abs(date2.getTime() - date1.getTime()) / ONE_DAY_MS;

const useStyles = makeStyles({
  truncateFade: {
    position: 'relative',
    height: '6.5em',
    overflow: 'hidden',
    '&::after': {
      content: '""',
      height: '3em',
      width: '100%',
      position: 'absolute',
      bottom: 0,
      right: 0,
      background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 100%)'
    }
  },
  horizontalLine: {
    '& hr': {
      width: '100%'
    },
    alignSelf: 'center'
  },
  truncate: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  infoIcon: {
    display: 'flex',
    '& svg': {
      marginLeft: '2px'
    }
  },
  noMaxWidth: {
    maxWidth: 'none'
  }
});

export const GracePeriodDetails: React.FC<Props> = ({ requirement }) => {
  const [truncate, setTruncate] = React.useState(true);
  const { organization } = useSelector((state: RootState) => state.organization);
  const { clientRequirementOverrides } = useSelector((state: RootState) => state.clientRequirementOverrides);

  const { clientGracePeriods } = requirement;
  const programGracePeriod = requirement.safetyProgram.gracePeriodExpirationDateUtc;
  const effectiveGracePeriods = sortGracePeriodEffectiveDates(
    clientGracePeriods.filter(({ effectiveGracePeriod }) => effectiveGracePeriod || programGracePeriod),
    'asc'
  );
  const { status } = requirement;
  const acceptedStatuses = [Accepted, AcceptedNotApplicable];
  const today = new Date();
  const showErrorOnExpired = !acceptedStatuses.includes(status);
  const classes = useStyles();
  const path = useLocation().pathname;

  const dispatch = useDispatch();

  const isClient = organization && organization.features.includes(OrganizationFeature.Client) ? true : false;

  React.useEffect(() => {
    if (isClient) {
      requirement && dispatch(fetchClientRequirementOverridesIfNeeded(requirement.clientScoreOverrides[0].id));
    }
  }, [dispatch, requirement, isClient]);

  const requirementClientOverride = clientRequirementOverrides ? clientRequirementOverrides[0] : null;

  const { t } = useTranslation();

  return (
    <Box pt={2} pb={3}>
      <GridContainer className={truncate && effectiveGracePeriods.length > DETAIL_LIMIT ? classes.truncateFade : ''}>
        <Grid item xs={3} style={{ padding: 0 }}>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom className={classes.infoIcon}>
            {t('safetyPrograms.requirement.gracePeriod', 'GRACE PERIOD')}
            <Tooltip
              title={
                <Typography variant="caption">
                  {t(
                    'safetyPrograms.requirement.gracePeriodsAllowContractors',
                    'Grace periods allow contractors time to provide their program without the program affecting their score for a client. If there is a grace period in effect for a client, its end date will be shown below. Hovering over the date for a client will show the contributing factors leading to that grace period. Program status is not affected by a grace period.'
                  )}
                </Typography>
              }
              placement="bottom-start"
            >
              <InfoOutlinedIcon fontSize="small" />
            </Tooltip>
          </Typography>

          {effectiveGracePeriods.length > 0
            ? effectiveGracePeriods.map(
                ({ id, clientName, effectiveGracePeriod, gracePeriodExpirationDateForClient }) => {
                  const clientGracePeriodEnd =
                    gracePeriodExpirationDateForClient && localizeDate(gracePeriodExpirationDateForClient, t);
                  const clientGracePeriodExpired = gracePeriodExpired(clientGracePeriodEnd);
                  const effectiveGracePeriodEnd = effectiveGracePeriod && localizeDate(effectiveGracePeriod, t);
                  const effectiveGracePeriodExpired = gracePeriodExpired(effectiveGracePeriod);
                  const programGracePeriodEnd = programGracePeriod && localizeDate(programGracePeriod, t);
                  const programGracePeriodExpired = gracePeriodExpired(programGracePeriod);
                  const daysExpired =
                    effectiveGracePeriodExpired && effectiveGracePeriod
                      ? getDifferenceInDays(today, new Date(effectiveGracePeriod))
                      : 0;

                  return (
                    <Box display="flex" justifyItems="space-evenly" pt={1} key={id}>
                      <Box flexGrow={1} className={classes.truncate} title={clientName}>
                        {clientName}
                      </Box>
                      <Tooltip
                        classes={{ tooltip: classes.noMaxWidth }}
                        title={
                          <Box width="auto">
                            <Typography variant="caption">
                              {t('safetyPrograms.requirement.clientGracePeriodEndDate', {
                                periodEnd: clientGracePeriodEnd || t('safetyPrograms.common.NA', 'N/A'),
                                periodExpired: clientGracePeriodExpired
                                  ? t('safetyPrograms.requirement.expired', '(Expired)')
                                  : '',
                                defaultValue: 'Client Grace Period End Date: {{periodEnd}} {{periodExpired}}'
                              })}
                            </Typography>
                            <br />
                            <Typography variant="caption">
                              {t('safetyPrograms.requirement.programGracePeriodEndDate', {
                                periodEnd: programGracePeriodEnd || t('safetyPrograms.common.NA', 'N/A'),
                                periodExpired: programGracePeriodExpired
                                  ? t('safetyPrograms.requirement.expired', '(Expired)')
                                  : '',
                                defaultValue: 'Program Grace Period End Date: {{periodEnd}} {{periodExpired}}'
                              })}
                            </Typography>
                          </Box>
                        }
                      >
                        <Box display="flex">
                          <Box ml={1} mr={effectiveGracePeriodExpired ? 1 : 7.5}>
                            {effectiveGracePeriodEnd}
                          </Box>
                          {effectiveGracePeriodExpired && (
                            <Typography
                              display="inline"
                              color={showErrorOnExpired && daysExpired < EXPIRATION_DAYS_LIMIT ? 'error' : undefined}
                              variant="caption"
                            >
                              {t('safetyPrograms.requirement.expired', '(Expired)')}
                            </Typography>
                          )}
                        </Box>
                      </Tooltip>
                    </Box>
                  );
                }
              )
            : t('safetyPrograms.common.none', 'None')}
        </Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={6} style={{ padding: 0 }}>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom className={classes.infoIcon}>
            {t('safetyPrograms.requirement.exceptionStatus', 'Exception Status')}
            <Tooltip
              title={
                <Typography variant="caption">
                  {t(
                    'safetyPrograms.requirement.exceptionStatusWarning',
                    "Exceptions can be put in place by clients so that a program will not impact a contractor's compliance for that client. The program status is not affected by an exception."
                  )}
                </Typography>
              }
              placement="bottom-start"
            >
              <InfoOutlinedIcon fontSize="small" />
            </Tooltip>
          </Typography>
          {requirementClientOverride && isClient ? (
            <WrappingLink style={{ cursor: 'pointer' }} to={`${path}/exceptions`}>
              {getClientOverrideStatusDisplayValue(requirementClientOverride.status, t)}
            </WrappingLink>
          ) : (
            requirement.clientScoreOverrides.map((x, i) => (
              <Box display="flex" justifyItems="space-evenly" pt={1} key={x.id}>
                <Box className={classes.truncate}>
                  {requirement.clients[i] && <Typography variant="caption">{requirement.clients[i].name}</Typography>}
                </Box>
                <Box className={classes.truncate}>
                  <WrappingLink style={{ cursor: 'pointer', marginLeft: 10 }} to={`${path}/exceptions`}>
                    {getClientOverrideStatusDisplayValue(x.overrideStatus, t)}
                  </WrappingLink>
                </Box>
              </Box>
            ))
          )}
        </Grid>
      </GridContainer>
      {effectiveGracePeriods.length > DETAIL_LIMIT && (
        <Box display="flex" pb={4}>
          <Box display="flex" flexGrow="1" className={classes.horizontalLine}>
            <Divider orientation="horizontal" />
          </Box>
          <Box justifyContent="center">
            <Button color="primary" onClick={() => setTruncate(!truncate)}>
              {truncate
                ? t('safetyPrograms.requirement.seeAll', 'See All')
                : t('safetyPrograms.requirement.collapse', 'Collapse')}
            </Button>
          </Box>
          <Box display="flex" flexGrow="1" className={classes.horizontalLine}>
            <Divider orientation="horizontal" />
          </Box>
        </Box>
      )}
    </Box>
  );
};
