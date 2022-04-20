import * as React from 'react';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import withWidth, { isWidthUp, WithWidth } from '@material-ui/core/withWidth';
import { AsyncDialog } from '@pec/aion-ui-components/components/AsyncDialog';
import { Button } from '@material-ui/core';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';

const styles = (theme: Theme) => ({
  icon: {
    padding: theme.spacing(2)
  }
});

type OwnProps<T> = {
  message: string;
  handleDelete: () => Promise<void>;
  deleteSuccess?: () => T;
  variant?: 'icon' | 'button';
};

type Props<T> = OwnProps<T> & WithStyles<typeof styles> & WithWidth;

class ConfirmDeleteComponent<T> extends React.PureComponent<Props<T>> {
  renderTriggerButton = (handleToggle: () => void) =>
    this.props.variant === 'button' ? (
      <Button size="medium" fullWidth={!isWidthUp('md', this.props.width)} onClick={handleToggle}>
        Clear
      </Button>
    ) : (
      <IconButton onClick={handleToggle} className={this.props.classes.icon}>
        <DeleteIcon />
      </IconButton>
    );

  render() {
    const { message, handleDelete, deleteSuccess } = this.props;

    return (
      <AsyncDialog
        renderTriggerButton={this.renderTriggerButton}
        asyncAction={handleDelete}
        actionSuccess={deleteSuccess}
      >
        <DialogContent>
          <Typography>{message}</Typography>
        </DialogContent>
      </AsyncDialog>
    );
  }
}

export const ConfirmDelete = withStyles(styles)(withWidth()(ConfirmDeleteComponent)) as <T>(
  props: OwnProps<T>
) => React.ReactElement<OwnProps<T>>;
