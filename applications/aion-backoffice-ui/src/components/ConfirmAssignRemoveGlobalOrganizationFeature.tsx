import * as React from 'react';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import { AsyncDialog } from '@pec/aion-ui-components/components/AsyncDialog';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';

const styles = (theme: Theme) =>
  createStyles({
    assignButton: {
      marginRight: theme.spacing(1),
      marginLeft: theme.spacing(1),
      background: theme.palette.primary.main,
      color: theme.palette.common.white
    },
    removeButton: {
      marginRight: theme.spacing(1),
      marginLeft: theme.spacing(1),
      background: theme.palette.error.main,
      color: theme.palette.common.white
    }
  });

type OwnProps<T> = {
  mode: 'assign' | 'remove';
  message: string;
  handleAction: () => Promise<void>;
  actionSuccess: () => T;
};

type Props<T> = WithStyles<typeof styles> & OwnProps<T> & I18nextProps;

class ConfirmAssignRemoveGlobalOrganizationFeatureComponent<T> extends React.PureComponent<Props<T>> {
  renderTriggerButton = (handleToggle: () => void) => {
    const { mode, classes, t } = this.props;
    return (
      <Button
        onClick={handleToggle}
        className={mode === 'assign' ? classes.assignButton : classes.removeButton}
        variant="contained"
      >
        {mode === 'assign' ? t('backoffice.common.assign', 'Assign') : t('backoffice.common.remove', 'Remove')}
      </Button>
    );
  };

  render() {
    const { message, handleAction, actionSuccess } = this.props;

    return (
      <AsyncDialog
        renderTriggerButton={this.renderTriggerButton}
        asyncAction={handleAction}
        actionSuccess={actionSuccess}
      >
        <DialogContent>
          <Typography>{message}</Typography>
        </DialogContent>
      </AsyncDialog>
    );
  }
}

export const ConfirmAssignRemoveGlobalOrganizationFeature = withStyles(styles)(
  withTranslation()(ConfirmAssignRemoveGlobalOrganizationFeatureComponent)
) as <T>(props: OwnProps<T>) => React.ReactElement<OwnProps<T>>;
