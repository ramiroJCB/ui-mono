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
import { AddCertificationContainer } from 'features/contractor/certification/containers/AddCertification';
import { AxiosError } from 'axios';
import { ConfirmDelete } from 'components/ConfirmDelete';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'utility-types';
import { deleteCertificationSuccess } from 'features/contractor/certification/actions/deleteCertification';
import { EditCertificationContainer } from 'features/contractor/certification/containers/EditCertification';
import { Error } from '@pec/aion-ui-components/components/Error';
import { HasPermissionContainer } from '@pec/aion-ui-components/containers/HasPermission';
import { ICertification } from 'interfaces/certification';

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
  certifications: DeepReadonly<ICertification[]>;
  deleteCertification: (certificationId: string) => () => Promise<void>;
  deleteSuccess: (certificationId: string) => () => ReturnType<typeof deleteCertificationSuccess>;
  viewAsClient: boolean;
};

type Props = OwnProps & WithStyles<typeof styles>;

export const Certifications: React.FC<Props> = ({
  classes,
  error,
  certifications,
  deleteCertification,
  deleteSuccess,
  viewAsClient
}) => (
  <HasPermissionContainer>
    {({ hasOrganizationAssetPermission }) => (
      <Grid item xs={12} id="certifications">
        <Paper>
          <Grid container>
            <Grid item xs={12} className={classes.gridItem}>
              <Typography variant="h5">Certifications</Typography>
              {hasOrganizationAssetPermission() && !viewAsClient && (
                <Typography variant="body1">
                  Add certifications below. If none are entered, this profile section will not appear publicly.
                </Typography>
              )}
            </Grid>
          </Grid>
          {certifications.length ? (
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
                    <TableCell className={classes.tableCell}>Certification Name</TableCell>
                    <TableCell>Issue Date</TableCell>
                    <TableCell>ID</TableCell>
                    {!viewAsClient && <TableCell />}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {certifications.map(certification => (
                    <TableRow key={certification.id}>
                      <TableCell className={classes.tableCell}>{certification.name}</TableCell>
                      <TableCell>{moment(certification.issueDateUtc).format('MM/DD/YYYY')}</TableCell>
                      <TableCell>{certification.certificationId}</TableCell>
                      {hasOrganizationAssetPermission() && !viewAsClient && (
                        <TableCell align="right">
                          <EditCertificationContainer initialValues={{ ...certification }} />
                          <ConfirmDelete
                            message={`Are you sure you'd like to remove ${certification.name}?`}
                            handleDelete={deleteCertification(certification.id)}
                            deleteSuccess={deleteSuccess(certification.id)}
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
                <AddCertificationContainer />
              </Grid>
            </Grid>
          )}
        </Paper>
      </Grid>
    )}
  </HasPermissionContainer>
);

export const CertificationsComponent = withStyles(styles)(Certifications);
