import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { ClientAutocomplete } from './clientAutocomplete/ClientAutocomplete';
import { ClientTable } from './clientTable/ClientTable';
import { fetchClientOrganizations } from './clientOrganizations/slice';
import { fetchClientViolations } from 'features/client/clientViolations/slice';
import { fetchContractorViolationsCount } from 'features/contractor/contractorViolationsCount/slice';
import { fetchContractorImports } from 'features/contractor/contractorImports/slice';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { Typography } from '@material-ui/core';
import { useAppDispatch, useTypedSelector } from 'app/reducer';
import { useHistory } from 'react-router';
import { ViolationsPerYear } from './violationsPerYear/ViolationsPerYear';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: `${theme.spacing(3)}px ${theme.spacing(2)}px`
  }
}));

export const ClientDetails: React.FC = () => {
  const { organizations, isFetching: isOrganizationFetching, total, error } = useTypedSelector(
    state => state.clientOrganizations
  );

  const { isFetching: violationsCountIsFetching } = useTypedSelector(state => state.contractorViolationsCount);
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const isFetching = violationsCountIsFetching || isOrganizationFetching;
  const { t } = useTranslation();

  const {
    location: { search }
  } = useHistory();

  const { pageSize, page, optionId, searchTerm, order = 'desc', orderBy = 'closedDate' } = parse(search) as {
    page: string;
    pageSize: string;
    optionId: string;
    searchTerm: string;
    order: string;
    orderBy: string;
  };

  React.useEffect(() => {
    if (searchTerm) dispatch(fetchClientOrganizations(searchTerm));
  }, [dispatch, searchTerm]);

  React.useEffect(() => {
    if (optionId) {
      dispatch(fetchClientViolations({ page, pageSize, optionId, order, orderBy }));
      dispatch(fetchContractorImports({ orderBy: 'runDateTimeUtc', order: 'desc' }));
      dispatch(fetchContractorViolationsCount(optionId));
    }
  }, [dispatch, page, pageSize, optionId, order, orderBy]);

  return (
    <Paper className={classes.root}>
      <GridContainer direction="column" style={{ padding: 0 }}>
        <Grid item xs={12}>
          <Typography variant="h5">{t('oshaViolations.oshaViolations', 'OSHA Violations')}</Typography>
        </Grid>
        <Grid item xs={12} style={{ paddingBottom: 0 }}>
          <Typography>
            {t(
              'oshaViolations.clientDetails.searchForAContractor',
              'Search for a contractor to view their OSHA violations.'
            )}
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <ClientAutocomplete
            options={organizations?.map(({ id, name, companyNumber }) => ({
              value: id,
              label: name + (companyNumber ? ` (${companyNumber})` : '')
            }))}
            defaultValue={optionId && searchTerm ? { value: optionId, label: searchTerm } : undefined}
            loading={isFetching}
            hasError={error}
            total={total}
            label={t('oshaViolations.clientDetails.searchContractors', 'Search Contractors')}
          />
        </Grid>
        {optionId && (
          <Grid item xs={12}>
            <ViolationsPerYear />
          </Grid>
        )}
        {optionId && (
          <Grid>
            <ClientTable />
          </Grid>
        )}
      </GridContainer>
    </Paper>
  );
};
