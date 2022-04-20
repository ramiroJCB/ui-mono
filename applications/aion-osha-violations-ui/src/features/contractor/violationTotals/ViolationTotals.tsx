import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Error } from '@pec/aion-ui-components/components/Error';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { groupByYear } from 'helpers/groupByYear';
import { ITableHeader } from '@pec/aion-ui-components/interfaces/tableHeader';
import { Link } from '@pec/aion-ui-components/components/Link';
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { useTypedSelector } from 'app/reducer';
import { ViolationsGrid } from './violationsGrid/ViolationsGrid';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useTranslation, Trans } from 'react-i18next';
import { localizeUTCDate } from 'helpers/dates';

const useStyles = makeStyles(() => ({
  root: {
    minHeight: '100%'
  },
  subTitle: {
    fontWeight: 600
  }
}));

export const ViolationTotals: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  const { import: contractorImports, isFetching: importIsFetching, error: importError } = useTypedSelector(
    state => state.contractorImports
  );
  const { annualViolationTotals, isFetching: contractorIsFetching, error: contractorError } = useTypedSelector(
    state => state.contractorViolationsCount
  );

  const isFetching = importIsFetching || contractorIsFetching;
  const error = importError || contractorError;

  const getHeaders = (): ITableHeader[] => [
    { id: 'year', label: t('oshaViolations.violationTotals.year', 'YEAR'), columnWidth: '50%' },
    { id: 'count', label: t('oshaViolations.violationTotals.total', 'TOTAL'), columnWidth: '50%' }
  ];
  const AnnuallyGroupedViolations = groupByYear(annualViolationTotals ?? []);

  return (
    <Paper className={classes.root}>
      <GridContainer spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">
            {t('oshaViolations.violationTotals.violationTotals', 'Violation Totals')}
          </Typography>
        </Grid>
        <Grid container item spacing={4} justify="center">
          <Grid item xs={12} md={4}>
            {isFetching ? (
              <Grid container item alignItems="center" justify="center">
                <CircularProgress />
              </Grid>
            ) : error ? (
              <Error />
            ) : (
              <ViolationsGrid options={AnnuallyGroupedViolations} headers={getHeaders()} />
            )}
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="subtitle1" color="textSecondary" className={classes.subTitle}>
              {t('oshaViolations.violationTotals.haveConcernsOrQuestions', 'Have concerns or questions?')}
            </Typography>
            <Typography color="textSecondary" paragraph>
              {t(
                'oshaViolations.violationTotals.establishmentsWhoBelieve',
                'Establishments who believe a particular OSHA Violation in Compliance Pro is inaccurate, incomplete or out-of-date are encouraged to contact Veriforce Contractor Management Support at (866) 647-2338.'
              )}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              <Trans i18nKey="oshaViolations.violationTotals.email">
                Email: <Link href={'mailto:safetyverifications@veriforce.com'}>safetyverifications@veriforce.com</Link>
              </Trans>
            </Typography>
          </Grid>
        </Grid>

        <Grid container justify="space-between">
          <Grid item xs={12} md={7}>
            <Typography>
              {t(
                'oshaViolations.violationTotals.theCalendarYearIsIncomplete',
                '* The calendar year is incomplete, so this total may change.'
              )}
            </Typography>
          </Grid>
          <Grid xs={12} md={4} item>
            {isFetching ? (
              <CircularProgress size={20} />
            ) : error ? (
              <Error />
            ) : (
              <Typography variant="body2">
                {t('oshaViolations.violationTotals.dataPulled', {
                  defaultValue: 'Data Pulled From OSHA {{time}}',
                  time: contractorImports && localizeUTCDate(contractorImports[0].runDateTimeUtc, t)
                })}
              </Typography>
            )}
          </Grid>
        </Grid>
      </GridContainer>
    </Paper>
  );
};
