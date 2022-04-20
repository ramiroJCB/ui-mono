import * as React from 'react';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import HelpIcon from '@material-ui/icons/Help';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import Tooltip, { TooltipProps } from '@material-ui/core/Tooltip';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { TaskStatus, TaskStatusDescription } from '@pec/aion-ui-core/interfaces/taskGroup';

const { AssigneeReplied, AwaitingAction, Complete, Incomplete, OwnerReplied, Submitted } = TaskStatus;

const styles = (theme: Theme) =>
  createStyles({
    icon: {
      marginTop: theme.spacing(0.5)
    },
    awaitingAction: {
      color: '#E99842'
    },
    awaitingResponse: {
      color: '#0288d1'
    },
    complete: {
      color: theme.palette.secondary.main
    },
    incomplete: {
      color: theme.palette.error.main
    }
  });

type OwnProps = {
  status: TaskStatus;
  tooltipPlacement?: TooltipProps['placement'];
};

type Props = OwnProps & WithStyles<typeof styles>;

const TaskStatusIconComponent: React.FC<Props> = ({ status, classes, tooltipPlacement }) => {
  const renderStatusIcon = () => {
    switch (status) {
      case OwnerReplied:
      case AwaitingAction:
        return <ErrorIcon className={`${classes.icon} ${classes.awaitingAction}`} />;
      case Complete:
        return <CheckCircleIcon className={`${classes.icon} ${classes.complete}`} />;
      case Incomplete:
        return <RemoveCircleIcon className={`${classes.icon} ${classes.incomplete}`} />;
      case AssigneeReplied:
        return <HelpIcon className={`${classes.icon} ${classes.awaitingResponse}`} />;
      case Submitted:
        return <CheckCircleIcon className={`${classes.icon} ${classes.awaitingResponse}`} />;
      default:
        return <ErrorOutlineIcon />;
    }
  };
  return (
    <React.Fragment>
      {tooltipPlacement ? (
        <Tooltip title={TaskStatusDescription.get(status) || 'Unknown'} enterDelay={300} placement={tooltipPlacement}>
          {renderStatusIcon()}
        </Tooltip>
      ) : (
        renderStatusIcon()
      )}
    </React.Fragment>
  );
};

export const TaskStatusIcon = withStyles(styles)(TaskStatusIconComponent);
