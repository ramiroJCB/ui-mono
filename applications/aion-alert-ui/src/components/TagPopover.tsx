import * as React from 'react';
import Chip from '@material-ui/core/Chip';
import Popover from '@material-ui/core/Popover';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(0.5)
    },
    popover: {
      pointerEvents: 'none'
    },
    paper: {
      padding: theme.spacing(1)
    }
  });

type OwnProps = {
  label: string;
  popoverContent: JSX.Element;
};

type State = {
  anchorEl: EventTarget & Element | null;
};

type Props = OwnProps & WithStyles<typeof styles>;

class TagPopoverComponent extends React.Component<Props, State> {
  state = {
    anchorEl: null
  };

  handlePopoverOpen = (event: React.MouseEvent) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handlePopoverClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes, label, popoverContent } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <React.Fragment>
        <Chip
          className={classes.root}
          label={label}
          aria-owns={open ? 'mouse-over-popover' : undefined}
          aria-haspopup="true"
          onMouseEnter={this.handlePopoverOpen}
          onMouseLeave={this.handlePopoverClose}
        />
        <Popover
          id="mouse-over-popover"
          className={classes.popover}
          classes={{
            paper: classes.paper
          }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          onClose={this.handlePopoverClose}
        >
          {popoverContent}
        </Popover>
      </React.Fragment>
    );
  }
}

export const TagPopover = withStyles(styles)(TagPopoverComponent);
