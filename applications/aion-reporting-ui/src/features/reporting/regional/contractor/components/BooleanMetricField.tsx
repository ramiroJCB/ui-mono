import * as React from 'react';
import MaterialUICircularProgress from '@material-ui/core/CircularProgress';
import Switch, { SwitchProps } from '@material-ui/core/Switch';
import { beforeGracePeriod } from 'helpers';
import { BooleanMetricValue } from 'interfaces/metricValue';
import { DisplayPeriodStatus } from 'interfaces/contractorPeriod';
import { Field, GenericField, WrappedFieldProps } from 'redux-form';
import { IMappedMetric } from 'interfaces/mappedMetric';

const { True, False } = BooleanMetricValue;
const { LatePost, Posted } = DisplayPeriodStatus;

const normalizeBoolean = (value: boolean) => (value ? True : False);

type ComponentOwnProps = {
  status: DisplayPeriodStatus;
  endDate: string;
  gracePeriodMillis: number;
  isFetching: boolean;
};

const BooleanMetricFieldComponent: React.FC<SwitchProps & WrappedFieldProps & ComponentOwnProps> = ({
  input: { value, ...input },
  status,
  endDate,
  gracePeriodMillis,
  isFetching,
  ...props
}) => (
  <Switch
    {...input}
    {...props}
    checked={value === True}
    disabled={
      status === LatePost || (status === Posted && !beforeGracePeriod(endDate, gracePeriodMillis)) || isFetching
    }
  />
);

type FieldCustomOwnProps = {
  isFetching: boolean;
  name: string;
  metric: IMappedMetric;
  handleChange: (
    metric: IMappedMetric
  ) => (event: React.ChangeEvent<HTMLInputElement>, value: BooleanMetricValue) => void;
  metricValueIdToggle?: string;
};

const FieldCustom = Field as new () => GenericField<
  Pick<SwitchProps, Exclude<keyof SwitchProps, 'component' | 'onChange'>> & ComponentOwnProps
>;

export class BooleanMetricField extends React.Component<FieldCustomOwnProps & ComponentOwnProps> {
  render() {
    const { handleChange, isFetching, metricValueIdToggle, ...props } = this.props;

    return isFetching && metricValueIdToggle === props.metric.metricValueId ? (
      <MaterialUICircularProgress size={32} />
    ) : (
      <FieldCustom
        component={BooleanMetricFieldComponent}
        onChange={handleChange(props.metric)}
        normalize={normalizeBoolean}
        isFetching={isFetching}
        {...props}
      />
    );
  }
}
