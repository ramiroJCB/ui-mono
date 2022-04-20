import * as React from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup, { RadioGroupProps } from '@material-ui/core/RadioGroup';
import Typography from '@material-ui/core/Typography';
import { FormControlProps } from '@material-ui/core/FormControl';
import { IIncidentCategory } from 'interfaces/incidentCategory';
import { IIncidentRegion } from 'interfaces/incidentRegion';
import { IIncidentRootCause } from 'interfaces/incidentRootCause';
import { IIncidentType } from 'interfaces/incidentType';
import { IIncidentWorkGroup } from 'interfaces/incidentWorkGroup';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { WrappedFieldProps } from 'redux-form';

const styles = (theme: Theme) => ({
  formControl: {
    display: 'block'
  },
  formControlLabel: {
    alignItems: 'flex-start',
    margin: `${theme.spacing(1)}px 0`,
    [theme.breakpoints.up('lg')]: {
      flexBasis: '50%',
      maxWidth: '50%'
    }
  }
});

export type OwnProps = {
  options: Array<IIncidentCategory | IIncidentType | IIncidentRootCause | IIncidentRegion | IIncidentWorkGroup>;
};

export type Props = WithStyles<typeof styles> & RadioGroupProps & FormControlProps & WrappedFieldProps & OwnProps;

const IncidentRadioFieldComponent: React.FC<Props> = ({ classes, meta, input, options, ...props }) => (
  <FormControl className={classes.formControl}>
    <RadioGroup {...input} {...props} row>
      {options.map(({ id, name, description }) => (
        <FormControlLabel
          key={id}
          value={id}
          control={<Radio checked={input.value === id} />}
          label={
            <React.Fragment>
              <Typography variant="body1">{name}</Typography>
              {description && <Typography>{description}</Typography>}
            </React.Fragment>
          }
          className={classes.formControlLabel}
        />
      ))}
    </RadioGroup>
  </FormControl>
);

export const IncidentRadioField = withStyles(styles)(IncidentRadioFieldComponent);
