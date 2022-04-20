import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

export const ErrorButton = withStyles(theme => ({
  root: {
    color: theme.palette.error.main
  },
  contained: {
    color: theme.palette.error.contrastText,
    background: theme.palette.error.main,
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
      '@media (hover: none)': {
        backgroundColor: theme.palette.error.main
      }
    }
  }
}))(Button);
