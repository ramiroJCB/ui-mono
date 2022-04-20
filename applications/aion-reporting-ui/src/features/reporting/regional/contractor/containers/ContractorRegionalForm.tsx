import * as React from 'react';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { BackTitleHeader } from '@pec/aion-ui-components/components/BackTitleHeader';
import { beforeGracePeriod } from 'helpers';
import { ContractorPeriodsContainer } from '../../contractorPeriods/containers/ContractorPeriods';
import { ContractorRegionalTableComponent } from '../components/ContractorRegionalTable';
import { DeepReadonly } from 'utility-types';
import { Dialog } from '@pec/aion-ui-components/components/Dialog';
import { DisplayPeriodStatus, IContractorPeriod } from 'interfaces/contractorPeriod';
import { Field, GenericField, InjectedFormProps, reduxForm } from 'redux-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { History } from 'history';
import { IContractorRegionalForm } from 'interfaces/contractorRegionalForm';
import { IRegionalMetric } from 'interfaces/regionalMetric';
import { required } from '@pec/aion-ui-core/validators';
import { TextField } from '@pec/aion-ui-deprecated/components/TextField';
import { TextFieldProps } from '@material-ui/core/TextField';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

const { PastDue, Waiting, Posted, LatePost } = DisplayPeriodStatus;

const styles = (theme: Theme) => ({
  reason: {
    marginTop: theme.spacing(3)
  },
  emptyPageText: {
    paddingTop: theme.spacing(12),
    color: theme.palette.error.main
  }
});

type OwnProps = {
  history: History;
  organizationId: string;
  clientId: string;
  clientName: string;
  periodId: string;
  selectedPeriod: IContractorPeriod;
  regionalMetrics: DeepReadonly<IRegionalMetric[]> | null;
  isFetching: boolean;
  handleEdit: () => Promise<IContractorPeriod>;
  hasIsEditableSetting: boolean;
  onSubmit: (form: IContractorRegionalForm) => Promise<IContractorPeriod>;
  updateBooleanMetricValue: (metric: IRegionalMetric) => void;
  updateDoubleMetricValue: (metric: IRegionalMetric) => void;
};

type Props = WithStyles<typeof styles> & InjectedFormProps<IContractorRegionalForm, OwnProps> & OwnProps;

const ContractorRegionalFormComponent: React.FC<Props> = ({
  history,
  organizationId,
  clientId,
  clientName,
  periodId,
  regionalMetrics,
  isFetching,
  handleEdit,
  handleSubmit,
  hasIsEditableSetting,
  submitting,
  invalid,
  classes,
  updateBooleanMetricValue,
  updateDoubleMetricValue,
  selectedPeriod,
  initialValues: { status }
}) => {
  const { t } = useTranslation();

  const { endDate, gracePeriodMillis, isEditedAfterDeadline } = selectedPeriod;
  const FieldCustom = Field as new () => GenericField<TextFieldProps>;

  return (
    <GridContainer alignItems="center" justify="space-between">
      <Grid item xs={12}>
        <BackTitleHeader
          to={`/${organizationId}/reporting/regional/clients`}
          linkTitle={t('reporting.common.backToSelectOperator', 'Back to Select an Operator')}
        >
          {t('reporting.regional.contractor.flexTrackReportingFor', {
            clientName,
            defaultValue: 'FlexTrack Reporting for {{clientName}}'
          })}
        </BackTitleHeader>
      </Grid>
      {regionalMetrics && status && regionalMetrics.length > 0 ? (
        <>
          <Grid item>
            <ContractorPeriodsContainer
              history={history}
              organizationId={organizationId}
              clientId={clientId}
              periodId={periodId}
            />
          </Grid>
          <Grid item>
            {hasIsEditableSetting && (status === Posted || status === LatePost) ? (
              <Dialog
                renderTriggerButton={props => (
                  <Button variant="contained" color="primary" {...props}>
                    {t('reporting.regional.contractor.edit', 'Edit')}
                  </Button>
                )}
                onConfirm={handleEdit}
              >
                {({ handleClose, handleConfirm }) => (
                  <React.Fragment>
                    <DialogContent>
                      <DialogContentText>
                        {t(
                          'reporting.regional.contractor.editReportConfirmation',
                          'Are you sure you want to edit this report?'
                        )}
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button color="primary" onClick={handleClose}>
                        {t('reporting.common.cancel', 'Cancel')}
                      </Button>
                      <Button onClick={handleConfirm} color="primary">
                        {t('reporting.regional.contractor.yesEditIt', 'Yes, edit it')}
                      </Button>
                    </DialogActions>
                  </React.Fragment>
                )}
              </Dialog>
            ) : (
              ((status === Posted && beforeGracePeriod(endDate, gracePeriodMillis)) ||
                status === PastDue ||
                status === Waiting) && (
                <Dialog
                  renderTriggerButton={props => (
                    <Button variant="contained" color="primary" disabled={submitting || invalid} {...props}>
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
                            'reporting.regional.contractor.submitReportConfirmation',
                            'Are you sure you want to submit this report?'
                          )}
                        </DialogContentText>
                        {isEditedAfterDeadline && (
                          <FieldCustom
                            className={classes.reason}
                            component={TextField}
                            fullWidth
                            required
                            name="description"
                            label={t('reporting.regional.contractor.reason', 'Reason')}
                            placeholder={t(
                              'reporting.regional.contractor.pleaseEnterReason',
                              'Please enter a reason for editing this report after it was submitted'
                            )}
                            type="text"
                            multiline
                            rows={8}
                            variant="outlined"
                            InputLabelProps={{
                              shrink: true
                            }}
                            validate={required}
                          />
                        )}
                      </DialogContent>
                      <DialogActions>
                        <Button color="primary" onClick={handleClose}>
                          {t('reporting.common.cancel', 'Cancel')}
                        </Button>
                        <Button onClick={handleConfirm} color="primary" disabled={submitting || invalid}>
                          {t('reporting.common.yesSubmitIt', 'Yes, submit it')}
                        </Button>
                      </DialogActions>
                    </React.Fragment>
                  )}
                </Dialog>
              )
            )}
          </Grid>
          <Grid item xs={12}>
            <ContractorRegionalTableComponent
              isFetching={isFetching}
              metrics={regionalMetrics}
              updateBooleanMetricValue={updateBooleanMetricValue}
              updateDoubleMetricValue={updateDoubleMetricValue}
              status={status}
              selectedPeriod={selectedPeriod}
            />
          </Grid>
        </>
      ) : (
        <Grid item xs={12} style={{ textAlign: 'center' }}>
          <Typography variant="h6" className={classes.emptyPageText}>
            {t('reporting.regional.contractor.clientNotSetupFlexTrackReporting', {
              clientName,
              defaultValue: '{{clientName}} has not yet set up FlexTrack reporting.'
            })}
          </Typography>
        </Grid>
      )}
    </GridContainer>
  );
};

export const ContractorRegionalForm = reduxForm<IContractorRegionalForm, OwnProps>({
  form: 'contractorRegionalForm',
  enableReinitialize: true
})(withStyles(styles)(ContractorRegionalFormComponent));
