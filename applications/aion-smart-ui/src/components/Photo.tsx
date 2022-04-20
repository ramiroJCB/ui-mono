import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { SvgIconProps } from '@material-ui/core/SvgIcon';

type OwnProps = {
  primaryText: string;
  photoUrl?: string | null;
  icon?: React.ElementType<SvgIconProps>;
  map?: JSX.Element;
};

const iconFontSize = 120;

const styles = (theme: Theme) =>
  createStyles({
    photo: {
      backgroundColor: theme.palette.primary.main,
      '& > :first-child': {
        marginBottom: 20
      },
      paddingBottom: 20
    },
    caption: {
      color: 'white',
      marginLeft: 20,
      marginRight: 20
    },
    icon: {
      position: 'relative',
      left: '50%',
      color: 'white',
      fontSize: iconFontSize,
      margin: `0 0 20px -${iconFontSize / 2}px`,
      [theme.breakpoints.up('md')]: {
        marginTop: 30
      }
    }
  });

type State = {
  hasImgError: boolean;
};

type Props = WithStyles<typeof styles> & OwnProps;

class PhotoComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasImgError: false
    };
  }

  handleImgError = () => {
    this.setState({ hasImgError: true });
  };

  render() {
    const { photoUrl, primaryText, icon: Icon, classes, children, map } = this.props;
    return (
      <GridContainer spacing={0}>
        <Grid item xs={12} className={classes.photo}>
          {photoUrl && !this.state.hasImgError ? (
            <img src={photoUrl} alt={primaryText} width="100%" height="auto" onError={this.handleImgError} />
          ) : Icon ? (
            <Icon className={classes.icon} />
          ) : (
            map
          )}
          <Typography className={classes.caption} variant="h6">
            {primaryText}
          </Typography>
          <Typography variant="body2" className={classes.caption}>
            {children}
          </Typography>
        </Grid>
      </GridContainer>
    );
  }
}

export const Photo = withStyles(styles)(PhotoComponent);
