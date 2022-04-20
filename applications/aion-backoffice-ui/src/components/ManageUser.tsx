import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { DeepReadonly } from 'utility-types';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IUser } from 'interfaces/user';
import { IUserOrganization } from '@pec/aion-ui-core/interfaces/userOrganization';
import { Link } from '@pec/aion-ui-components/components/Link';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

const styles = () => ({
  form: {
    display: 'block',
    width: '100%'
  }
});

type OwnProps = {
  user: DeepReadonly<IUser>;
  organizationsForUser: DeepReadonly<IUserOrganization[]>;
  onSubmitOrganizationId: (event: React.FormEvent<HTMLElement>) => void;
  onSubmitUserId: (event: React.FormEvent<HTMLElement>) => void;
};

type Props = WithStyles<typeof styles> & OwnProps;

const ManageUser: React.FC<Props> = ({
  user: { id: userId, username, email },
  organizationsForUser,
  onSubmitOrganizationId,
  onSubmitUserId,
  classes
}) => {
  const { t } = useTranslation();

  return (
    <GridContainer>
      <Grid item xs={12}>
        <Typography variant="h5">{username}</Typography>
        <Typography variant="subtitle1">
          <Link to={`mailto:${email}`}>{email}</Link>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Paper>
          <Typography variant="subtitle1">
            {t('backoffice.manageUser.globalPermissons', 'Global permissions')}
          </Typography>
          <List component="nav">
            <ListItem disableGutters>
              <ListItemText>
                <Link to={`/users/${userId}/permissions/Global`}>
                  {t('backoffice.manageUser.editGlobalPermissions', 'Edit global permissions')}
                </Link>
              </ListItemText>
            </ListItem>
          </List>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper>
          <Typography variant="subtitle1">
            {t('backoffice.manageUser.organizationScopedPermissions', 'Organization-scoped permissions')}
          </Typography>
          <List component="nav">
            {organizationsForUser.map(({ id, name }) => (
              <ListItem disableGutters key={id}>
                <ListItemText secondary={id}>
                  <Link to={`/users/${userId}/permissions/Organization/${id}`}>{name}</Link>
                </ListItemText>
              </ListItem>
            ))}
            <ListItem disableGutters>
              <form className={classes.form} onSubmit={onSubmitOrganizationId}>
                <TextField
                  fullWidth
                  label={t('backoffice.manageUser.selectByOrganization', 'Select by Organization ID')}
                  placeholder={t('backoffice.manageUser.enterOrganizationID', 'Enter an Organization ID…')}
                />
              </form>
            </ListItem>
          </List>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper>
          <Typography variant="subtitle1">
            {t('backoffice.manageUser.userScopedPermissions', 'User-scoped permissions')}
          </Typography>
          <List component="nav">
            <ListItem disableGutters>
              <form className={classes.form} onSubmit={onSubmitUserId}>
                <TextField
                  fullWidth
                  label={t('backoffice.manageUser.selectByUserID', 'Select by User ID')}
                  placeholder={t('backoffice.manageUser.enterUserID', 'Enter a User ID…')}
                />
              </form>
            </ListItem>
          </List>
        </Paper>
      </Grid>
    </GridContainer>
  );
};

export default withStyles(styles)(ManageUser);
