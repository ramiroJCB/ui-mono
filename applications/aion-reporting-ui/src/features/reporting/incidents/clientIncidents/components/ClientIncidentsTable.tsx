import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { ClientIncidentsRowComponent } from './ClientIncidentsRow';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'utility-types';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IIncident } from 'interfaces/incident';
import { TablePagination } from '@pec/aion-ui-components/components/Table/TablePagination';
import { useTranslation } from 'react-i18next';

const styles = (theme: Theme) =>
  createStyles({
    paper: {
      padding: '12px 24px',
      position: 'sticky',
      top: 0,
      'z-index': 1,
      [theme.breakpoints.up('md')]: {
        top: 64
      }
    }
  });

type OwnProps = {
  incidents: DeepReadonly<IIncident[]>;
  page: number;
  totalCount: number;
  handleChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
};

type Props = WithStyles<typeof styles> & OwnProps;

const ClientIncidentsTable: React.FC<Props> = ({ classes, incidents, handleChangePage, page, totalCount }) => {
  const { t } = useTranslation();

  return (
    <GridContainer>
      <Grid item xs={12}>
        <Paper className={classes.paper} square elevation={1}>
          <GridContainer spacing={3} justify="space-between" style={{ paddingRight: 32, paddingLeft: 0 }}>
            <Grid item xs={2}>
              <Typography variant="subtitle2">{t('reporting.common.common', 'Occurred')}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="subtitle2">{t('reporting.common.contractor', 'Contractor')}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="subtitle2">{t('reporting.common.behaviorCategory', 'Behavior Category')}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="subtitle2">{t('reporting.common.classification', 'Classification')}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="subtitle2">{t('reporting.common.rootCause', 'Root Cause')}</Typography>
            </Grid>
          </GridContainer>
        </Paper>
        {incidents.length ? (
          incidents.map(incident => <ClientIncidentsRowComponent key={incident.id} incident={incident} />)
        ) : (
          <Paper className={classes.paper} square elevation={1}>
            <GridContainer justify="center">
              <Typography variant="subtitle2">
                {t(
                  'reporting.incidents.clientIncidents.noReportedIncidentsFound',
                  'No reported incidents have been found.'
                )}
              </Typography>
            </GridContainer>
          </Paper>
        )}
        <Table>
          <TableBody>
            <TableRow>
              <TablePagination
                handleChangePage={handleChangePage}
                page={page}
                totalCount={totalCount}
                rowsPerPage={10}
              />
            </TableRow>
          </TableBody>
        </Table>
      </Grid>
    </GridContainer>
  );
};

export const ClientIncidentsTableComponent = withStyles(styles)(ClientIncidentsTable);
