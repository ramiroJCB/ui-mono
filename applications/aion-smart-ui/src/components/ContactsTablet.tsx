import * as React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { AddContactContainer } from 'containers/AddContact';
import { ContactsComponent } from 'components/Contacts';
import { DeepReadonly } from 'utility-types';
import { EditContactContainer } from 'containers/Contact';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IContact } from 'interfaces/contact';
import { ISite } from 'interfaces/site';
import { NavLink } from '@pec/aion-ui-components/components/NavLink';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { useTranslation } from 'react-i18next';
import { localizeNumber } from '@pec/aion-ui-i18next/helpers/localize';

type Props = {
  match: {
    params: {
      organizationId: string;
      siteId: string;
      contactId?: string;
      mode?: 'edit' | 'add';
    };
  };
  contacts: DeepReadonly<IContact[]>;
  site: DeepReadonly<ISite>;
};

export const ContactsTabletComponent: React.FC<Props> = ({ match, contacts }) => {
  const { t } = useTranslation();
  const {
    params: { organizationId, siteId, contactId, mode }
  } = match;

  return (
    <GridContainer>
      <Grid item xs={12}>
        <GridContainer justify="space-between">
          <Grid item>
            <Typography variant="h6">
              {t('smart.contactsCount', {
                count: contacts.length,
                defaultValue_plural: '{{count}} Contacts',
                defaultValue: '{{count}} Contact'
              }).replace(contacts.length.toString(), localizeNumber(contacts.length, t))}
            </Typography>
          </Grid>
          <Grid item>
            <Button variant="outlined" component={NavLink} to={`/${organizationId}/sites/${siteId}/contacts/add`}>
              {t('smart.contactsTablet.addContact', 'Add Contact')}
            </Button>
          </Grid>
        </GridContainer>
      </Grid>
      <Grid item xs={6}>
        <ContactsComponent organizationId={organizationId} siteId={siteId} contacts={contacts} />
      </Grid>
      <Grid item xs={6}>
        <Paper>{mode === 'add' ? <AddContactContainer /> : contactId && <EditContactContainer />}</Paper>
      </Grid>
    </GridContainer>
  );
};
