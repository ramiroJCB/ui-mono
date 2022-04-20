import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { BackTitleHeader } from 'common/components/BackTitleHeader';
import { Error } from '@pec/aion-ui-components/components/Error';
import { inspectionSectionsSelectors } from '../../inspectionSections/slice';
import { Link } from '@pec/aion-ui-components/components/Link';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import { useTypedSelector } from 'app/reducer';

export const maxCount = 100;

const useStyles = makeStyles((theme: Theme) => ({
  label: {
    marginTop: theme.spacing(1)
  },
  item: {
    padding: theme.spacing(2)
  },
  secondaryAction: {
    right: 8
  }
}));

export const MobileInspectionSections: React.FC = () => {
  const classes = useStyles();
  const { organizationId, inspectionId } = useParams<{ organizationId: string; inspectionId: string }>();
  const { isFetching: isFetchingInspection, error: inspectionError, inspection } = useTypedSelector(
    state => state.inspection
  );
  const { isFetching: isFetchingInspectionSections, error: inspectionSectionsError } = useTypedSelector(
    state => state.inspectionSections
  );
  const inspectionSections = useTypedSelector(inspectionSectionsSelectors.selectAll);

  return !isFetchingInspection && !isFetchingInspectionSections && inspection && inspectionSections ? (
    <React.Fragment>
      <Grid container item classes={{ root: classes.item }}>
        <BackTitleHeader linkTitle="Back To Reviews" to={`/${organizationId}/reviews`}>
          Performance Management
        </BackTitleHeader>
      </Grid>
      <Divider />
      <Grid container>
        <Grid item xs={12} classes={{ root: classes.item }}>
          <Typography variant="h5">{inspection.formName}</Typography>
          <Typography variant="subtitle2" color="textSecondary" className={classes.label}>
            Client
          </Typography>
          <Typography variant="body1">{inspection.organizationName}</Typography>
          {inspection.businessUnitName && (
            <React.Fragment>
              <Typography variant="subtitle2" color="textSecondary" className={classes.label}>
                Business Unit
              </Typography>
              <Typography variant="body1">{inspection.businessUnitName}</Typography>
            </React.Fragment>
          )}
          <Typography variant="subtitle2" color="textSecondary" className={classes.label}>
            Report Contact
          </Typography>
          <Typography variant="body1">
            {inspection.createdByUserFirstName} {inspection.createdByUserLastName}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary" className={classes.label}>
            Review Date
          </Typography>
          <Typography variant="body1">{new Date(inspection.dateOfInspectionUtc).toLocaleDateString()}</Typography>
        </Grid>
      </Grid>
      <Divider />
      <Grid container item classes={{ root: classes.item }}>
        <Typography variant="button" color="textSecondary">
          Sections
        </Typography>
      </Grid>
      <Divider />
      <Grid container>
        <Grid item xs={12}>
          <List disablePadding>
            {inspectionSections.map(({ id, sectionName, sectionId }) => (
              <ListItem
                key={id}
                classes={{ root: classes.item }}
                button
                divider
                component={Link}
                to={`/${organizationId}/reviews/${inspectionId}/inspection-sections/${sectionId}`}
              >
                <ListItemText primary={sectionName} />
                <ListItemSecondaryAction className={classes.secondaryAction}>
                  <ArrowForwardIosIcon fontSize="small" color="action" />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </React.Fragment>
  ) : inspectionError || inspectionSectionsError ? (
    <Error message="There was an error processing your request." />
  ) : (
    <Loading />
  );
};
