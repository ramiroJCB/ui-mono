import * as React from 'react';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import { AsyncDialog } from '@pec/aion-ui-components/components/AsyncDialog';

type Props = {
  title: string;
  message: string;
  handleDelete: () => Promise<void>;
  defaultButtonStyle?: boolean;
  disabled: boolean;
};

export class ConfirmDeleteButton extends React.Component<Props> {
  renderTriggerButton = (handleToggle: () => void) =>
    this.props.defaultButtonStyle ? (
      <Button onClick={handleToggle} style={{ backgroundColor: 'transparent' }} disabled={this.props.disabled}>
        {this.props.title}
      </Button>
    ) : (
      <Button onClick={handleToggle} disabled={this.props.disabled}>
        <Typography variant="button" color={this.props.disabled ? 'textSecondary' : 'error'}>
          {this.props.title}
        </Typography>
      </Button>
    );

  render() {
    const { message, handleDelete } = this.props;

    return (
      <React.Fragment>
        <AsyncDialog renderTriggerButton={this.renderTriggerButton} asyncAction={handleDelete}>
          <DialogContent>
            <Typography>{message}</Typography>
          </DialogContent>
        </AsyncDialog>
      </React.Fragment>
    );
  }
}
