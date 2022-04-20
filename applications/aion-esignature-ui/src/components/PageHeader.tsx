import * as React from 'react';
import {
  createStyles,
  Grid,
  Theme,
  Typography,
  withStyles,
  WithStyles
  } from '@material-ui/core';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';

const styles = (_theme: Theme) =>
  createStyles({
    buttonContainer: {
      textAlign: 'right'
    },
    title: {
      fontWeight: 500
    },
    titleNoBreadcrumbs: {
      fontWeight: 500
    }
  });

type OwnProps = {
  breadcrumbs?: JSX.Element;
  button?: JSX.Element;
  title: string;
};

type Props = WithStyles<typeof styles> & OwnProps;

const PageHeader: React.FC<OwnProps> = ({ breadcrumbs, classes, button, title }: Props) => (
  <GridContainer justify="space-between">
    {breadcrumbs && (
      <Grid item xs={12}>
        {breadcrumbs}
      </Grid>
    )}

    <Grid item>
      <Typography className={breadcrumbs ? classes.title : classes.titleNoBreadcrumbs} variant="h4">
        {title}
      </Typography>
    </Grid>
    {button && (
      <Grid item className={classes.buttonContainer}>
        {button}
      </Grid>
    )}
  </GridContainer>
);

export const PageHeaderComponent = withStyles(styles)(PageHeader);
