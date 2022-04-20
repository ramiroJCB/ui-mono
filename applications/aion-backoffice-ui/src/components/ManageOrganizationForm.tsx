import * as React from 'react';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import { DeepReadonly } from 'utility-types';
import { Field, InjectedFormProps, reduxForm } from 'redux-form';
import { IManageOrganizationForm } from 'interfaces/manageOrganizationForm';
import { IOrganizationFeature } from '@pec/aion-ui-core/interfaces/organization';
import { Message } from '@pec/aion-ui-components/components/Message';
import { useTranslation } from 'react-i18next';

type FormProps = {
  organizationFeatures: DeepReadonly<IOrganizationFeature[]>;
};

type Props = InjectedFormProps<IManageOrganizationForm, FormProps> & FormProps;

const ManageOrganizationForm: React.FC<Props> = ({
  submitting,
  handleSubmit,
  pristine,
  invalid,
  organizationFeatures
}) => {
  const { t } = useTranslation();

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Message>
        <Typography variant="subtitle1">
          <a href="/SSQV4/Admin/CompanyAdmin.aspx">
            {t(
              'backoffice.manageOgranizationForm.disabledMessage',
              'Disabled options must be managed in the legacy system'
            )}
          </a>
        </Typography>
      </Message>
      <List dense>
        {organizationFeatures.map(({ name, friendlyName, isLegacyFeature }) => (
          <ListItem key={name}>
            <Field
              name={`features[${name}]`}
              component={({ input: { ...input } }) => (
                <FormControlLabel control={<Checkbox disabled={isLegacyFeature} {...input} />} label={friendlyName} />
              )}
              type="checkbox"
              disabled={isLegacyFeature}
            />
          </ListItem>
        ))}
      </List>
      <Button variant="contained" type="submit" color="inherit" disabled={pristine || submitting || invalid}>
        {t('backoffice.common.save', 'Save')}
      </Button>
    </form>
  );
};

export default reduxForm<IManageOrganizationForm, FormProps>({ form: 'manageOrganizationForm' })(
  ManageOrganizationForm
);
