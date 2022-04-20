import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { DisplayPeriodStatus } from 'interfaces/contractorPeriod';
import { FieldArray, GenericFieldArray } from 'redux-form';
import { IMappedOperationalMetric } from 'interfaces/mappedOperationalMetric';
import { OperationalMetricFieldsComponent, OwnProps as FieldArrayCustomProps } from './MetricFields';
import { useTranslation } from 'react-i18next';

const styles = () =>
  createStyles({
    root: {
      width: '100%',
      overflow: 'auto',
      paddingBottom: 24
    },
    table: {
      minWidth: 700
    },
    tableCellNumeric: {
      textAlign: 'right',
      padding: '4px 24px'
    }
  });

type OwnProps = {
  mappedMetrics: IMappedOperationalMetric[];
  status: DisplayPeriodStatus;
  onSubmit: (metric: IMappedOperationalMetric) => void;
};

type Props = WithStyles<typeof styles> & OwnProps;

const FieldArrayCustom = FieldArray as new () => GenericFieldArray<IMappedOperationalMetric, FieldArrayCustomProps>;

const ContractorOperationsTable: React.FC<Props> = ({ classes, status, onSubmit }) => {
  const { t } = useTranslation();

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>{t('reporting.operational.contractorOperations.metric', 'Metric')}</TableCell>
            <TableCell className={classes.tableCellNumeric}>
              {t('reporting.operational.contractorOperations.value', 'Value')}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <FieldArrayCustom
            name="operationalMetrics"
            component={OperationalMetricFieldsComponent}
            status={status}
            onSubmit={onSubmit}
          />
        </TableBody>
      </Table>
    </Paper>
  );
};

export const ContractorOperationsTableComponent = withStyles(styles)(ContractorOperationsTable);
