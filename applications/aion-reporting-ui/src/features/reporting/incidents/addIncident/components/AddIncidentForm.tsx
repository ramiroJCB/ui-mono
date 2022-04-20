import * as React from 'react';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { AxiosError } from 'axios';
import { BackTitleHeader } from '@pec/aion-ui-components/components/BackTitleHeader';
import { DateField } from '@pec/aion-ui-deprecated/components/DateField';
import { Dialog } from '@pec/aion-ui-components/components/Dialog';
import { Field, Form, GenericField, InjectedFormProps, reduxForm } from 'redux-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IIncident } from 'interfaces/incident';
import { IIncidentCategory } from 'interfaces/incidentCategory';
import { IIncidentRegion } from 'interfaces/incidentRegion';
import { IIncidentRootCause } from 'interfaces/incidentRootCause';
import { IIncidentType } from 'interfaces/incidentType';
import { IIncidentWorkGroup } from 'interfaces/incidentWorkGroup';
import { IncidentRadioField, OwnProps as RadioFieldProps } from './IncidentRadioField';
import { Link } from '@pec/aion-ui-components/components/Link';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { Prompt } from '@pec/aion-ui-components/components/Prompt';
import { required } from '@pec/aion-ui-core/validators';
import { TextField } from '@pec/aion-ui-deprecated/components/TextField';
import { TextFieldProps } from '@material-ui/core/TextField';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

const styles = (theme: Theme) => ({
  triggerButton: {
    color: theme.palette.secondary.contrastText
  }
});

type FormProps = {
  requestError?: AxiosError | null;
  incidentCategories: IIncidentCategory[];
  incidentRootCauses: IIncidentRootCause[];
  incidentRegions: IIncidentRegion[];
  incidentWorkGroups: IIncidentWorkGroup[];
  incidentTypes: IIncidentType[];
  incident?: IIncident;
  organizationId: string;
  clientName: string;
};

type Props = InjectedFormProps<IIncident, FormProps> & WithStyles<typeof styles> & FormProps;

const AddIncidentForm: React.FC<Props> = ({
  classes,
  invalid,
  pristine,
  submitting,
  anyTouched,
  clientName,
  handleSubmit,
  organizationId,
  incidentCategories,
  incidentRootCauses,
  incidentRegions,
  incidentWorkGroups,
  incidentTypes
}) => {
  const { t } = useTranslation();

  const FieldCustom = Field as new () => GenericField<TextFieldProps>;
  const RadioFieldCustom = Field as new () => GenericField<RadioFieldProps>;

  return (
    <GridContainer>
      <Grid item xs={12}>
        <BackTitleHeader
          to={`/${organizationId}/reporting/incidents/add`}
          linkTitle={t('reporting.common.backToSelectOperator', 'Back to Select an Operator')}
        >
          {t('reporting.incidents.addIncident.reportLeadingIndicator', {
            clientName,
            defaultValue: 'Report a Leading Indicator to {{clientName}}'
          })}
        </BackTitleHeader>
      </Grid>
      <Grid item xs={12}>
        <Paper>
          <Prompt
            when={anyTouched && !submitting}
            message={t('reporting.incidents.addIncident.leaveConfirmation', 'Are you sure you want to leave?')}
          />
          {submitting ? (
            <Loading />
          ) : (
            <Form onSubmit={handleSubmit}>
              <GridContainer>
                <Grid item sm={6}>
                  <GridContainer justify="space-between">
                    <Grid item xs={12}>
                      <Typography variant="h6" component="h2">
                        {t('reporting.common.behaviorCategory', 'Behavior Category')}
                      </Typography>
                      <RadioFieldCustom
                        component={IncidentRadioField}
                        options={incidentTypes}
                        name="incidentTypeId"
                        validate={required}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h6" component="h2">
                        {t('reporting.common.classification', 'Classification')}
                      </Typography>
                      <RadioFieldCustom
                        component={IncidentRadioField}
                        options={incidentCategories}
                        name="incidentCategoryId"
                        validate={required}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h6" component="h2">
                        {t('reporting.common.region', 'Region')}
                      </Typography>
                      <RadioFieldCustom
                        component={IncidentRadioField}
                        options={incidentRegions}
                        name="incidentRegionId"
                        validate={required}
                      />
                    </Grid>
                    {incidentRootCauses.length > 0 && (
                      <Grid item xs={12}>
                        <Typography variant="h6" component="h2">
                          {t('reporting.common.rootCause', 'Root Cause')}
                        </Typography>
                        <RadioFieldCustom
                          component={IncidentRadioField}
                          options={incidentRootCauses}
                          name="incidentRootCauseId"
                          validate={required}
                        />
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <Typography variant="h6" component="h2">
                        {t('reporting.common.workGroup', 'Work Group')}
                      </Typography>
                      <RadioFieldCustom
                        component={IncidentRadioField}
                        options={incidentWorkGroups}
                        name="incidentWorkGroupId"
                        validate={required}
                      />
                    </Grid>
                  </GridContainer>
                </Grid>
                <Grid item sm={6}>
                  <GridContainer justify="space-between">
                    <Grid item xs={12}>
                      <DateField
                        name="occurredOnDateUtc"
                        label={t('reporting.incidents.addIncident.occurredOn', 'Occurred On')}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FieldCustom
                        component={TextField}
                        fullWidth
                        required
                        name="details"
                        label={t('reporting.common.activityObserved', 'Activity Observed')}
                        placeholder={t(
                          'reporting.incidents.addIncident.describeTheIncident',
                          'Describe the incident...'
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
                    </Grid>
                    <Grid item xs={12}>
                      <GridContainer justify="space-between" spacing={0}>
                        <Grid item>
                          <Dialog
                            renderTriggerButton={props => (
                              <Button
                                fullWidth
                                className={classes.triggerButton}
                                variant="contained"
                                color="secondary"
                                disabled={pristine || submitting || invalid}
                                {...props}
                              >
                                {t('reporting.incidents.addIncident.reportIndicator', 'Report Indicator')}
                              </Button>
                            )}
                            onConfirm={handleSubmit}
                          >
                            {({ handleClose, handleConfirm }) => (
                              <React.Fragment>
                                <DialogContent>
                                  <DialogContentText>
                                    {t(
                                      'reporting.incidents.addIncident.reportIndicatorConfirmation',
                                      'Are you sure you want to report this indicator?'
                                    )}
                                  </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                  <Button color="primary" onClick={handleClose}>
                                    {t('reporting.common.cancel', 'Cancel')}
                                  </Button>
                                  <Button variant="contained" color="secondary" type="submit" onClick={handleConfirm}>
                                    {t('reporting.incidents.addIncident.yesReportIt', 'Yes, Report it')}
                                  </Button>
                                </DialogActions>
                              </React.Fragment>
                            )}
                          </Dialog>
                        </Grid>
                        <Grid item>
                          <Button variant="outlined" component={Link} to={`/${organizationId}/reporting/incidents/`}>
                            {t('reporting.common.cancel', 'Cancel')}
                          </Button>
                        </Grid>
                      </GridContainer>
                    </Grid>
                  </GridContainer>
                </Grid>
              </GridContainer>
            </Form>
          )}
        </Paper>
      </Grid>
    </GridContainer>
  );
};

export const AddIncidentFormComponent = reduxForm<IIncident, FormProps>({
  form: 'incidentForm'
})(withStyles(styles)(AddIncidentForm));
