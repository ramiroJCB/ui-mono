import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { AddReferenceContainer } from 'features/contractor/reference/containers/AddReference';
import { AxiosError } from 'axios';
import { ConfirmDelete } from 'components/ConfirmDelete';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'utility-types';
import { deleteReferenceSuccess } from 'features/contractor/reference/actions/deleteReference';
import { EditReferenceContainer } from 'features/contractor/reference/containers/EditReference';
import { Error } from '@pec/aion-ui-components/components/Error';
import { HasPermissionContainer } from '@pec/aion-ui-components/containers/HasPermission';
import { IReference } from 'interfaces/reference';
import { Tooltip } from '@material-ui/core';

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
    },
    email: {
      whiteSpace: 'nowrap',
      maxWidth: '130px',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  });

type OwnProps = {
  error: DeepReadonly<AxiosError> | null;
  references: DeepReadonly<IReference[]>;
  deleteReference: (referenceId: string) => () => Promise<void>;
  deleteSuccess: (referenceId: string) => () => ReturnType<typeof deleteReferenceSuccess>;
  viewAsClient: boolean;
};

type Props = OwnProps & WithStyles<typeof styles>;

const References: React.FC<Props> = ({ classes, error, references, deleteReference, deleteSuccess, viewAsClient }) => (
  <HasPermissionContainer>
    {({ hasOrganizationAssetPermission }) => (
      <Grid item xs={12} id="references">
        <Paper>
          <Grid container>
            <Grid item xs={12} className={classes.gridItem}>
              <Typography variant="h5">References</Typography>
              {hasOrganizationAssetPermission() && !viewAsClient && (
                <Typography variant="body1">
                  Add references below. If none are entered, this profile section will not appear publicly.
                </Typography>
              )}
            </Grid>
          </Grid>
          {references.length ? (
            <div className={viewAsClient ? classes.viewAsClient : classes.root}>
              <Table className={classes.table}>
                <colgroup>
                  <col style={{ width: '20%' }} />
                  <col style={{ width: '20%' }} />
                  <col style={{ width: '20%' }} />
                  <col style={{ width: '24%' }} />
                  <col style={{ width: '16%' }} />
                </colgroup>
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.tableCell}>Name</TableCell>
                    <TableCell>Phone Number</TableCell>
                    <TableCell>Email Address</TableCell>
                    <TableCell>Notes</TableCell>
                    {!viewAsClient && <TableCell />}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {references.map(reference => (
                    <TableRow key={reference.id}>
                      <TableCell className={classes.tableCell}>{reference.name}</TableCell>
                      <TableCell>{reference.phoneNumber}</TableCell>

                      <TableCell className={classes.email}>
                        <Tooltip title={reference.emailAddress ? reference.emailAddress : 'N/A'}>
                          <span>{reference.emailAddress ? reference.emailAddress : 'N/A'}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{reference.notes}</TableCell>
                      {hasOrganizationAssetPermission() && !viewAsClient && (
                        <TableCell align="right">
                          <EditReferenceContainer initialValues={{ ...reference }} />
                          <ConfirmDelete
                            message={`Are you sure you'd like to remove ${reference.name}?`}
                            handleDelete={deleteReference(reference.id)}
                            deleteSuccess={deleteSuccess(reference.id)}
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
                {references.length < 10 ? (
                  <AddReferenceContainer />
                ) : (
                  <Typography variant="body1" color="error">
                    Reference amount of 10 has been exceeded.
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

export const ReferencesComponent = withStyles(styles)(References);
