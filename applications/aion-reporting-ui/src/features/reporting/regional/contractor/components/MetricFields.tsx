import * as React from 'react';
import TableCell from '@material-ui/core/TableCell';
import { BooleanMetricField } from './BooleanMetricField';
import { BooleanMetricValue, MetricValueType } from 'interfaces/metricValue';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { DisplayPeriodStatus, IContractorPeriod } from 'interfaces/contractorPeriod';
import { DoubleMetricField } from './DoubleMetricField';
import { IMappedMetric } from 'interfaces/mappedMetric';
import { WrappedFieldArrayProps } from 'redux-form';

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
      '& p': {
        display: 'none'
      }
    }
  });

export type OwnProps = {
  isFetching: boolean;
  status: DisplayPeriodStatus;
  selectedPeriod: IContractorPeriod;
  confirmDoubleMetricValueChange: (metric: IMappedMetric, reset: () => void) => void;
  handleChange: (
    metric: IMappedMetric
  ) => (event: React.ChangeEvent<HTMLInputElement>, value: BooleanMetricValue) => void;
  metricValueIdToggle?: string;
};

type Props = WithStyles<typeof styles> & WrappedFieldArrayProps<IMappedMetric> & OwnProps;

const MetricFields: React.FC<Props> = ({
  classes,
  isFetching,
  fields,
  status,
  selectedPeriod: { endDate, gracePeriodMillis },
  confirmDoubleMetricValueChange,
  handleChange,
  metricValueIdToggle
}) => (
  <React.Fragment>
    {fields.map((name, index, fields) => {
      const metric = fields.get(index);
      return metric.valueType === MetricValueType.Boolean ? (
        <TableCell key={index} size="small" className={classes.cell} style={{ textAlign: 'center' }}>
          <BooleanMetricField
            isFetching={isFetching}
            name={`${name}.value`}
            metric={metric}
            status={status}
            endDate={endDate}
            gracePeriodMillis={gracePeriodMillis}
            handleChange={handleChange}
            metricValueIdToggle={metricValueIdToggle}
          />
        </TableCell>
      ) : (
        <TableCell key={index} size="small" className={classes.cell}>
          {metric.isHidden !== true && (
            <DoubleMetricField
              isFetching={isFetching}
              name={`${name}.value`}
              metric={metric}
              status={status}
              endDate={endDate}
              gracePeriodMillis={gracePeriodMillis}
              confirmMetricValueChange={confirmDoubleMetricValueChange}
            />
          )}
        </TableCell>
      );
    })}
  </React.Fragment>
);

export const MetricFieldsComponent = withStyles(styles)(MetricFields);
