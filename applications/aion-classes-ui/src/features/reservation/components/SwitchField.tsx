import * as React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch, { SwitchProps } from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import { FieldRenderProps } from 'react-final-form';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';

const styles = (theme: Theme) => ({
  caption: {
    color: theme.palette.text.secondary,
    lineHeight: 1
  },
  label: {
    fontSize: theme.typography.pxToRem(16)
  },
  switchBase: {
    height: 40
  }
});

export type OwnProps = {
  checkedValue: boolean;
  label?: string;
};

export type Props = SwitchProps & FieldRenderProps<any, HTMLButtonElement> & WithStyles<typeof styles> & OwnProps;

const SwitchFieldComponent: React.FC<Props> = ({
  checkedValue,
  input: { value, checked, ...input },
  label,
  classes: { label: labelClass, switchBase, caption },
  ...props
}) => (
  <React.Fragment>
    {label && (
      <Typography variant="caption" className={caption}>
        {label}
      </Typography>
    )}
    <FormControlLabel
      classes={{ label: labelClass }}
      control={<Switch classes={{ switchBase }} checked={checkedValue} {...input} {...props} />}
      label={value}
    />
  </React.Fragment>
);

export const SwitchField = withStyles(styles)(SwitchFieldComponent);
