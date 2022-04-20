import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { Error } from '@pec/aion-ui-components/components/Error';
import { getYears } from 'helpers/groupByYear';
import { IContractorViolationsCount } from 'interfaces/contractorViolationCount';
import { ITableHeader } from '@pec/aion-ui-components/interfaces/tableHeader';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { useTypedSelector } from 'app/reducer';
import { ViolationsTable } from './ViolationsTable';
import { useTranslation } from 'react-i18next';
import { localizeUTCDate } from 'helpers/dates';

const useStyles = makeStyles((theme: Theme) => ({
  gridBody: {
    border: `2px solid ${theme.palette.grey[400]}`,
    padding: 10
  }
}));
interface IViolationsPerYear {
  [x: string]: {
    year: string;
    count: number;
    types: {
      O: number;
      R: number;
      S: number;
      W: number;
    };
  };
}

const DynamicHeaders = (years: IViolationsPerYear) =>
  Object.keys(years)
    .sort((a, b) => Number(b) - Number(a))
    .map((year: string) => {
      return { id: year, label: year, columnWidth: '25%' };
    });

export const ViolationsPerYear: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  const { annualViolationTotals, isFetching, error } = useTypedSelector(state => state.contractorViolationsCount);
  const { import: contractorImports } = useTypedSelector(state => state.contractorImports);

  const options = () => {
    let optionsByYears = getYears();

    annualViolationTotals &&
      annualViolationTotals.forEach((info: IContractorViolationsCount) => {
        optionsByYears[info.year].count += info.count;
        optionsByYears[info.year].types[info.violationType] += info.count;
      });
    return optionsByYears;
  };
  const headers: ITableHeader[] = DynamicHeaders(options());

  return isFetching ? (
    <Loading />
  ) : error ? (
    <Error />
  ) : (
    <Grid xs={12} md={4} container item spacing={1} className={classes.gridBody}>
      <Grid item xs={12}>
        <Typography variant="h6">
          {t('oshaViolations.violationsPerYear.contractorViolationTotals', 'Contractor Violation Totals')}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <ViolationsTable options={options()} headers={headers} />
      </Grid>
      <Grid item xs={12}>
        <Typography>
          {t(
            'oshaViolations.violationsPerYear.theCalendarYear',
            '* The calendar year is incomplete, so this total may change.'
          )}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body2">
          {t('oshaViolations.violationTotals.dataPulled', {
            defaultValue: 'Data Pulled From OSHA {{time}}',
            time: contractorImports && localizeUTCDate(contractorImports[0].runDateTimeUtc, t)
          })}
        </Typography>
      </Grid>
    </Grid>
  );
};
