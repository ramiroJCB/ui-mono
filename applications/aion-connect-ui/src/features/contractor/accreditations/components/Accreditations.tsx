import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { AddAccreditationContainer } from 'features/contractor/accreditation/containers/AddAccreditation';
import { AxiosError } from 'axios';
import { ConfirmDelete } from 'components/ConfirmDelete';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'utility-types';
import { deleteAccreditationSuccess } from 'features/contractor/accreditation/actions/deleteAccreditation';
import { EditAccreditationContainer } from 'features/contractor/accreditation/containers/EditAccreditation';
import { Error } from '@pec/aion-ui-components/components/Error';
import { HasPermissionContainer } from '@pec/aion-ui-components/containers/HasPermission';

import { IAccreditation } from 'interfaces/accreditation';

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
  accreditations: DeepReadonly<IAccreditation[]>;
  deleteAccreditation: (accreditationId: string) => () => Promise<void>;
  deleteSuccess: (accreditationId: string) => () => ReturnType<typeof deleteAccreditationSuccess>;
  viewAsClient: boolean;
};

type Props = OwnProps & WithStyles<typeof styles>;

const Accreditations: React.FC<Props> = ({
  classes,
  error,
  accreditations,
  deleteAccreditation,
  deleteSuccess,
  viewAsClient
}) => (
  <HasPermissionContainer>
    {({ hasOrganizationAssetPermission }) => (
      <Grid item xs={12} id="accreditations">
        <Paper>
          <Grid container>
            <Grid item xs={12} className={classes.gridItem}>
              <Typography variant="h5">Accreditations</Typography>
              {hasOrganizationAssetPermission() && !viewAsClient && (
                <Typography variant="body1">
                  Add accreditations below. If none are entered, this profile section will not appear publicly.
                </Typography>
              )}
            </Grid>
          </Grid>
          {accreditations.length ? (
            <div className={viewAsClient ? classes.viewAsClient : classes.root}>
              <Table className={classes.table}>
                <colgroup>
                  <col style={{ width: '32%' }} />
                  <col style={{ width: '32%' }} />
                  <col style={{ width: '20%' }} />
                  <col style={{ width: '16%' }} />
                </colgroup>
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.tableCell}>Accreditation Name</TableCell>
                    <TableCell>Issue Date</TableCell>
                    <TableCell>ID</TableCell>
                    {!viewAsClient && <TableCell />}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {accreditations.map(accreditation => (
                    <TableRow key={accreditation.id}>
                      <TableCell className={classes.tableCell}>{accreditation.name}</TableCell>
                      <TableCell>{moment(accreditation.issueDateUtc).format('MM/DD/YYYY')}</TableCell>
                      <TableCell>{accreditation.accreditationId}</TableCell>
                      {hasOrganizationAssetPermission() && !viewAsClient && (
                        <TableCell align="right">
                          <EditAccreditationContainer initialValues={{ ...accreditation }} />
                          <ConfirmDelete
                            message={`Are you sure you'd like to remove ${accreditation.name}?`}
                            handleDelete={deleteAccreditation(accreditation.id)}
                            deleteSuccess={deleteSuccess(accreditation.id)}
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
                <AddAccreditationContainer />
              </Grid>
            </Grid>
          )}
        </Paper>
      </Grid>
    )}
  </HasPermissionContainer>
);

export const AccreditationsComponent = withStyles(styles)(Accreditations);
