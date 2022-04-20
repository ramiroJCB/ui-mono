import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import ManageOrganizationForm from './ManageOrganizationForm';
import Typography from '@material-ui/core/Typography';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { FormSubmitHandler } from 'redux-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IManageOrganizationForm } from 'interfaces/manageOrganizationForm';
import { IOrganization, IOrganizationFeature } from '@pec/aion-ui-core/interfaces/organization';
import { Message } from '@pec/aion-ui-components/components/Message';

type Props = {
  organization: DeepReadonly<IOrganization>;
  organizationFeatures: DeepReadonly<IOrganizationFeature[]>;
  onSubmit: FormSubmitHandler<IManageOrganizationForm>;
  updateError: DeepReadonly<AxiosError> | Error | null;
};

const ManageOrganization: React.FC<Props> = ({
  organization: { name, features },
  organizationFeatures,
  updateError,
  onSubmit
}) => (
  <GridContainer>
    {updateError && (
      <Grid item xs={12}>
        <Message variant="error">
          <Typography variant="subtitle1">{updateError.message}</Typography>
        </Message>
      </Grid>
    )}
    <Grid item xs={12}>
      <Typography variant="h5">{name}</Typography>
    </Grid>
    <Grid item xs={12}>
      <ManageOrganizationForm
        organizationFeatures={organizationFeatures}
        onSubmit={onSubmit}
        initialValues={{
          features: features.reduce((obj, feature) => ({ ...obj, [feature]: true }), {})
        }}
      />
    </Grid>
  </GridContainer>
);

export default ManageOrganization;
