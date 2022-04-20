import * as React from 'react';
import { DisplayPeriodStatus } from 'interfaces/contractorPeriod';
import { IMappedMetric } from 'interfaces/mappedMetric';
import { Props as TextFieldProps, TextField } from '@pec/aion-ui-deprecated/components/TextField';
import { StandardTextFieldProps } from '@material-ui/core/TextField';
import { beforeGracePeriod } from 'helpers';
import { blur, Field, GenericField } from 'redux-form';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { required } from '@pec/aion-ui-core/validators';

const { LatePost, Posted } = DisplayPeriodStatus;

const styles = () =>
  createStyles({
    field: {
      marginBottom: -1,
      '& input': {
        textAlign: 'right'
      },
      // Hide browser-native up/down arrows
      '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
        '-webkit-appearance': 'none',
        margin: 0
      },
      '& input[type=number]': {
        '-moz-appearance': 'textfield' /* Firefox */
      }
    }
  });

type ComponentOwnProps = {
  isFetching: boolean;
  metric: IMappedMetric;
  status: DisplayPeriodStatus;
  endDate: string;
  gracePeriodMillis: number;
  confirmMetricValueChange: (metric: IMappedMetric, reset: () => void) => void;
};

class DoubleMetricFieldComponent extends React.Component<TextFieldProps & ComponentOwnProps> {
  handleBlur = () => {
    const {
      confirmMetricValueChange,
      input: { name, value: inputValue },
      meta: { dispatch, form, initial },
      metric
    } = this.props;

    const value = inputValue === '' ? null : Number(inputValue);

    if (value !== initial) {
      confirmMetricValueChange({ ...metric, value }, () => dispatch(blur(form, name, initial)));
    }
  };

  render() {
    const { metric, status, endDate, gracePeriodMillis, confirmMetricValueChange, isFetching, ...props } = this.props;

    return (
      <TextField
        {...props}
        type="number"
        onBlur={this.handleBlur}
        disabled={
          status === LatePost || (status === Posted && !beforeGracePeriod(endDate, gracePeriodMillis)) || isFetching
        }
        fullWidth
      />
    );
  }
}

type FieldCustomOwnProps = {
  name: string;
};

const FieldCustom = Field as new () => GenericField<
  Pick<StandardTextFieldProps, Exclude<keyof StandardTextFieldProps, 'component'>>
>;

const DoubleMetricFieldClass: React.FC<WithStyles<typeof styles> & FieldCustomOwnProps & ComponentOwnProps> = ({
  classes,
  ...props
}) => (
  <FieldCustom
    validate={props.metric.isRequired ? required : undefined}
    className={classes.field}
    component={DoubleMetricFieldComponent}
    {...props}
  />
);

export const DoubleMetricField = withStyles(styles)(DoubleMetricFieldClass);
