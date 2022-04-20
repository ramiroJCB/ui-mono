import * as React from 'react';
import AddIcon from '@material-ui/icons/Add';
import ContactPhoneIcon from '@material-ui/icons/ContactPhone';
import Grid from '@material-ui/core/Grid';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import List from '@material-ui/core/List';
import withWidth, { isWidthUp, WithWidth } from '@material-ui/core/withWidth';
import { DeepReadonly } from 'utility-types';
import { FloatingActionButton } from '@pec/aion-ui-components/components/FloatingActionButton';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IconCard } from '@pec/aion-ui-components/components/IconCard';
import { IconListItem } from '@pec/aion-ui-components/components/IconListItem';
import { IContact } from 'interfaces/contact';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

type OwnProps = {
  organizationId: string;
  siteId: string;
  contacts: DeepReadonly<IContact[]>;
};

const styles = () => ({
  list: {
    paddingTop: 0
  }
});

type Props = WithStyles<typeof styles> & WithWidth & OwnProps;

const Contacts: React.FC<Props> = ({ organizationId, siteId, contacts, width, classes }) => {
  const { t } = useTranslation();
  return (
    <GridContainer
      spacing={isWidthUp('md', width) ? undefined : 0}
      style={isWidthUp('md', width) ? { paddingTop: 0 } : undefined}
    >
      {contacts.length > 0 ? (
        isWidthUp('md', width) ? (
          contacts.map(({ id, firstName, lastName, jobTitle }) => (
            <Grid item xs={12} key={id} className={classes.list}>
              <IconCard
                to={`/${organizationId}/sites/${siteId}/contacts/${id}`}
                icon={<ContactPhoneIcon />}
                primaryText={`${firstName} ${lastName}`}
              >
                {jobTitle}
              </IconCard>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <List component="nav" className={classes.list}>
              {contacts.map(({ id, firstName, lastName, jobTitle }) => (
                <IconListItem
                  key={id}
                  to={`/${organizationId}/sites/${siteId}/contacts/${id}`}
                  icon={<ContactPhoneIcon />}
                  primaryText={`${firstName} ${lastName}`}
                >
                  {jobTitle}
                </IconListItem>
              ))}
            </List>
            <FloatingActionButton
              to={`/${organizationId}/sites/${siteId}/contacts/add`}
              icon={<AddIcon />}
              label={t('smart.contacts.add', 'Add a Contact')}
            />
          </Grid>
        )
      ) : (
        <Grid item xs={12}>
          <List component="nav">
            <IconListItem icon={<HelpOutlineIcon />} primaryText={t('smart.contacts.addContacts', 'Add Contacts')}>
              {isWidthUp('md', width)
                ? t('smart.contacts.useForm', 'Use the form to the right to add your first contact.')
                : t('smart.contacts.useButton', 'Use the button in the bottom right to add your first contact.')}
            </IconListItem>
          </List>
        </Grid>
      )}
    </GridContainer>
  );
};

export const ContactsComponent = withWidth()(withStyles(styles)(Contacts));
