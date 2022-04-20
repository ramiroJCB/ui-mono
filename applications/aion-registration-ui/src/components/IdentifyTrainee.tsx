import * as React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { Field, Form, GenericField, InjectedFormProps, reduxForm } from 'redux-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IIdentifyTraineeForm } from '../interfaces/identifyTraineeForm';
import { normalizePecId } from '@pec/aion-ui-core/normalizers';
import { Page } from './Page';
import { required, validatePecId } from '@pec/aion-ui-core/validators';
import { StandardTextFieldProps } from '@material-ui/core/TextField';
import { TextField } from '@pec/aion-ui-deprecated/components/TextField';
import { useTranslation } from 'react-i18next';

const FieldCustom = Field as new () => GenericField<StandardTextFieldProps>;

const styles = () =>
  createStyles({
    button: {
      marginTop: 12
    }
  });

const helperText = validatePecId('no bueno');

type Props = InjectedFormProps<IIdentifyTraineeForm> & WithStyles<typeof styles>;

const IdentifyTraineeForm: React.FC<Props> = ({
  handleSubmit,
  submitting,
  anyTouched,
  submitFailed,
  invalid,
  error,
  classes
}) => {
  const { t } = useTranslation();

  return (
    <Page title={t('registration.identifyTraineeForm.enterYourPECID', 'Enter Your PEC ID')}>
      <Form onSubmit={handleSubmit}>
        <GridContainer direction="column" alignItems="center" justify="center">
          <Grid item sm={6} lg={4}>
            <FieldCustom
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">{t('registration.identifyTraineeForm.PEC', 'PEC')}</InputAdornment>
                )
              }}
              required
              fullWidth
              name="pecIdentifier"
              component={TextField}
              placeholder="#########"
              disabled={submitting}
              helperText={error || helperText}
              validate={[validatePecId, required]}
              normalize={normalizePecId}
              error={submitFailed || !!error || (anyTouched && invalid)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              disabled={submitting || invalid}
              variant="contained"
              color="secondary"
              className={classes.button}
            >
              {t('registration.identifyTraineeForm.identify', 'Identify')}
            </Button>
          </Grid>
        </GridContainer>
      </Form>
    </Page>
  );
};

export default reduxForm<IIdentifyTraineeForm>({ form: 'identifyTraineeForm' })(
  withStyles(styles)(IdentifyTraineeForm)
);
