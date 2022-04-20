import * as React from 'react';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { LocationDescriptor } from 'history';

const useStyles = makeStyles(() =>
  createStyles({
    link: {
      display: 'flex',
      alignItems: 'center'
    }
  })
);

type Props = {
  linkTitle: string;
  to: LocationDescriptor;
};

export const BackTitleHeader: React.FC<Props> = ({ linkTitle, to, children }) => {
  const classes = useStyles();

  return (
    <Grid container spacing={0} wrap="nowrap">
      <Link to={to} title={linkTitle} className={classes.link}>
        <ArrowBackIosIcon color="primary" fontSize="small" />
      </Link>
      <Grid item xs={12} zeroMinWidth>
        <Typography variant="h6" component="h2" noWrap title={typeof children === 'string' ? children : undefined}>
          {children}
        </Typography>
      </Grid>
    </Grid>
  );
};
