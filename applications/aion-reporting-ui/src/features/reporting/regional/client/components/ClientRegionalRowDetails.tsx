import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { BooleanMetricValue, MetricValueType } from 'interfaces/metricValue';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'utility-types';
import { IMappedRegionMetrics } from 'interfaces/mappedRegionMetrics';
import { IRegionalChangeLogEntry } from 'interfaces/regionalChangeLogEntry';
import { useTranslation } from 'react-i18next';
import { localizeDate, localizeNumber } from '@pec/aion-ui-i18next/helpers/localize';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      borderRadius: 0,
      width: '100%',
      overflow: 'auto'
    },
    tableContainer: {
      overflow: 'auto'
    },
    table: {
      borderTop: `1px solid ${theme.palette.divider}`,
      borderBottom: `1px solid ${theme.palette.divider}`,
      minWidth: 700,
      '& tbody tr:nth-child(odd)': {
        backgroundColor: theme.palette.grey[100]
      },
      '& th, & td': {
        borderBottom: 'none',
        '&:not(:first-child)': {
          borderLeft: `1px solid ${theme.palette.divider}`
        }
      }
    },
    locationCell: {
      paddingRight: theme.spacing(2)
    },
    noMetricsText: {
      padding: 24
    },
    changeLog: {
      padding: theme.spacing(3)
    },
    changeLogEntry: {
      display: 'flex',
      justifyContent: 'flex-start',
      padding: `${theme.spacing(2)}px 0px`,
      '&:not(:first-of-type)': {
        borderTop: `1px solid ${theme.palette.divider}`
      }
    }
  });

type OwnProps = {
  regionalChangeLog: DeepReadonly<IRegionalChangeLogEntry[]> | null;
  regionMetrics: DeepReadonly<IMappedRegionMetrics[]>;
  showTotal: boolean;
};

type Props = WithStyles<typeof styles> & OwnProps;

const ClientRegionalRowDetails: React.FC<Props> = ({ regionalChangeLog, regionMetrics, classes, showTotal }) => {
  const { t } = useTranslation();

  return regionMetrics.length ? (
    <Paper className={classes.root}>
      <div className={classes.tableContainer}>
        <Table className={classes.table} size="small">
          <TableHead>
            <TableRow>
              <TableCell style={{ paddingRight: 16 }}>{t('reporting.common.location', 'Location')}</TableCell>
              {regionMetrics[0].metrics.map(
                ({ id: metricId, name: metricName, valueType, doesUnlockRow }) =>
                  !doesUnlockRow && (
                    <TableCell
                      key={metricId}
                      style={{ textAlign: valueType === MetricValueType.Boolean ? 'center' : 'right' }}
                    >
                      {metricName}
                    </TableCell>
                  )
              )}
              {showTotal && <TableCell align="right">{t('reporting.common.total', 'Total')}</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {regionMetrics.map(({ id: regionId, name: regionName, metrics }) => (
              <TableRow key={regionId}>
                <TableCell component="th" scope="row" className={classes.locationCell}>
                  {regionName}
                </TableCell>
                {metrics[0].doesUnlockRow &&
                (metrics[0].value === BooleanMetricValue.False || metrics[0].value === null) ? (
                  <TableCell colSpan={metrics.length - 1}>
                    {t('reporting.regional.client.workNotPerformed', 'Work Not Performed')}
                  </TableCell>
                ) : (
                  metrics.map(
                    ({ id, value, doesUnlockRow }) =>
                      !doesUnlockRow && (
                        <TableCell key={id}>
                          {value !== undefined && value !== null && localizeNumber(value, t)}
                        </TableCell>
                      )
                  )
                )}
                {showTotal && (
                  <TableCell component="th" scope="row" align="right">
                    {localizeNumber(
                      metrics.reduce((a, { value }) => a + (typeof value === 'number' ? value : 0), 0),
                      t
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {regionalChangeLog && regionalChangeLog.length > 0 && (
        <div className={classes.changeLog}>
          <Typography gutterBottom variant="subtitle2">
            {t('reporting.regional.client.edits', 'Edits')}
          </Typography>
          {regionalChangeLog.map(cl => {
            return (
              <div key={cl.id} className={classes.changeLogEntry}>
                <Typography variant="caption">{localizeDate(cl.createdDateUtc, t)}</Typography>
                <div style={{ marginLeft: 24 }}>
                  <Typography gutterBottom variant="caption" style={{ color: '#0288d1' }}>
                    {cl.createdByUserFullName}
                  </Typography>
                  <Typography variant="body2">&ldquo; {cl.description} &rdquo;</Typography>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Paper>
  ) : (
    <Typography variant="subtitle1" className={classes.noMetricsText}>
      {t('reporting.regional.client.noFlexTrackInformationReported', 'No FlexTrack information has been reported.')}
    </Typography>
  );
};

export const ClientRegionalRowDetailsComponent = withStyles(styles)(ClientRegionalRowDetails);
