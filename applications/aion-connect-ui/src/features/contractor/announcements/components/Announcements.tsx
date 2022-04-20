import * as React from 'react';
import BullhornOutline from 'mdi-material-ui/BullhornOutline';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { AddAnnouncementContainer } from 'features/contractor/announcements/containers/AddAnnouncement';
import { AxiosError } from 'axios';
import { ConfirmDelete } from 'components/ConfirmDelete';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'utility-types';
import { EditAnnouncementContainer } from 'features/contractor/announcements/containers/EditAnnouncement';
import { Error } from '@pec/aion-ui-components/components/Error';
import { HasPermissionContainer } from '@pec/aion-ui-components/containers/HasPermission';
import { IAnnouncement } from 'interfaces/announcement';

const styles = (theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(4)
    },
    gridItem: {
      padding: '20px 0'
    },
    actionButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.down('sm')]: {
        width: '100%',
        marginRight: 0,
        marginBottom: theme.spacing(1)
      }
    },
    gutterBottom: {
      marginBottom: theme.spacing(9)
    },
    text: {
      whiteSpace: 'pre-line'
    }
  });

type OwnProps = {
  error: DeepReadonly<AxiosError> | null;
  announcement: DeepReadonly<IAnnouncement> | null;
  deleteAnnouncement: (announcementId: string) => () => Promise<void>;
  viewAsClient: boolean;
};

type Props = OwnProps & WithStyles<typeof styles>;

const Announcements: React.FC<Props> = ({ classes, error, announcement, deleteAnnouncement, viewAsClient }) => (
  <HasPermissionContainer>
    {({ hasOrganizationAssetPermission }) => (
      <Grid item xs={12} id="announcements">
        <Paper className={classes.paper}>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h5">
                <BullhornOutline /> Announcements
              </Typography>
              {hasOrganizationAssetPermission() && !viewAsClient && (
                <Typography
                  variant="body1"
                  gutterBottom={announcement === null}
                  classes={{
                    gutterBottom: classes.gutterBottom
                  }}
                >
                  Share your latest news.
                </Typography>
              )}
              {announcement ? (
                <Grid container key={announcement.id}>
                  <Grid item xs={12} className={classes.gridItem}>
                    <Typography variant="body1">
                      {`Updated ${moment(announcement.updatedDateUtc).format('MM/DD/YYYY')}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} style={!viewAsClient ? { paddingBottom: 40 } : {}}>
                    <Typography variant="body1" className={classes.text}>
                      {announcement.text}
                    </Typography>
                  </Grid>
                </Grid>
              ) : error ? (
                <Error message="There was an error processing your request." />
              ) : null}
            </Grid>
            {hasOrganizationAssetPermission() &&
              !viewAsClient &&
              (announcement ? (
                <React.Fragment>
                  <div className={classes.actionButton}>
                    <EditAnnouncementContainer initialValues={{ ...announcement }} />
                  </div>
                  <ConfirmDelete
                    message="Are you sure you'd like to remove your announcement?"
                    handleDelete={deleteAnnouncement(announcement.id)}
                    variant="button"
                  />
                </React.Fragment>
              ) : (
                <AddAnnouncementContainer />
              ))}
          </Grid>
        </Paper>
      </Grid>
    )}
  </HasPermissionContainer>
);

export const AnnouncementsComponent = withStyles(styles)(Announcements);
