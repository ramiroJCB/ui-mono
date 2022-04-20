import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import MuiDrawer from '@material-ui/core/Drawer';
import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  item: {
    padding: theme.spacing(2)
  },
  paper: {
    width: '100%'
  },
  button: {
    padding: 0
  }
}));

type Props = {
  buttonTitle?: string;
  icon?: JSX.Element;
  title?: string;
};

export const Drawer: React.FC<Props> = ({ buttonTitle, icon, title, children }) => {
  const { button, item, ...classes } = useStyles();
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  return (
    <React.Fragment>
      {buttonTitle ? (
        <Button fullWidth color="primary" onClick={handleOpen}>
          <React.Fragment>
            {buttonTitle}
            {icon}
          </React.Fragment>
        </Button>
      ) : (
        <IconButton color="primary" onClick={handleOpen} className={button}>
          <InfoOutlinedIcon />
        </IconButton>
      )}
      <MuiDrawer anchor="right" open={open} onClose={handleClose} classes={classes}>
        <Grid container justify={title ? 'space-between' : 'flex-end'} alignItems="center">
          {title && (
            <Grid item classes={{ root: item }}>
              <Typography variant="h6">{title}</Typography>
            </Grid>
          )}
          <Grid item classes={{ root: item }}>
            <Button onClick={handleClose}>Close</Button>
          </Grid>
          <Grid item xs={12}>
            {children}
          </Grid>
        </Grid>
      </MuiDrawer>
    </React.Fragment>
  );
};
