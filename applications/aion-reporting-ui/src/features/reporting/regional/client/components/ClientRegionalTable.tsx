import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { ClientRegionalRowComponent } from './ClientRegionalRow';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'utility-types';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IMetricContractor } from 'interfaces/metricContractor';
import { TablePagination } from '@pec/aion-ui-components/components/Table/TablePagination';
import { useTranslation } from 'react-i18next';

const styles = () =>
  createStyles({
    paper: {
      padding: '12px 24px',
      position: 'sticky',
      top: 0,
      'z-index': 1
    }
  });

type OwnProps = {
  contractors: DeepReadonly<IMetricContractor[]>;
  page: number;
  totalCount: number;
  handleChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
  showTotal: boolean;
};

type Props = WithStyles<typeof styles> & OwnProps;

const ClientRegionalTable: React.FC<Props> = ({
  classes,
  contractors,
  handleChangePage,
  page,
  totalCount,
  showTotal
}) => {
  const { t } = useTranslation();

  return (
    <GridContainer>
      <Grid item xs={12}>
        <Paper className={classes.paper} square elevation={1}>
          <GridContainer spacing={0} justify="space-between">
            <Grid item xs={4}>
              <Typography variant="subtitle1">{t('reporting.common.contractor', 'Contractor')}</Typography>
            </Grid>
            {showTotal && (
              <Grid item xs={2}>
                <Typography variant="subtitle1" align="right">
                  {t('reporting.common.total', 'Total')}
                </Typography>
              </Grid>
            )}
          </GridContainer>
        </Paper>
        {contractors.map(contractor => (
          <ClientRegionalRowComponent key={contractor.id} contractor={contractor} showTotal={showTotal} />
        ))}
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

export const ClientRegionalTableComponent = withStyles(styles)(ClientRegionalTable);
