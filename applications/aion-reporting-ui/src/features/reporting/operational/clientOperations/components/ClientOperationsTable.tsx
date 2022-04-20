import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { ClientOperationsRowComponent } from './ClientOperationsRow';
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
};

type Props = WithStyles<typeof styles> & OwnProps;

const ClientOperationsTable: React.FC<Props> = ({ classes, contractors, handleChangePage, page, totalCount }) => {
  const { t } = useTranslation();

  return (
    <GridContainer>
      <Grid item xs={12}>
        <Paper className={classes.paper} square elevation={1}>
          <GridContainer spacing={0} justify="space-between">
            <Grid item xs={4}>
              <Typography variant="subtitle1">{t('reporting.common.contractor', 'Contractor')}</Typography>
            </Grid>
          </GridContainer>
        </Paper>
        {contractors.length ? (
          contractors.map(contractor => <ClientOperationsRowComponent key={contractor.id} contractor={contractor} />)
        ) : (
          <Paper className={classes.paper} square elevation={1}>
            <GridContainer justify="center">
              <Typography variant="subtitle1">
                {t('reporting.operational.clientOperations.noContractorsFound', 'No contractors have been found.')}
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

export const ClientOperationsTableComponent = withStyles(styles)(ClientOperationsTable);
