import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { DeepReadonly } from 'ts-essentials';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { TabLink } from '@pec/aion-ui-components/components/TabLink';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { SelectedOperatorContainer } from 'features/contractor/containers/SelectedOperator';
import { Spring } from 'react-spring/renderprops.cjs';
import { withStyles, WithStyles } from '@material-ui/core/styles';

export const styles = () => ({
  header: {
    padding: '20px 12px !important',
    minHeight: 75
  },
  toolbar: {
    paddingLeft: 0,
    marginTop: -24
  },
  item: {
    display: 'flex'
  }
});

type RouteParams = {
  clientId?: string;
};

type OwnProps<T> = {
  item?: DeepReadonly<T> | null;
  title?: string;
  isFetching?: boolean;
  toolbarLinks?: { label: string; to: string }[];
  children?: (props: DeepReadonly<T>) => React.ReactNode;
};

type Props<T> = WithStyles<typeof styles> & OwnProps<T> & RouteComponentProps<RouteParams>;

export class HeaderComponent<T> extends React.Component<Props<T>> {
  render() {
    const {
      title,
      item,
      isFetching,
      toolbarLinks,
      classes,
      children,
      match: {
        params: { clientId }
      }
    } = this.props;

    return (
      <GridContainer justify="space-between">
        <Grid item className={classes.header}>
          {!isFetching && item && (
            <Spring from={{ opacity: 0 }} to={{ opacity: 1 }}>
              {props => (
                <Typography variant="h5" component="h2" style={props}>
                  {children && children(item)}
                </Typography>
              )}
            </Spring>
          )}

          {title && (
            <Typography variant="h5" component="h2">
              {title}
            </Typography>
          )}
        </Grid>
        {clientId && (
          <Grid item className={classes.item}>
            <Grid container justify="space-between" alignItems="center">
              <SelectedOperatorContainer />
            </Grid>
          </Grid>
        )}
        {toolbarLinks && (
          <Grid item xs={12}>
            <Toolbar className={classes.toolbar}>
              {toolbarLinks.map(({ label, to }) => (
                <TabLink key={to} label={label} to={to} />
              ))}
            </Toolbar>
          </Grid>
        )}
      </GridContainer>
    );
  }
}

export const Header = withStyles(styles)(withRouter(HeaderComponent)) as <T>(
  props: OwnProps<T>
) => React.ReactElement<OwnProps<T>>;
