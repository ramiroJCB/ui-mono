import * as React from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Typography } from '@material-ui/core';

const styles = (theme: Theme) =>
  createStyles({
    accordionSummary: {
      paddingLeft: theme.spacing(4)
    },
    accordion: {
      marginTop: 0
    },
    list: {
      paddingTop: 0
    },
    listItem: {
      paddingTop: 0,
      paddingBottom: 0
    },
    icon: {
      fontSize: 24
    },
    completeIcon: {
      color: theme.palette.secondary.main
    },
    incompleteIcon: {
      color: theme.palette.error.main
    },
    listItemText: {
      paddingLeft: 0
    }
  });

type OwnProps = {
  isFetching: boolean;
  hasCompletedLogoSection: boolean;
  hasCompletedContactInformationSection: boolean;
  hasCompletedOtherSections: boolean;
  completionPercentage: number;
};

type Props = WithStyles<typeof styles> & OwnProps;

export const Completion: React.FC<Props> = ({
  isFetching,
  classes,
  hasCompletedLogoSection,
  hasCompletedContactInformationSection,
  hasCompletedOtherSections,
  completionPercentage
}) =>
  !isFetching ? (
    <Grid item xs={12}>
      <Paper>
        <React.Fragment>
          <LinearProgress variant="determinate" color="secondary" value={completionPercentage} />
          <Accordion className={classes.accordion} defaultExpanded>
            <AccordionSummary className={classes.accordionSummary} expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Complete Your Connect Profile</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List className={classes.list}>
                <ListItem className={classes.listItem}>
                  <ListItemIcon>
                    {hasCompletedLogoSection ? (
                      <CheckIcon data-icon="CheckIcon" className={classes.icon && classes.completeIcon} />
                    ) : (
                      <CloseIcon data-icon="CloseIcon" className={classes.icon && classes.incompleteIcon} />
                    )}
                  </ListItemIcon>
                  <ListItemText className={classes.listItemText} primary="Add your organization's logo" />
                </ListItem>
                <ListItem className={classes.listItem}>
                  <ListItemIcon>
                    {hasCompletedContactInformationSection ? (
                      <CheckIcon data-icon="CheckIcon" className={classes.icon && classes.completeIcon} />
                    ) : (
                      <CloseIcon data-icon="CloseIcon" className={classes.icon && classes.incompleteIcon} />
                    )}
                  </ListItemIcon>
                  <ListItemText className={classes.listItemText} primary="Add contact information" />
                </ListItem>
                <ListItem className={classes.listItem}>
                  <ListItemIcon>
                    {hasCompletedOtherSections ? (
                      <CheckIcon data-icon="CheckIcon" className={classes.icon && classes.completeIcon} />
                    ) : (
                      <CloseIcon data-icon="CloseIcon" className={classes.icon && classes.incompleteIcon} />
                    )}
                  </ListItemIcon>
                  <ListItemText className={classes.listItemText} primary="Add all profile sections" />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>
        </React.Fragment>
      </Paper>
    </Grid>
  ) : null;

export const CompletionComponent = withStyles(styles)(Completion);
