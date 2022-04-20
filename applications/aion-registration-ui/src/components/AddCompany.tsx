import * as React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { Field, Form, GenericField, InjectedFormProps, reduxForm } from 'redux-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { ICompanyForm } from '../interfaces/companyForm';
import { required } from '@pec/aion-ui-core/validators';
import { StandardTextFieldProps } from '@material-ui/core/TextField';
import { TextField } from '@pec/aion-ui-deprecated/components/TextField';
import { useTranslation } from 'react-i18next';

const FieldCustom = Field as new () => GenericField<StandardTextFieldProps>;

const styles = (theme: Theme) =>
  createStyles({
    button: {
      marginTop: theme.spacing(3)
    }
  });

type Props = InjectedFormProps<ICompanyForm> & WithStyles<typeof styles>;

const AddCompany: React.FC<Props> = ({ handleSubmit, submitting, invalid, classes, pristine }) => {
  const { t } = useTranslation();

  return (
    <Form onSubmit={handleSubmit}>
      <GridContainer>
        <Grid item xs={12}>
          <FieldCustom
            required
            name="name"
            component={TextField}
            disabled={submitting}
            validate={required}
            label={t('registration.addCompanyForm.companyName', 'Company Name')}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <FieldCustom
            required
            name="phoneNumber"
            component={TextField}
            disabled={submitting}
            validate={required}
            label={t('registration.addCompanyForm.phoneNumber', 'Phone Number')}
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            disabled={submitting || invalid || pristine}
            fullWidth
            color="secondary"
            className={classes.button}
          >
            {t('registration.addCompanyForm.addCompany', 'Add Company')}
          </Button>
        </Grid>
      </GridContainer>
    </Form>
  );
};

export default reduxForm<ICompanyForm>({ form: 'addCompanyForm' })(withStyles(styles)(AddCompany));
