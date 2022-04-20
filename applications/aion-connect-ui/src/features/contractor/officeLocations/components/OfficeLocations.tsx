import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import InfoIcon from '@material-ui/icons/Info';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { AddOfficeLocationContainer } from 'features/contractor/officeLocation/containers/AddOfficeLocation';
import { AxiosError } from 'axios';
import { ConfirmDelete } from 'components/ConfirmDelete';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'utility-types';
import { deleteOfficeLocationSuccess } from 'features/contractor/officeLocation/actions/deleteOfficeLocation';
import { EditOfficeLocationContainer } from 'features/contractor/officeLocation/containers/EditOfficeLocation';
import { Error } from '@pec/aion-ui-components/components/Error';
import { HasPermissionContainer } from '@pec/aion-ui-components/containers/HasPermission';
import { IOfficeLocation, OfficeLocationType } from 'interfaces/officeLocation';
import { USAStates } from '@pec/aion-ui-core/constants/USAStates';

const { Primary } = OfficeLocationType;
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
    infoIcon: {
      color: theme.palette.grey[600],
      padding: theme.spacing(2)
    }
  });

type OwnProps = {
  error: DeepReadonly<AxiosError> | null;
  officeLocations: DeepReadonly<IOfficeLocation[]>;
  deleteOfficeLocation: (officeLocationId: string) => () => Promise<void>;
  deleteSuccess: (officeLocationId: string) => () => ReturnType<typeof deleteOfficeLocationSuccess>;
  viewAsClient: boolean;
};

type Props = OwnProps & WithStyles<typeof styles>;

const OfficeLocations: React.FC<Props> = ({
  classes,
  error,
  officeLocations,
  deleteOfficeLocation,
  deleteSuccess,
  viewAsClient
}) => (
  <HasPermissionContainer>
    {({ hasOrganizationAssetPermission }) => (
      <Grid item xs={12} id="office-locations">
        <Paper>
          <Grid container>
            <Grid item xs={12} className={classes.gridItem}>
              <Typography variant="h5">Offices and Locations</Typography>
              {hasOrganizationAssetPermission() && !viewAsClient && (
                <Typography variant="body1">
                  Add offices and locations below. If none are entered, this profile section will not appear publicly.
                </Typography>
              )}
            </Grid>
          </Grid>
          {officeLocations.length ? (
            <div className={viewAsClient ? classes.viewAsClient : classes.root}>
              <Table className={classes.table}>
                <colgroup>
                  <col style={{ width: '20%' }} />
                  <col style={{ width: '24%' }} />
                  <col style={{ width: '20%' }} />
                  <col style={{ width: '20%' }} />
                  <col style={{ width: '16%' }} />
                </colgroup>
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.tableCell}>Name</TableCell>
                    <TableCell>Street Address</TableCell>
                    <TableCell>City</TableCell>
                    <TableCell>State</TableCell>
                    {!viewAsClient && <TableCell />}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {officeLocations.map(officeLocation => (
                    <TableRow key={officeLocation.id}>
                      <TableCell className={classes.tableCell}>{officeLocation.name}</TableCell>
                      <TableCell>{officeLocation.streetAddress}</TableCell>
                      <TableCell>{officeLocation.city}</TableCell>
                      <TableCell>{officeLocation.state}</TableCell>
                      {hasOrganizationAssetPermission() &&
                        !viewAsClient &&
                        (officeLocation.type !== Primary ? (
                          <TableCell align="right">
                            <EditOfficeLocationContainer
                              initialValues={{
                                ...officeLocation,
                                state: USAStates.find(state => state.value === officeLocation.state)
                              }}
                            />
                            <ConfirmDelete
                              message={`Are you sure you'd like to remove ${officeLocation.name}?`}
                              handleDelete={deleteOfficeLocation(officeLocation.id)}
                              deleteSuccess={deleteSuccess(officeLocation.id)}
                            />
                          </TableCell>
                        ) : (
                          <TableCell align="right">
                            <div className={classes.infoIcon}>
                              <Tooltip
                                title="This information can be edited in the Company Profile of your SSQ."
                                placement="top"
                              >
                                <InfoIcon />
                              </Tooltip>
                            </div>
                          </TableCell>
                        ))}
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
                {officeLocations.filter(({ type }) => type !== Primary).length < 5 ? (
                  <AddOfficeLocationContainer />
                ) : (
                  <Typography variant="body1" color="error">
                    Office and locations amount of 5 has been exceeded.
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

export const OfficeLocationsComponent = withStyles(styles)(OfficeLocations);
