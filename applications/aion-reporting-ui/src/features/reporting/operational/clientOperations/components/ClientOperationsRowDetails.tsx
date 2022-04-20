import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'utility-types';
import { IMappedMetric } from 'interfaces/mappedMetric';
import { useTranslation } from 'react-i18next';
import { localizeNumber } from '@pec/aion-ui-i18next/helpers/localize';

const styles = createStyles({
  root: {
    width: '100%',
    overflow: 'auto'
  },
  table: {
    minWidth: 700
  },
  tableCell: {
    textAlign: 'right'
  },
  noMetricsText: {
    padding: 24
  }
});

type OwnProps = {
  operationalMetrics: DeepReadonly<IMappedMetric[]>;
};

type Props = WithStyles<typeof styles> & OwnProps;

const ClientOperationsRowDetails: React.FC<Props> = ({ operationalMetrics, classes }) => {
  const { t } = useTranslation();

  return operationalMetrics.length ? (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableBody>
          {operationalMetrics.map(({ id, name, value }) => (
            <TableRow key={id}>
              <TableCell component="th" scope="row">
                {name}
              </TableCell>
              <TableCell className={classes.tableCell}>{value && localizeNumber(value, t)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  ) : (
    <Typography variant="subtitle1" className={classes.noMetricsText}>
      {t('reporting.operational.clientOperations.noMetricsReported', 'No metrics have been reported.')}
    </Typography>
  );
};

export const ClientOperationsRowDetailsComponent = withStyles(styles)(ClientOperationsRowDetails);
