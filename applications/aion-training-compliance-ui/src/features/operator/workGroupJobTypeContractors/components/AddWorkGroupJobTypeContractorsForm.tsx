import * as React from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { AutocompleteContractorsContainer } from 'features/operator/autocompleteContractors/containers/AutocompleteContractors';
import { DeepReadonly } from 'ts-essentials';
import { Form } from 'react-final-form';
import { FormApi } from 'final-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { Header } from 'components/Header';
import { IAddWorkGroupJobTypeContractorForm } from 'interfaces/addWorkGroupJobTypeContractorForm';
import { IContractor } from 'interfaces/contractor';
import { IWorkGroupJobType } from '@pec/aion-ui-core/interfaces/workGroupJobType';
import { Link, useParams } from 'react-router-dom';
import { LoadingButton } from '@pec/aion-ui-components/components/LoadingButton';
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from 'components/Paper';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles({
  autoCompleteField: {
    marginTop: 12
  }
});

type RouteParams = {
  organizationId: string;
  workGroupId: string;
  workGroupJobTypeId: string;
};

type Props = {
  initialValues: IAddWorkGroupJobTypeContractorForm;
  onSubmit: (values: IAddWorkGroupJobTypeContractorForm, form: FormApi<IAddWorkGroupJobTypeContractorForm>) => void;
  workGroupJobType: DeepReadonly<IWorkGroupJobType> | null;
  isFetching: boolean;
  validate?: (values: IContractor[]) => Promise<JSX.Element | string | undefined>;
};

export const AddWorkGroupJobTypeContractorForm: React.FC<Props> = ({
  initialValues,
  onSubmit,
  workGroupJobType,
  isFetching,
  validate
}) => {
  const { organizationId, workGroupId, workGroupJobTypeId } = useParams<RouteParams>();
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <Header item={workGroupJobType} isFetching={isFetching}>
        {({ jobTypeName }) =>
          t('trainingCompliance.common.addContractors', {
            jobTypeName,
            defaultValue: 'Add Contractors to {{jobTypeName}}'
          })
        }
      </Header>
      <Form initialValues={initialValues} onSubmit={onSubmit}>
        {({ handleSubmit, submitting, pristine, invalid }) => (
          <form onSubmit={handleSubmit}>
            <Paper>
              <GridContainer justify="center">
                <Grid item xs={8}>
                  <AutocompleteContractorsContainer validate={validate} className={classes.autoCompleteField} />
                </Grid>
                <Grid item xs={12}>
                  <Grid container justify="space-between" alignItems="center">
                    <Grid item>
                      <Button
                        variant="text"
                        color="primary"
                        component={Link}
                        to={`/${organizationId}/training-compliance/work-groups/${workGroupId}/job-types/${workGroupJobTypeId}`}
                        fullWidth
                      >
                        {t('trainingCompliance.common.cancel', 'Cancel')}
                      </Button>
                    </Grid>
                    <Grid>
                      <LoadingButton
                        type="submit"
                        variant="contained"
                        color="secondary"
                        isSubmitting={submitting}
                        disabled={submitting || invalid || pristine}
                        fullWidth
                      >
                        {submitting ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          t('trainingCompliance.common.submit', 'Submit')
                        )}
                      </LoadingButton>
                    </Grid>
                  </Grid>
                </Grid>
              </GridContainer>
            </Paper>
          </form>
        )}
      </Form>
    </React.Fragment>
  );
};
