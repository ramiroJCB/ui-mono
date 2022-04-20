import * as React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Grid from '@material-ui/core/Grid';
import ManageUserActivitiesRow from './ManageUserActivitiesRow';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { DeepReadonly } from 'utility-types';
import { DialogTransition } from '@pec/aion-ui-components/components/DialogTransition';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IActivityResource } from 'interfaces/activityResource';
import { IUser } from 'interfaces/user';
import { IUserActivityMap } from 'interfaces/userActivity';
import { Message } from '@pec/aion-ui-components/components/Message';
import { Theme, WithStyles, withStyles } from '@material-ui/core/styles';
import { UserInfoActivitiesType } from '@pec/aion-ui-core/interfaces/userInfo';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';

const { Global, Organization, User } = UserInfoActivitiesType;

const styles = (theme: Theme) => ({
  cell: {
    fontSize: 14
  },
  button: {
    marginTop: theme.spacing(3)
  }
});

type OwnProps = {
  user: DeepReadonly<IUser>;
  userActivityMap: DeepReadonly<IUserActivityMap>;
  activityResources: IActivityResource[];
  isFetching: boolean;
  orderedActions: string[];
  activityType: DeepReadonly<UserInfoActivitiesType>;
  scopeId?: string;
  onSubmit: (userActivities: IUserActivityMap, activityResources: IActivityResource[]) => void;
};

type Props = WithStyles<typeof styles> & OwnProps & I18nextProps;

type State = {
  userActivityMap: IUserActivityMap;
  confirmSubmitOpen: boolean;
  uncheckOverride: string[];
  overriddenLegacyPermissions: string[];
};

