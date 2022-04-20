import * as React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { DeepReadonly } from 'utility-types';
import { IQuestionnaireSection, QuestionnaireSectionStatus } from '@pec/aion-ui-core/interfaces/questionnaireSection';
import { NavLink } from '@pec/aion-ui-components/components/NavLink';
import { QuestionnaireMenuItemContent } from '../Questionnaire/QuestionnaireMenuItemContent';
import { RouteComponentProps, withRouter } from 'react-router';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';

const styles = (theme: Theme) => ({
  listItem: {
    borderColor: theme.palette.divider,
    borderStyle: 'solid',
    borderTopWidth: 1,
    '&:last-child': {
      borderBottomWidth: 1
    }
  }
});

type RouteParams = {
  organizationId: string;
};

type OwnProps = {
  questionnaireSections: DeepReadonly<IQuestionnaireSection[]>;
  filterCompleted: boolean;
};

type Props = WithStyles<typeof styles> & RouteComponentProps<RouteParams> & OwnProps;

const QuestionnaireTileMenuComponent: React.FC<Props> = ({
  match: {
    params: { organizationId }
  },
  questionnaireSections,
  filterCompleted,
  classes
}) => (
  <List component="nav">
    {questionnaireSections.map(q =>
      filterCompleted && q.status === QuestionnaireSectionStatus.Complete ? null : (
        <ListItem
          key={q.id}
          button
          className={classes.listItem}
          component={NavLink}
          to={`/${organizationId}/questionnaire/${q.id}`}
        >
          <QuestionnaireMenuItemContent {...q} />
        </ListItem>
      )
    )}
  </List>
);

export const QuestionnaireTileMenu = withStyles(styles)(withRouter(QuestionnaireTileMenuComponent));
