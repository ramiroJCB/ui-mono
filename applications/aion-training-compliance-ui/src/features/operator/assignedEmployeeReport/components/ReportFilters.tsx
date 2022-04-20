import * as React from 'react';
import amber from '@material-ui/core/colors/amber';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { AutocompleteClientAssignedEmployeesContainer } from 'features/operator/autocompleteClientAssignedEmployees/containers/AutocompleteClientAssignedEmployees';
import { AutocompleteContractorsContainer } from 'features/operator/autocompleteContractors/containers/AutocompleteContractors';
import { AutocompleteJobTypesContainer } from 'features/operator/autocompleteJobTypes/containers/AutocompleteJobTypes';
import { AutocompleteTrainingsContainer } from 'features/operator/autocompleteTrainings/containers/AutocompleteTrainings';
import { AutocompleteWorkGroupsContainer } from 'features/operator/autocompleteWorkGroups/containers/AutocompleteWorkGroups';
import { Field, Form } from 'react-final-form';
import { FormApi } from 'final-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IAssignedEmployeeReportFilters } from 'interfaces/assignedEmployeeReportFilters';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { SelectField } from '@pec/aion-ui-form/components/Autocomplete/SelectField';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

export const getRequirementStatuses = (t: TFunction) => {
  return [
    {
      value: 'Compliant',
      label: t('trainingCompliance.common.compliant', 'Compliant')
    },
    {
      value: 'Noncompliant',
      label: t('trainingCompliance.common.nonCompliant', 'Noncompliant')
    }
  ];
};

type Props = {
  initialValues: IAssignedEmployeeReportFilters;
  onSubmit: (values: IAssignedEmployeeReportFilters, form: FormApi<any>) => void;
};

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    padding: theme.spacing(2)
  }
}));

export const ReportFilters: React.FC<Props> = ({ onSubmit, initialValues }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const clear = (form: FormApi<IAssignedEmployeeReportFilters>) => () => {
    form.reset({});
  };

  return (
    <Form<IAssignedEmployeeReportFilters> initialValues={initialValues} onSubmit={onSubmit}>
      {({ form, handleSubmit }) => (
        <form onSubmit={handleSubmit} noValidate>
          <GridContainer>
            <Grid item xs={12}>
              <AutocompleteClientAssignedEmployeesContainer
                label={t('trainingCompliance.operator.assignedEmployeeReport.employees', 'Employees')}
              />
            </Grid>
            <Grid item xs={12}>
              <AutocompleteContractorsContainer label={t('trainingCompliance.common.contractors', 'Contractors')} />
            </Grid>
            <Grid item xs={12}>
              <AutocompleteWorkGroupsContainer label={t('trainingCompliance.common.workGroups', 'Work Groups')} />
            </Grid>
            <Grid item xs={12}>
              <AutocompleteJobTypesContainer label={t('trainingCompliance.common.jobTypes', 'Job Types')} />
            </Grid>
            <Grid item xs={12}>
              <AutocompleteTrainingsContainer
                label={t('trainingCompliance.common.trainingRequirements', 'Training Requirements')}
              />
            </Grid>
            <Grid item xs={12}>
              <Field name="status">
                {props => (
                  <SelectField
                    id="status"
                    label={t('trainingCompliance.common.requirementStatus', 'Requirement Status')}
                    menuPosition="fixed"
                    maxMenuHeight={200}
                    isClearable
                    variant="standard"
                    options={getRequirementStatuses(t)}
                    {...props}
                  />
                )}
              </Field>
            </Grid>
            <Grid item xs={12} style={{ padding: 0 }}>
              <GridContainer>
                <Grid item xs={12} sm={6}>
                  <Button variant="contained" color="primary" type="submit" className={classes.button} fullWidth>
                    {t('trainingCompliance.operator.assignedEmployeeReport.apply', 'Apply')}
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button style={{ color: amber[900] }} className={classes.button} onClick={clear(form)} fullWidth>
                    {t('trainingCompliance.operator.assignedEmployeeReport.clear', 'Clear')}
                  </Button>
                </Grid>
              </GridContainer>
            </Grid>
          </GridContainer>
        </form>
      )}
    </Form>
  );
};
