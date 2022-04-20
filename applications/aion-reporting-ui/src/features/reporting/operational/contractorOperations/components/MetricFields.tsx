import * as React from 'react';
import RadioField, { OwnProps as RadioFieldProps } from './RadioField';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { DisplayPeriodStatus } from 'interfaces/contractorPeriod';
import { Field, GenericField, WrappedFieldArrayProps } from 'redux-form';
import { IMappedOperationalMetric } from 'interfaces/mappedOperationalMetric';
import { MetricValueType } from 'interfaces/metricValue';
import { StandardTextFieldProps } from '@material-ui/core/TextField';
import { TextField } from '@pec/aion-ui-deprecated/components/TextField';
const { LatePost } = DisplayPeriodStatus;

const styles = () =>
  createStyles({
    cell: {
      paddingBottom: 0,
      verticalAlign: 'bottom',
      '& fieldset': {
        borderRadius: 0
      }
    },
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
    },
    tableCellNumeric: {
      textAlign: 'right',
      padding: '4px 24px'
    }
  });

export type OwnProps = {
  status: DisplayPeriodStatus;
  onSubmit: (metric: IMappedOperationalMetric) => void;
};

type Props = WithStyles<typeof styles> & WrappedFieldArrayProps<IMappedOperationalMetric> & OwnProps;

class MetricFields extends React.Component<Props> {
  handleBlur = (index: number) => (_event: React.FocusEvent<HTMLInputElement>, value: number | null) => {
    const { onSubmit, fields } = this.props;
    const metric = fields.get(index);

    onSubmit({ ...metric, value });
  };

  handleChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const { onSubmit, fields } = this.props;
    const metric = fields.get(index);
    const value = event.target.value.length ? parseInt(event.target.value, 10) : null;

    onSubmit({ ...metric, value });
  };

  render() {
    const { classes, fields, status } = this.props;

    const FieldCustom = Field as new () => GenericField<
      Pick<StandardTextFieldProps, Exclude<keyof StandardTextFieldProps, 'onBlur'>>
    >;
    const RadioFieldCustom = Field as new () => GenericField<RadioFieldProps>;

    const formatRadioValue = (value: number | null) => {
      return value === null ? '' : value.toString();
    };

    const parseRadioValue = (value: string) => {
      return value === '' ? null : parseInt(value, 10);
    };

    return (
      <React.Fragment>
        {fields.map((metric, index) => (
          <TableRow key={index}>
            <TableCell>{fields.get(index).name}</TableCell>
            <TableCell className={classes.tableCellNumeric}>
              {fields.get(index).valueType === MetricValueType.Boolean ? (
                <RadioFieldCustom
                  name={`${metric}.value`}
                  component={RadioField}
                  onChange={this.handleChange(index)}
                  isLatePost={status === LatePost}
                  format={formatRadioValue}
                  parse={parseRadioValue}
                />
              ) : (
                <FieldCustom
                  className={classes.field}
                  name={`${metric}.value`}
                  component={TextField}
                  type="number"
                  disabled={status === LatePost}
                  onBlur={this.handleBlur(index)}
                />
              )}
            </TableCell>
          </TableRow>
        ))}
      </React.Fragment>
    );
  }
}

export const OperationalMetricFieldsComponent = withStyles(styles)(MetricFields);
