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
import { AddLicenseContainer } from 'features/contractor/license/containers/AddLicense';
import { AxiosError } from 'axios';
import { ConfirmDelete } from 'components/ConfirmDelete';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'utility-types';
import { deleteLicenseSuccess } from 'features/contractor/license/actions/deleteLicense';
import { EditLicenseContainer } from 'features/contractor/license/containers/EditLicense';
import { Error } from '@pec/aion-ui-components/components/Error';
import { HasPermissionContainer } from '@pec/aion-ui-components/containers/HasPermission';
import { ILicense } from 'interfaces/license';

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
  licenses: DeepReadonly<ILicense[]>;
  deleteLicense: (licenseId: string) => () => Promise<void>;
  deleteSuccess: (licenseId: string) => () => ReturnType<typeof deleteLicenseSuccess>;
  viewAsClient: boolean;
};

type Props = OwnProps & WithStyles<typeof styles>;

const Licenses: React.FC<Props> = ({ classes, error, licenses, deleteLicense, deleteSuccess, viewAsClient }) => (
  <HasPermissionContainer>
    {({ hasOrganizationAssetPermission }) => (
      <Grid item xs={12} id="licenses">
        <Paper>
          <Grid container>
            <Grid item xs={12} className={classes.gridItem}>
              <Typography variant="h5">Licenses</Typography>
              {hasOrganizationAssetPermission() && !viewAsClient && (
                <Typography variant="body1">
                  Add licenses below. If none are entered, this profile section will not appear publicly.
                </Typography>
              )}
            </Grid>
          </Grid>
          {licenses.length ? (
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
                    <TableCell className={classes.tableCell}>License Name</TableCell>
                    <TableCell>Issue Date</TableCell>
                    <TableCell>ID</TableCell>
                    {!viewAsClient && <TableCell />}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {licenses.map(license => (
                    <TableRow key={license.id}>
                      <TableCell className={classes.tableCell}>{license.name}</TableCell>
                      <TableCell>{moment(license.issueDateUtc).format('MM/DD/YYYY')}</TableCell>
                      <TableCell>{license.licenseId}</TableCell>
                      {hasOrganizationAssetPermission() && !viewAsClient && (
                        <TableCell align="right">
                          <EditLicenseContainer initialValues={{ ...license }} />
                          <ConfirmDelete
                            message={`Are you sure you'd like to remove ${license.name}?`}
                            handleDelete={deleteLicense(license.id)}
                            deleteSuccess={deleteSuccess(license.id)}
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
                <AddLicenseContainer />
              </Grid>
            </Grid>
          )}
        </Paper>
      </Grid>
    )}
  </HasPermissionContainer>
);

export const LicensesComponent = withStyles(styles)(Licenses);
