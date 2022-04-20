import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { AddTradeNameContainer } from 'features/contractor/tradeName/containers/AddTradeName';
import { AxiosError } from 'axios';
import { ConfirmDelete } from 'components/ConfirmDelete';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'utility-types';
import { deleteTradeNameSuccess } from 'features/contractor/tradeName/actions/deleteTradeName';
import { EditTradeNameContainer } from 'features/contractor/tradeName/containers/EditTradeName';
import { Error } from '@pec/aion-ui-components/components/Error';
import { HasPermissionContainer } from '@pec/aion-ui-components/containers/HasPermission';
import { ITradeName } from 'interfaces/tradeName';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      overflowX: 'auto'
    },
    gridItem: {
      padding: theme.spacing(4)
    },
    table: {
      minWidth: 500
    },
    tableCell: {
      padding: '4px 56px 4px 32px'
    },
    viewAsClient: {
      paddingBottom: theme.spacing(6),
      width: '100%',
      overflowX: 'auto'
    }
  });

type OwnProps = {
  error: DeepReadonly<AxiosError> | null;
  tradeNames: DeepReadonly<ITradeName[]>;
  deleteTradeName: (tradeNameId: string) => () => Promise<void>;
  deleteSuccess: (tradeNameId: string) => () => ReturnType<typeof deleteTradeNameSuccess>;
  viewAsClient: boolean;
};

type Props = OwnProps & WithStyles<typeof styles>;

const TradeNames: React.FC<Props> = ({ classes, error, tradeNames, deleteTradeName, deleteSuccess, viewAsClient }) => (
  <HasPermissionContainer>
    {({ hasOrganizationAssetPermission }) => (
      <Grid item xs={12} id="tradeNames">
        <Paper>
          <Grid container>
            <Grid item xs={12} className={classes.gridItem}>
              <Typography variant="h5">Trade Names</Typography>
              {hasOrganizationAssetPermission() && !viewAsClient && (
                <Typography variant="body1">
                  Use this space to list alternate names your company is known by (Trade Name, DBA, Abbreviation).
                </Typography>
              )}
            </Grid>
          </Grid>
          {tradeNames.length ? (
            <div className={viewAsClient ? classes.viewAsClient : classes.root}>
              <Table className={classes.table}>
                <colgroup>
                  <col style={{ width: '20%' }} />
                  <col style={{ width: '64%' }} />
                  <col style={{ width: '16%' }} />
                </colgroup>
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.tableCell}>Name</TableCell>
                    <TableCell>Description</TableCell>
                    {!viewAsClient && <TableCell />}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tradeNames.map(tradeName => (
                    <TableRow key={tradeName.id}>
                      <TableCell className={classes.tableCell}>{tradeName.name}</TableCell>
                      <TableCell>{tradeName.description}</TableCell>
                      {hasOrganizationAssetPermission() && !viewAsClient && (
                        <TableCell align="right">
                          <EditTradeNameContainer initialValues={{ ...tradeName }} />
                          <ConfirmDelete
                            message={`Are you sure you'd like to remove ${tradeName.name}?`}
                            handleDelete={deleteTradeName(tradeName.id)}
                            deleteSuccess={deleteSuccess(tradeName.id)}
                          />
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : error ? (
            <Error message="There was an error processing your request." />
          ) : null}

          {hasOrganizationAssetPermission() && !viewAsClient && (
            <Grid container>
              <Grid item xs={12} className={classes.gridItem}>
                {tradeNames.length < 5 ? (
                  <AddTradeNameContainer />
                ) : (
                  <Typography variant="body1" color="error">
                    Trade name amount of 5 has been exceeded.
                  </Typography>
                )}
              </Grid>
            </Grid>
          )}
        </Paper>
      </Grid>
    )}
  </HasPermissionContainer>
);

export const TradeNamesComponent = withStyles(styles)(TradeNames);
