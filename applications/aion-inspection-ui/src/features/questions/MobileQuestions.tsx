import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { BackTitleHeader } from 'common/components/BackTitleHeader';
import { Drawer } from 'common/components/Drawer';
import { Error } from '@pec/aion-ui-components/components/Error';
import { inspectionSectionsAdapter } from '../inspectionSections/slice';
import { Link } from '@pec/aion-ui-components/components/Link';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { NavLink } from '@pec/aion-ui-components/components/NavLink';
import { questionsAdapter } from './slice';
import { RootState, store } from 'app/store';
import { useParams } from 'react-router-dom';
import { useTypedSelector } from 'app/reducer';

const useStyles = makeStyles((theme: Theme) => ({
  secondaryAction: {
    right: 8
  },
  navLink: {
    textDecoration: 'none',
    color: theme.palette.common.black,
    '&.active > div': {
      background: theme.palette.action.selected
    }
  },
  item: {
    padding: theme.spacing(2)
  }
}));

export const MobileQuestions: React.FC = () => {
  const classes = useStyles();
  const { organizationId, inspectionId, sectionId } = useParams<{
    organizationId: string;
    inspectionId: string;
    sectionId: string;
  }>();
  const { isFetching: isFetchingInspection, error: inspectionError, inspection } = useTypedSelector(
    state => state.inspection
  );
  const { isFetching: isFetchingInspectionSections, error: inspectionSectionsError } = useTypedSelector(
    state => state.inspectionSections
  );
  const inspectionSectionsSelectors = inspectionSectionsAdapter.getSelectors<RootState>(
    state => state.inspectionSections
  );
  const { isFetching: isFetchingQuestions, error: questionsError } = useTypedSelector(state => state.questions);

  const questionsSelectors = questionsAdapter.getSelectors<RootState>(state => state.questions);
  const questions = questionsSelectors.selectAll(store.getState());

  const inspectionSections = inspectionSectionsSelectors.selectAll(store.getState());
  const inspectionSection = inspectionSectionsSelectors.selectById(store.getState(), sectionId);
  const nextSection = inspectionSections[inspectionSections.findIndex(s => s.sectionId === sectionId) + 1];
  const isFetching = isFetchingInspection || isFetchingInspectionSections || isFetchingQuestions;
  const error = inspectionError || inspectionSectionsError || questionsError;

  return !isFetching && inspection && inspectionSections && inspectionSection && questions ? (
    <React.Fragment>
      <Grid container item classes={{ root: classes.item }}>
        <BackTitleHeader
          linkTitle="Back To Sections"
          to={`/${organizationId}/reviews/${inspectionId}/inspection-sections`}
        >
          {inspection.formName}
        </BackTitleHeader>
      </Grid>
      <Divider />
      <Grid container classes={{ root: classes.item }}>
        <Grid item xs={12}>
          <Typography variant="subtitle2" color="textSecondary">
            Section
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5">{inspectionSection.sectionName}</Typography>
        </Grid>
      </Grid>
      <Divider />
      <Grid container item classes={{ root: classes.item }} xs={12}>
        <Typography variant="button" color="textSecondary">
          Questions
        </Typography>
      </Grid>
      <Divider />
      <Grid container>
        <Grid item xs={12}>
          <List disablePadding>
            {questions.map(({ id, title }, index) => (
              <ListItem
                key={id}
                classes={{ root: classes.item }}
                button
                divider
                component={Link}
                to={`/${organizationId}/reviews/${inspectionId}/inspection-sections/${sectionId}/questions/${id}`}
              >
                <ListItemText primary={`${index + 1}. ${title}`} />
                <ListItemSecondaryAction className={classes.secondaryAction}>
                  <ArrowForwardIosIcon fontSize="small" color="action" />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
      <Grid container justify="space-between" classes={{ root: classes.item }}>
        <Grid item xs={5}>
          {nextSection && (
            <Button
              fullWidth
              variant="contained"
              color="primary"
              component={Link}
              to={`/${organizationId}/reviews/${inspectionId}/inspection-sections/${nextSection.sectionId}`}
            >
              Next Section
            </Button>
          )}
        </Grid>
        <Grid item xs={5}>
          <Drawer buttonTitle="jump to" icon={<ArrowLeftIcon />} title="Jump to Section">
            <List disablePadding component="nav">
              {inspectionSections.map(({ id, sectionId, sectionName }) => (
                <NavLink
                  key={id}
                  to={`/${organizationId}/reviews/${inspectionId}/inspection-sections/${sectionId}`}
                  className={classes.navLink}
                >
                  <ListItem classes={{ root: classes.item }} button divider>
                    <ListItemText primary={sectionName} />
                  </ListItem>
                </NavLink>
              ))}
            </List>
          </Drawer>
        </Grid>
      </Grid>
    </React.Fragment>
  ) : error ? (
    <Error message="There was an error processing your request." />
  ) : (
    <Loading />
  );
};