class ManageUserActivities extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { userActivityMap } = props;
    this.state = {
      userActivityMap,
      confirmSubmitOpen: false,
      uncheckOverride: [],
      overriddenLegacyPermissions: []
    };
  }

  handleLevelChange = (resourceName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const level = parseInt(e.target.value, 10);
    const { userActivityMap } = this.state;
    if (userActivityMap[resourceName]) {
      userActivityMap[resourceName].level = level;
    } else {
      userActivityMap[resourceName] = {
        canAudit: false,
        level,
        override: false
      };
    }
    this.setState({
      userActivityMap
    });
  };

  handleAuditClick = (resourceName: string) => () => {
    const { userActivityMap } = this.state;
    if (userActivityMap[resourceName]) {
      userActivityMap[resourceName].canAudit = !userActivityMap[resourceName].canAudit;
    } else {
      userActivityMap[resourceName] = {
        canAudit: true,
        level: 0,
        override: false
      };
    }
    this.setState({
      userActivityMap
    });
  };

  handleOverrideClick = (resourceName: string) => () => {
    const { userActivityMap } = this.state;
    if (userActivityMap[resourceName]) {
      userActivityMap[resourceName].override = !userActivityMap[resourceName].override;
      if (userActivityMap[resourceName].override) {
        this.setState(state => {
          return {
            overriddenLegacyPermissions: [...state.overriddenLegacyPermissions, resourceName],
            uncheckOverride: state.uncheckOverride.filter(resource => resource !== resourceName)
          };
        });
      } else {
        this.setState(state => {
          return {
            overriddenLegacyPermissions: state.overriddenLegacyPermissions.filter(
              resource => resource !== resourceName
            ),
            uncheckOverride: [...state.uncheckOverride, resourceName]
          };
        });
      }
    } else {
      userActivityMap[resourceName] = {
        canAudit: false,
        level: 0,
        override: true
      };
      this.setState(state => {
        return {
          overriddenLegacyPermissions: [...state.overriddenLegacyPermissions, resourceName],
          uncheckOverride: state.uncheckOverride.filter(resource => resource !== resourceName)
        };
      });
    }
    this.setState({
      userActivityMap,
      confirmSubmitOpen: false
    });
  };

  handleSubmitOpen = () => {
    this.setState({ confirmSubmitOpen: true });
  };

  handleSubmitClose = () => {
    this.setState({ confirmSubmitOpen: false });
  };

  handleSubmit = () => this.props.onSubmit(this.state.userActivityMap, this.props.activityResources);

  render() {
    const {
      user: { username },
      activityResources,
      isFetching,
      orderedActions,
      activityType,
      scopeId,
      classes,
      t
    } = this.props;
    const { userActivityMap, confirmSubmitOpen, uncheckOverride, overriddenLegacyPermissions } = this.state;
    const requiresConfirmationDialog = overriddenLegacyPermissions.length || uncheckOverride.length;

    return (
      <GridContainer>
        <Grid item xs={12}>
          <Typography variant="h5">
            {
              {
                [Global]: t('backoffice.manageUserActivities.globalPermissions', {
                  defaultValue: 'Global permissions for user: {{username}}',
                  username
                }),
                [Organization]: t('backoffice.manageUserActivities.permissionsOnOrganization', {
                  defaultValue: 'Permissions on organization: {{scopeId}} for user: {{username}}',
                  username,
                  scopeId
                }),
                [User]: t('backoffice.manageUserActivities.permissionsOnUser', {
                  defaultValue: 'Permissions on user: {{scopeId}} for user: {{username}}',
                  username,
                  scopeId
                })
              }[activityType]
            }
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <form onSubmit={this.handleSubmit}>
            <Dialog
              TransitionComponent={DialogTransition}
              open={confirmSubmitOpen}
              onClose={this.handleSubmitClose}
              aria-describedby="confirm-change-value-description"
            >
              <DialogContent>
                <DialogContentText id="confirm-change-value-description">
                  {uncheckOverride.length
                    ? t(
                        'backoffice.manageUserActivities.uncheckingOverrid',
                        'Unchecking override will reset a permission to its default level. Are you sure you want to change legacy permissions?'
                      )
                    : t(
                        'backoffice.manageUserActivities.areYouSure',
                        'Are you sure you want to change legacy permissions?'
                      )}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button color="primary" onClick={this.handleSubmitClose}>
                  {t('backoffice.common.cancel', 'Cancel')}
                </Button>
                <Button variant="contained" onClick={this.handleSubmit} disabled={isFetching}>
                  {t('backoffice.common.yes', 'Yes')}
                </Button>
              </DialogActions>
            </Dialog>
            <Message>
              <Typography variant="subtitle1">
                {t(
                  'backoffice.manageUserActivities.disabledOptions',
                  "Disabled options are traditionally managed in the legacy system. However, you can select 'override' to enable and edit these options."
                )}
              </Typography>
            </Message>
            {requiresConfirmationDialog ? (
              <Button
                className={classes.button}
                variant="contained"
                onClick={this.handleSubmitOpen}
                disabled={isFetching}
              >
                {t('backoffice.common.save', 'Save')}
              </Button>
            ) : (
              <Button className={classes.button} variant="contained" type="submit" disabled={isFetching}>
                {t('backoffice.common.save', 'Save')}
              </Button>
            )}
            <Table style={{ margin: '0.5em 0' }}>
              <TableHead>
                <TableRow>
                  <TableCell align="center" />
                  <TableCell align="center" />
                  {orderedActions.map(action => (
                    <TableCell
                      className={classes.cell}
                      key={action}
                      align="center"
                      style={{ borderLeft: 'none', fontWeight: 'normal' }}
                    >
                      {action}
                    </TableCell>
                  ))}
                  <TableCell align="center" />
                  <TableCell align="center" />
                </TableRow>
              </TableHead>
              <TableBody>
                {activityResources.map(({ name: resourceName, isLegacyResource }) => {
                  const { canAudit, level, override } = userActivityMap[resourceName] || {
                    canAudit: false,
                    level: 0,
                    override: false
                  };

                  return (
                    <ManageUserActivitiesRow
                      key={resourceName}
                      resourceName={resourceName}
                      isLegacyResource={isLegacyResource}
                      isOverride={override}
                      actionName={orderedActions[level]}
                      handleLevelChange={this.handleLevelChange(resourceName)}
                      level={level}
                      handleAuditClick={this.handleAuditClick(resourceName)}
                      handleOverrideClick={this.handleOverrideClick(resourceName)}
                      canAudit={canAudit}
                    />
                  );
                })}
              </TableBody>
            </Table>
            {requiresConfirmationDialog ? (
              <Button
                className={classes.button}
                variant="contained"
                onClick={this.handleSubmitOpen}
                disabled={isFetching}
              >
                {t('backoffice.common.save', 'Save')}
              </Button>
            ) : (
              <Button className={classes.button} variant="contained" type="submit" disabled={isFetching}>
                {t('backoffice.common.save', 'Save')}
              </Button>
            )}
          </form>
        </Grid>
      </GridContainer>
    );
  }
}

export default withStyles(styles)(withTranslation()(ManageUserActivities));
