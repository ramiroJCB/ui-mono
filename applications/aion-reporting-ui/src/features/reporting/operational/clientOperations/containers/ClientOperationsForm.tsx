import * as React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { ClientOperationsFormFiltersContainer } from './ClientOperationsFormFilters';
import { ClientOperationsTableComponent } from '../components/ClientOperationsTable';
import { ClientPeriodsComponent } from 'features/clientPeriods/components/ClientPeriods';
import { DeepReadonly } from 'utility-types';
import { Form, InjectedFormProps, reduxForm } from 'redux-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { History } from 'history';
import { IClientOperationsForm } from 'interfaces/clientOperationsForm';
import { IClientPeriod } from 'interfaces/clientPeriod';
import { IMetricContractor } from 'interfaces/metricContractor';
import { merge } from '@pec/aion-ui-core/helpers/querystring';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';

type OwnProps = {
  history: History;
  organizationId: string;
  periodId: string;
  contractors: DeepReadonly<IMetricContractor[]>;
  clientPeriods: DeepReadonly<IClientPeriod[]>;
  page: number;
  totalCount: number;
  handleChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
  search: string;
};

type Props = InjectedFormProps<IClientOperationsForm, OwnProps> & OwnProps & I18nextProps;

class ClientOperationsFormComponent extends React.Component<Props> {
  handleMenuItemClick = (periodId: string) => () => {
    const { organizationId, history, search } = this.props;
    const queryString = merge(search, {
      page: '1'
    });

    history.push(`/${organizationId}/reporting/operations/periods/${periodId}${queryString}`);
  };

  render() {
    const {
      periodId,
      contractors,
      clientPeriods,
      submitting,
      pristine,
      invalid,
      handleSubmit,
      handleChangePage,
      page,
      totalCount,
      t
    } = this.props;
    const selectedClientPeriod = clientPeriods && clientPeriods.find(p => p.id === periodId);

    return (
      <Form onSubmit={handleSubmit}>
        <GridContainer alignItems="flex-start" justify="space-between">
          <Grid item xs={12}>
            <Typography variant="h5">
              {t('reporting.operational.clientOperations.operationsReport', 'Operations Report')}
            </Typography>
          </Grid>
          <Grid item>
            {selectedClientPeriod && (
              <ClientPeriodsComponent
                selectedClientPeriod={selectedClientPeriod}
                clientPeriods={clientPeriods}
                handleMenuItemClick={this.handleMenuItemClick}
              />
            )}
          </Grid>
          <ClientOperationsFormFiltersContainer />
          <Grid item>
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
        </GridContainer>
        <ClientOperationsTableComponent
          contractors={contractors}
          handleChangePage={handleChangePage}
          page={page}
          totalCount={totalCount}
        />
      </Form>
    );
  }
}

export const ClientOperationsForm = reduxForm<{}, OwnProps>({
  form: 'clientOperationsForm',
  enableReinitialize: true
})(withTranslation()(ClientOperationsFormComponent));
