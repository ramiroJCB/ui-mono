import * as React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { Error } from '@pec/aion-ui-components/components/Error';
import { Field, Form, GenericField, InjectedFormProps, reduxForm } from 'redux-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IIncidentRegion, IncidentRegionStatus } from 'interfaces/incidentRegion';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { OwnProps as SwitchFieldOwnProps, SwitchField } from '@pec/aion-ui-deprecated/components/SwitchField';
import { StandardTextFieldProps } from '@material-ui/core/TextField';
import { SwitchProps } from '@material-ui/core/Switch';
import { TextField } from '@pec/aion-ui-deprecated/components/TextField';
import { useTranslation } from 'react-i18next';

const { Active, Inactive } = IncidentRegionStatus;

type OwnProps = {
  isFetching?: boolean;
  errorResponse?: DeepReadonly<AxiosError> | null;
};

type Props = InjectedFormProps<IIncidentRegion, OwnProps> & OwnProps;

const FieldCustom = Field as new () => GenericField<StandardTextFieldProps>;
const SwitchCustom = Field as new () => GenericField<
  Pick<SwitchProps, Exclude<keyof SwitchProps, 'component'>> & SwitchFieldOwnProps
>;

const normalizeStatus = (value: boolean) => (value ? Active : Inactive);

const ClientRegionFormComponent: React.FC<Props> = ({
  submitting,
  pristine,
  invalid,
  isFetching,
  errorResponse,
  handleSubmit,
  initialValues
}) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <GridContainer alignItems="flex-start" justify="space-between">
        <Grid item>
          <Typography variant="h6" component="h2">
            {initialValues
              ? t('reporting.incidents.clientRegion.editRegion', 'Edit Region')
              : t('reporting.common.addRegion', 'Add a Region')}
          </Typography>
        </Grid>
      </GridContainer>
      {!isFetching && !errorResponse ? (
        <Form onSubmit={handleSubmit}>
          <GridContainer>
            <Grid item xs={12}>
              <FieldCustom
                name="name"
                label={t('reporting.common.name', 'Name')}
                required
                component={TextField}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <FieldCustom
                name="description"
                label={t('reporting.common.description', 'Description')}
                component={TextField}
                fullWidth
                multiline
                rows="6"
                margin="normal"
                required
              />
            </Grid>
            {initialValues && (
              <Grid item xs={12}>
                <SwitchCustom
                  name="status"
                  label={t('reporting.common.status', 'Status')}
                  checkedValue={Active}
                  component={SwitchField}
                  normalize={normalizeStatus}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" disabled={submitting || pristine || invalid}>
                {t('reporting.common.save', 'Save')}
              </Button>
            </Grid>
          </GridContainer>
        </Form>
      ) : errorResponse ? (
        <Error />
      ) : (
        <Loading />
      )}
    </React.Fragment>
  );
};

export const ClientRegionForm = reduxForm<IIncidentRegion, OwnProps>({
  form: 'clientRegionForm',
  enableReinitialize: true,
  destroyOnUnmount: false
})(ClientRegionFormComponent);
