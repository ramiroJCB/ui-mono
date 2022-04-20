import * as React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { AutoCompleteOrganizationsContainer } from 'containers/AutoCompleteOrganization';
import { DateField } from '@pec/aion-ui-deprecated/components/DateField';
import { Field, Form, GenericField, InjectedFormProps, reduxForm } from 'redux-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { is4Digits, isEmail, required } from '@pec/aion-ui-core/validators';
import { ISearchTraineesForm } from 'interfaces/searchTraineesForm';
import { TextFieldProps } from '@material-ui/core/TextField';
import { TextField } from '@pec/aion-ui-deprecated/components/TextField';
import { useTranslation } from 'react-i18next';

type Props = InjectedFormProps<ISearchTraineesForm>;

const FieldCustom = Field as new () => GenericField<TextFieldProps>;

const TraineeSearchForm: React.FC<Props> = ({ handleSubmit, submitting, invalid, pristine }) => {
  const { t } = useTranslation();
  return (
    <Form onSubmit={handleSubmit}>
      <GridContainer alignItems="flex-start">
        <Grid item xs={12} sm={6}>
          <FieldCustom
            variant="filled"
            required
            name="firstName"
            component={TextField}
            disabled={submitting}
            validate={required}
            label={t('smart.common.firstName', 'First Name')}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FieldCustom
            variant="filled"
            required
            name="lastName"
            component={TextField}
            disabled={submitting}
            validate={required}
            label={t('smart.common.lastName', 'Last Name')}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <div style={{ position: 'relative' }}>
            <AutoCompleteOrganizationsContainer formName="searchTrainees" />
          </div>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FieldCustom
            variant="filled"
            required
            name="ssnLastFour"
            component={TextField}
            disabled={submitting}
            validate={[required, is4Digits]}
            label={t('smart.traineeSearchForm.last4Digits', 'Last 4 Digits of SSN')}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <DateField
            variant="filled"
            required
            name="birthDate"
            disabled={submitting}
            label={t('smart.traineeSearchForm.dateOfBirth', 'Date of Birth')}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FieldCustom
            variant="filled"
            required
            name="phoneNumber"
            component={TextField}
            disabled={submitting}
            validate={required}
            label={t('smart.common.phoneNumber', 'Phone Number')}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <FieldCustom
            variant="filled"
            required
            name="emailAddress"
            component={TextField}
            disabled={submitting}
            validate={[required, isEmail]}
            label={t('smart.common.emailAddress', 'Email Address')}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting || invalid || pristine}
            fullWidth
            color="secondary"
          >
            {t('smart.common.continue', 'Continue')}
          </Button>
        </Grid>
      </GridContainer>
    </Form>
  );
};

export const TraineeSearchFormComponent = reduxForm<ISearchTraineesForm>({
  form: 'searchTrainees'
})(TraineeSearchForm);
