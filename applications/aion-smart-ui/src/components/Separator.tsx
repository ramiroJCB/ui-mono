import * as React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    line: { height: 1, width: 40, color: theme.palette.text.secondary },
    text: { textAlign: 'center', fontSize: 12, color: theme.palette.text.secondary }
  })
);

export const SeparatorComponent: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <Grid container spacing={1} direction="row" justify="center">
      <Grid item xs={2}>
        <hr className={classes.line} />
      </Grid>
      <Grid item xs={1} className={classes.text}>
        <span>{t('smart.separator.or', ' or ')}</span>
      </Grid>
      <Grid item xs={2}>
        <hr className={classes.line} />
      </Grid>
    </Grid>
  );
};
