import * as React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { ClientPeriodsComponent } from 'features/clientPeriods/components/ClientPeriods';
import { ClientRegionalFormFiltersContainer } from '../containers/ClientRegionalFormFilters';
import { ClientRegionalTableComponent } from './ClientRegionalTable';
import { DeepReadonly } from 'utility-types';
import { ExportReportContainer } from '../containers/ExportReport';
import { Form, InjectedFormProps, reduxForm } from 'redux-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { History } from 'history';
import { IClientPeriod } from 'interfaces/clientPeriod';
import { IClientRegionalForm } from 'interfaces/clientRegionalForm';
import { IMetricContractor } from 'interfaces/metricContractor';
import { Link } from '@pec/aion-ui-components/components/Link';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { merge } from '@pec/aion-ui-core/helpers/querystring';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    paddingRight: theme.spacing(2)
  }
}));

type OwnProps = {
  history: History;
  organizationId: string;
  periodId: string;
  contractors: DeepReadonly<IMetricContractor[]>;
  clientPeriods: DeepReadonly<IClientPeriod[]>;
  selectedClientPeriod: IClientPeriod;
  page: number;
  totalCount: number;
  handleChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
  showTotal: boolean;
  search: string;
};

type Props = InjectedFormProps<IClientRegionalForm, OwnProps> & OwnProps & I18nextProps;

const ClientRegionalFormComponent: React.FC<Props> = props => {
  const classes = useStyles();
  const handleMenuItemClick = (periodId: string) => () => {
    const { organizationId, history, search } = props;
    const queryString = merge(search, {
      page: '1'
    });

    history.push(`/${organizationId}/reporting/regional/periods/${periodId}${queryString}`);
  };

  const {
    organizationId,
    contractors,
    clientPeriods,
    submitting,
    pristine,
    invalid,
    handleSubmit,
    selectedClientPeriod,
    handleChangePage,
    page,
    totalCount,
    showTotal,
    t
  } = props;

  return (
    <Form onSubmit={handleSubmit}>
      <GridContainer justify="space-between">
        <Grid item xs={12} sm={6}>
          <Typography variant="h5">{t('reporting.regional.client.flexTrackReport', 'FlexTrack Report')}</Typography>
        </Grid>
        <Grid item xs={12} sm={6} style={{ textAlign: 'right' }}>
          <Button
            variant="contained"
            color="secondary"
            component={Link}
            to={`/${organizationId}/reporting/regional/settings`}
          >
            {t('reporting.regional.client.manageFlexTrackSettings', 'Manage FlexTrack Settings')}
          </Button>
        </Grid>
        <Grid item>
          <Grid container>
            <Grid item className={classes.button}>
              <ClientPeriodsComponent
                selectedClientPeriod={selectedClientPeriod}
                clientPeriods={clientPeriods}
                handleMenuItemClick={handleMenuItemClick}
              />
            </Grid>
            <Grid item>
              <ClientRegionalFormFiltersContainer />
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={6} lg={4} xl={3}>
          <Grid container justify="flex-end">
            <Grid item className={classes.button} xs={4}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                disabled={submitting || pristine || invalid}
              >
                {t('reporting.common.apply', 'Apply')}
              </Button>
            </Grid>
            <Grid item xs={8} md={6}>
              <ExportReportContainer hasTableContents={contractors.length > 0} />
            </Grid>
          </Grid>
        </Grid>
      </GridContainer>
      <ClientRegionalTableComponent
        contractors={contractors}
        handleChangePage={handleChangePage}
        page={page}
        totalCount={totalCount}
        showTotal={showTotal}
      />
    </Form>
  );
};

export const ClientRegionalForm = reduxForm<{}, OwnProps>({
  form: 'clientRegionalForm',
  enableReinitialize: true
})(withTranslation()(ClientRegionalFormComponent));
