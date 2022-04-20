import * as React from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Field } from 'react-final-form';
import { Form } from 'react-final-form';
import { FormApi } from 'final-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { isSingleAlphaCaps, maxLength, isValidPhoneNumberWithMaxLength } from '@pec/aion-ui-core/validators';
import { ITrainee } from '@pec/aion-ui-core/interfaces/trainee';
import { Link } from 'react-router-dom';
import { LoadingButton } from '@pec/aion-ui-components/components/LoadingButton';
import { Location } from 'history';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { TextField } from '@pec/aion-ui-deprecated/components/TextField';
import { useTranslation } from 'react-i18next';

type Props = {
  trainee: ITrainee;
  initialValues: ITrainee;
  onSubmit: (values: ITrainee, form: FormApi<ITrainee>) => void;
  location: Location;
};

export const EditContactInfoForm: React.FC<Props> = ({ initialValues, onSubmit, trainee, location }) => {
  const { t } = useTranslation();
  const userReferredByCbt = parse(location.search).from === 'eLearning/Student/';

  return (
    <GridContainer alignContent="center" justify="center">
      <Grid item xs={12}>
        <Typography variant="h4" align="center" gutterBottom>
          {trainee.firstName} {trainee.lastName}
        </Typography>
        <Typography variant="h6" align="center" gutterBottom>
          {t('user.profile.updateContactInformation', 'Update Contact Information')}
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <Form initialValues={initialValues} onSubmit={onSubmit}>
          {({ handleSubmit, submitting, invalid, pristine }) => (
            <form onSubmit={handleSubmit}>
              <Paper>
                <GridContainer alignContent="center" justify="center">
                  {userReferredByCbt && (
                    <Grid item xs={12}>
                      <Field<string>
                        fullWidth
                        name="middleInitial"
                        label={t('user.profile.middleInitial', 'Middle Initial')}
                        component={TextField}
                        required
                        validate={isSingleAlphaCaps}
                      />
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Field<string>
                      fullWidth
                      name="phoneNumber"
                      label={t('user.profile.phoneNumber', 'Personal Phone')}
                      component={TextField}
                      required={userReferredByCbt}
                      validate={maxLength(25)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field<string>
                      fullWidth
                      name="emergencyContactName"
                      label={t('user.profile.emergencyContactName', 'Emergency Contact Name')}
                      component={TextField}
                      required={userReferredByCbt}
                      validate={maxLength(255)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field<string>
                      fullWidth
                      name="emergencyContactPhoneNumber"
                      label={t('user.profile.emergencyContactPhoneNumber', 'Emergency Contact Phone')}
                      component={TextField}
                      required={userReferredByCbt}
                      validate={isValidPhoneNumberWithMaxLength(25)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field<string>
                      fullWidth
                      name="emergencyContactRelation"
                      label={t('user.profile.emergencyContactRelation', 'Emergency Contact Relation')}
                      component={TextField}
                      required={userReferredByCbt}
                      validate={maxLength(255)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <GridContainer alignContent="center" justify="center">
                      {!userReferredByCbt && (
                        <Grid item>
                          <Button variant="text" color="primary" component={Link} to="/contact-info" fullWidth>
                            {t('user.profile.cancel', 'Cancel')}
                          </Button>
                        </Grid>
                      )}
                      <Grid item>
                        <LoadingButton
                          type="submit"
                          fullWidth
                          variant="contained"
                          color="primary"
                          disabled={submitting || invalid || pristine}
                          isSubmitting={submitting}
                        >
                          {submitting ? <CircularProgress size={24} color="inherit" /> : t('user.profile.save', 'Save')}
                        </LoadingButton>
                      </Grid>
                    </GridContainer>
                  </Grid>
                </GridContainer>
              </Paper>
            </form>
          )}
        </Form>
      </Grid>
    </GridContainer>
  );
};
