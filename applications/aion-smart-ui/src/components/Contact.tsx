import * as React from 'react';
import CreateIcon from '@material-ui/icons/Create';
import EmailIcon from '@material-ui/icons/Email';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import NotesIcon from '@material-ui/icons/Notes';
import PhoneIcon from '@material-ui/icons/Phone';
import Typography from '@material-ui/core/Typography';
import withWidth, { isWidthUp, WithWidth } from '@material-ui/core/withWidth';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'utility-types';
import { FloatingActionButton } from '@pec/aion-ui-components/components/FloatingActionButton';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IconListItem } from '@pec/aion-ui-components/components/IconListItem';
import { IContact } from 'interfaces/contact';
import { useTranslation } from 'react-i18next';

type OwnProps = {
  organizationId: string;
  contact: DeepReadonly<IContact>;
};

const styles = (theme: Theme) =>
  createStyles({
    container: {
      position: 'relative'
    },
    fab: {
      [theme.breakpoints.up('md')]: {
        position: 'absolute',
        bottom: theme.spacing(1),
        right: 0
      }
    },
    contactNameJobTitle: {
      [theme.breakpoints.down('sm')]: {
        paddingLeft: 12
      }
    }
  });

type Props = WithStyles<typeof styles> & WithWidth & OwnProps;

const Contact: React.FC<Props> = ({
  organizationId,
  contact: { siteId, id: contactId, firstName, lastName, jobTitle, phoneNumber, emailAddress, description },
  classes,
  width
}) => {
  const { t } = useTranslation();
  return (
    <GridContainer className={classes.container} spacing={isWidthUp('md', width) ? undefined : 0}>
      <Grid item xs={12}>
        <Typography variant="h6" className={classes.contactNameJobTitle}>
          {firstName} {lastName}
        </Typography>
        {jobTitle && (
          <Typography variant="subtitle1" className={classes.contactNameJobTitle}>
            {jobTitle}
          </Typography>
        )}
        <List component="nav">
          <IconListItem href={`tel:${phoneNumber}`} icon={<PhoneIcon />} primaryText={phoneNumber} />
          <IconListItem href={`mailto:${emailAddress}`} icon={<EmailIcon />} primaryText={emailAddress} />
          {description && <IconListItem icon={<NotesIcon />} primaryText={description} />}
        </List>
      </Grid>
      <FloatingActionButton
        to={`/${organizationId}/sites/${siteId}/contacts/${contactId}/edit`}
        icon={<CreateIcon />}
        label={t('smart.contact.editContact', 'Edit Contact')}
        size={isWidthUp('md', width) ? 'small' : undefined}
        className={classes.fab}
      />
    </GridContainer>
  );
};

export const ContactComponent = withStyles(styles)(withWidth()(Contact));
