import * as React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { BooleanMetricValue } from 'interfaces/metricValue';
import { DisplayPeriodStatus, IContractorPeriod } from 'interfaces/contractorPeriod';
import { FieldArray, GenericFieldArray, WrappedFieldArrayProps } from 'redux-form';
import { IMappedMetric } from 'interfaces/mappedMetric';
import { IRegion } from 'interfaces/region';
import { IRegionalMetric } from 'interfaces/regionalMetric';
import { MetricFieldsComponent } from './MetricFields';
import { OwnProps as FieldArrayCustomProps } from './MetricFields';
import { withStyles, WithStyles } from '@material-ui/core/styles';

const styles = () => ({
  cell: {
    verticalAlign: 'bottom'
  }
});

export type OwnProps = {
  isFetching: boolean;
  status: DisplayPeriodStatus;
  selectedPeriod: IContractorPeriod;
  updateBooleanMetricValue: (metric: IMappedMetric) => void;
  confirmDoubleMetricValueChange: (metric: IMappedMetric, reset: () => void) => void;
};

type Props = WithStyles<typeof styles> & WrappedFieldArrayProps<IRegion> & OwnProps;

const FieldArrayCustom = FieldArray as new () => GenericFieldArray<IRegionalMetric, FieldArrayCustomProps>;

const RegionFields: React.FC<Props> = ({
  classes,
  fields,
  isFetching,
  status,
  updateBooleanMetricValue,
  confirmDoubleMetricValueChange,
  selectedPeriod
}) => {
  const [metricValueIdToggle, setMetricValueIdToggle] = React.useState<string>();
  const handleChange = (metric: IMappedMetric) => (
    _event: React.ChangeEvent<HTMLInputElement>,
    value: BooleanMetricValue
  ) => {
    updateBooleanMetricValue({ ...metric, value });
    setMetricValueIdToggle(metric.metricValueId);
  };

  return (
    <React.Fragment>
      {fields.map((region, index) => (
        <TableRow key={index}>
          <TableCell component="th" scope="row" className={classes.cell}>
            {fields.get(index).name}
          </TableCell>
          <FieldArrayCustom
            isFetching={isFetching}
            name={`${region}.metrics`}
            component={MetricFieldsComponent}
            status={status}
            handleChange={handleChange}
            confirmDoubleMetricValueChange={confirmDoubleMetricValueChange}
            selectedPeriod={selectedPeriod}
            metricValueIdToggle={metricValueIdToggle}
          />
        </TableRow>
      ))}
    </React.Fragment>
  );
};

export const RegionFieldsComponent = withStyles(styles)(RegionFields);
