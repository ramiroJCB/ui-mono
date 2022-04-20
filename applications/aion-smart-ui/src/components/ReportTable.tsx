import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'utility-types';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { isWidthUp, withWidth, WithWidth } from '@material-ui/core';
import { IWorkerDetail } from 'interfaces/workerDetail';
import { ReportRow } from './ReportRow';
import { TablePagination } from '@pec/aion-ui-components/components/Table/TablePagination';
import { useTranslation } from 'react-i18next';

type OwnProps = {
  handleChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
  page: number;
  report: DeepReadonly<IWorkerDetail[]>;
  totalCount: number;
};

const styles = (theme: Theme) =>
  createStyles({
    paper: {
      padding: '12px 24px',
      position: 'sticky',
      top: 56,
      [theme.breakpoints.up('sm')]: { top: 64 },
      'z-index': 1
    }
  });

type Props = WithStyles<typeof styles> & OwnProps & WithWidth;

const ReportTable: React.FC<Props> = ({ report, handleChangePage, page, totalCount, classes, width }) => {
  const { t } = useTranslation();
  return (
    <GridContainer>
      <Grid item xs={12}>
        {report.length > 0 ? (
          <React.Fragment>
            <Paper square className={classes.paper} elevation={1}>
              <GridContainer spacing={0}>
                <Grid item xs={3}>
                  <Typography variant="subtitle1">{t('smart.common.firstName', 'First Name')}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="subtitle1">{t('smart.common.lastName', 'Last Name')}</Typography>
                </Grid>
                <Grid item xs={4} sm={3}>
                  <Typography variant="subtitle1">{t('smart.reportTable.company', 'Company')}</Typography>
                </Grid>
                {isWidthUp('sm', width) && (
                  <Grid item xs={2}>
                    <Typography variant="subtitle1">{t('smart.common.site', 'Site')}</Typography>
                  </Grid>
                )}
                <Grid item xs={2} sm={1}>
                  <Typography variant="subtitle1">{t('smart.reportTable.exposure', 'Exposure')}</Typography>
                </Grid>
              </GridContainer>
            </Paper>
            {report.map(workerDetail => (
              <ReportRow key={workerDetail.id} workerDetail={workerDetail} />
            ))}
            <TablePagination component="div" handleChangePage={handleChangePage} page={page} totalCount={totalCount} />
          </React.Fragment>
        ) : (
          <Paper className={classes.paper}>
            <Typography variant="subtitle1">
              {t('smart.reportTable.noRecordsMatch', 'No records match your search criteria.')}
            </Typography>
          </Paper>
        )}
      </Grid>
    </GridContainer>
  );
};

export const ReportTableComponent = withStyles(styles)(withWidth()(ReportTable));
