import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { Footer } from '@pec/aion-ui-components/containers/Footer';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { VeriforceLogo } from '@pec/aion-ui-components/components/Nav/VeriforceLogo';

const styles = (theme: Theme) =>
  createStyles({
    offPaper: {
      '&, & a': {
        color: theme.palette.common.white
      },
      textAlign: 'center',
      marginTop: theme.spacing(3)
    },
    logo: {
      height: 65,
      width: 221
    },
    footer: {
      color: theme.palette.common.white,
      '& a': {
        color: '#e99842'
      }
    }
  });

type OwnProps = {
  title: string;
  textAlign?: string;
  contentMinHeight?: string;
};

type Props = WithStyles<typeof styles> & OwnProps;

const PageComponent: React.FC<Props> = ({ classes, children, title }) => (
  <GridContainer alignItems="center" justify="center">
    <Grid item xs={12} md={8} lg={6}>
      <GridContainer alignItems="center" justify="center">
        <Grid item xs={12} className={classes.offPaper}>
          <VeriforceLogo style={{ height: 97, width: 350 }} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" className={classes.offPaper}>
            {title}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Paper>{children}</Paper>
        </Grid>
        <Grid item xs={12}>
          <Footer typography={classes.footer} />
        </Grid>
      </GridContainer>
    </Grid>
  </GridContainer>
);

export const Page = withStyles(styles)(PageComponent);
