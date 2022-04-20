import Grid from '@material-ui/core/Grid';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { IAnswer } from 'interfaces/answer';
import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  item: {
    padding: theme.spacing(1, 0)
  },
  title: {
    fontWeight: 500
  },
  description: {
    marginBottom: 0
  }
}));

type Props<T> = {
  id?: string;
  name?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  answer?: IAnswer;
  subForm?: boolean;
  component: React.ComponentType<Omit<T, 'title' | 'description' | 'component' | 'subForm'>>;
} & T;

export function FormFieldGrid<T>(props: React.PropsWithChildren<Props<T>>) {
  const classes = useStyles();
  const { title, description, component, subForm, ...rest } = props;
  const Component = component;

  return (
    <Grid container>
      {title && (
        <Grid item xs={12}>
          <Typography paragraph className={classes.title}>
            {title}
          </Typography>
        </Grid>
      )}
      {description && (
        <Grid item xs={12}>
          <Typography classes={{ paragraph: classes.description }}>{description}</Typography>
        </Grid>
      )}
      <Grid item xs={12} classes={!subForm ? { root: classes.item } : undefined}>
        <Component {...rest} />
      </Grid>
    </Grid>
  );
}
