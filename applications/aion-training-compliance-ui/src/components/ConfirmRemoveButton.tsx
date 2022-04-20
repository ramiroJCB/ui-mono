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
};

export class ConfirmRemoveButton extends React.PureComponent<Props> {
  renderTriggerButton = (handleToggle: () => void) =>
    this.props.defaultButtonStyle ? (
      <Button onClick={handleToggle} style={{ backgroundColor: 'transparent' }}>
        {this.props.title}
      </Button>
    ) : (
      <Button variant="contained" color="secondary" onClick={handleToggle}>
        {this.props.title}
      </Button>
    );

  render() {
    const { message, handleDelete } = this.props;

    return (
      <AsyncDialog renderTriggerButton={this.renderTriggerButton} asyncAction={handleDelete}>
        <DialogContent>
          <Typography>{message}</Typography>
        </DialogContent>
      </AsyncDialog>
    );
  }
}
