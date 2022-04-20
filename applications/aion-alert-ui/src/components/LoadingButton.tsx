import * as React from 'react';
import MUIButton, { ButtonProps } from '@material-ui/core/Button';
import { Theme, withStyles } from '@material-ui/core/styles';

type OwnProps = {
  isSubmitting: boolean;
};

type Props = OwnProps & ButtonProps;

const styles = (theme: Theme) => ({
  root: {
    '&:disabled': {
      backgroundColor: theme.palette.secondary.main
    }
  },
  label: {
    color: theme.palette.common.white
  }
});

const LoadingButtonComponent = ({ isSubmitting, children, ...props }: Props) => (
  <MUIButton {...props} classes={isSubmitting ? props.classes : {}}>
    {children}
  </MUIButton>
);

export const LoadingButton = withStyles(styles)(LoadingButtonComponent);
