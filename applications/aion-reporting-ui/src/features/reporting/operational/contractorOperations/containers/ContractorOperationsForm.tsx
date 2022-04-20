import * as React from 'react';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { BackTitleHeader } from '@pec/aion-ui-components/components/BackTitleHeader';
import { ContractorOperationsTableComponent } from '../components/ContractorOperationsTable';
import { ContractorPeriodsContainer } from '../../contractorPeriods/containers/ContractorPeriods';
import { DeepReadonly } from 'utility-types';
import { Dialog } from '@pec/aion-ui-components/components/Dialog';
import { DisplayPeriodStatus, IContractorPeriod } from 'interfaces/contractorPeriod';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { History } from 'history';
import { IContractorOperationsForm } from 'interfaces/contractorOperationsForm';
import { IMappedOperationalMetric } from 'interfaces/mappedOperationalMetric';
import { InjectedFormProps, reduxForm } from 'redux-form';
import { IOperationalMetric } from 'interfaces/operationalMetric';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { useTranslation } from 'react-i18next';

const { LatePost } = DisplayPeriodStatus;

type OwnProps = {
  history: History;
  organizationId: string;
  clientId: string;
  clientName: string;
  periodId: string;
  operationalMetrics: DeepReadonly<IOperationalMetric[]> | null;
  mappedMetrics: IMappedOperationalMetric[];
  isFetching: boolean;
  onSubmit: (form: IContractorOperationsForm) => Promise<IContractorPeriod>;
  onSubmitMetricValue: (metric: IMappedOperationalMetric) => void;
};

type Props = InjectedFormProps<IContractorOperationsForm, OwnProps> & OwnProps;

const ContractorOperationsFormComponent: React.FC<Props> = ({
  history,
  organizationId,
  clientId,
  clientName,
  periodId,
  operationalMetrics,
  mappedMetrics,
  isFetching,
  handleSubmit,
  onSubmitMetricValue,
  initialValues: { status }
}) => {
  const { t } = useTranslation();

  return (
    <GridContainer alignItems="center" justify="space-between">
      <Grid item xs={12}>
        <BackTitleHeader
          to={`/${organizationId}/reporting/operations/clients`}
          linkTitle={t('reporting.common.backToSelectOperator', 'Back to Select an Operator')}
        >
          {t('reporting.operational.contractorOperations.operationsReportingFor', {
            clientName,
            defaultValue: 'Operations Reporting for {{clientName}}'
          })}
        </BackTitleHeader>
      </Grid>
      <Grid item>
        <ContractorPeriodsContainer
          history={history}
          organizationId={organizationId}
          clientId={clientId}
          periodId={periodId}
        />
      </Grid>
      {status !== LatePost && (
        <Grid item>
          <Dialog
            renderTriggerButton={props => (
              <Button variant="contained" color="primary" {...props}>
                {t('reporting.common.submit', 'Submit')}
              </Button>
            )}
            onConfirm={handleSubmit}
          >
            {({ handleClose, handleConfirm }) => (
              <React.Fragment>
                <DialogContent>
                  <DialogContentText>
                    {t(
                      'reporting.operational.contractorOperations.submitOperationsReportConfirmation',
                      'Are you sure you want to submit this Operations Report?'
                    )}
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button color="primary" onClick={handleClose}>
                    {t('reporting.common.cancel', 'Cancel')}
                  </Button>
                  <Button onClick={handleConfirm} color="primary">
                    {t('reporting.common.yesSubmitIt', 'Yes, submit it')}
                  </Button>
                </DialogActions>
              </React.Fragment>
            )}
          </Dialog>
        </Grid>
      )}
      {operationalMetrics && status && !isFetching ? (
        operationalMetrics.length > 0 ? (
          <Grid item xs={12}>
            <ContractorOperationsTableComponent
              mappedMetrics={mappedMetrics}
              onSubmit={onSubmitMetricValue}
              status={status}
            />
          </Grid>
        ) : (
          <Grid item xs={12} style={{ textAlign: 'center' }}>
            <Typography variant="h5">
              {t('reporting.operational.contractorOperations.clientNotSetupOperationsReporting', {
                clientName,
                defaultValue: '{{clientName}} has not yet set up Operations reporting.'
              })}
            </Typography>
          </Grid>
        )
      ) : (
        <Grid item xs={12}>
          <Loading />
        </Grid>
      )}
    </GridContainer>
  );
};

export const ContractorOperationsForm = reduxForm<IContractorOperationsForm, OwnProps>({
  form: 'contractorOperationsForm',
  enableReinitialize: true
})(ContractorOperationsFormComponent);
