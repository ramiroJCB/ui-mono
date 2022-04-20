import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';

const styles = (theme: Theme) =>
  createStyles({
    artboard: {
      background: theme.palette.action.disabled,
      borderRadius: theme.shape.borderRadius,
      textAlign: 'center'
    }
  });

type RenderProps = {
  pageWidth?: number;
  pageHeight?: number;
};

type OwnProps = {
  children: (props: RenderProps) => React.ReactNode;
};

type Props = WithStyles<typeof styles> & OwnProps;

class Component extends React.Component<Props, RenderProps> {
  artboardDivRef: HTMLDivElement | null;

  constructor(props: Props) {
    super(props);
    this.artboardDivRef = null;
    this.state = {
      pageWidth: undefined,
      pageHeight: undefined
    };
  }

  componentDidMount() {
    this.handleResizeWindow();
    window.addEventListener('resize', this.handleResizeWindow, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResizeWindow);
  }

  handleResizeWindow = () => {
    if (this.artboardDivRef) {
      const { width, height } = this.artboardDivRef.getBoundingClientRect();

      this.setState({
        pageWidth: width,
        pageHeight: height
      });
    }
  };

  render() {
    const { classes, children } = this.props;
    const { pageWidth, pageHeight } = this.state;

    return (
      <Grid item xs={12} className={classes.artboard}>
        <div ref={ref => (this.artboardDivRef = ref)}>{children({ pageWidth, pageHeight })}</div>
      </Grid>
    );
  }
}

export const Artboard = withStyles(styles)(Component);
