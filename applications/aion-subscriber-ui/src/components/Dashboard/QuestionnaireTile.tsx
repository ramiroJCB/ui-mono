import * as React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import { DeepReadonly } from 'utility-types';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IQuestionnaireSection, QuestionnaireSectionStatus } from '@pec/aion-ui-core/interfaces/questionnaireSection';
import { Link } from 'react-router-dom';
import { QuestionnaireTileMenu } from './QuestionnaireTileMenu';
import { RouteComponentProps, withRouter } from 'react-router';
import { Tile } from 'components/Tile';
import { localizeNumber } from '@pec/aion-ui-i18next/helpers/localize';
import { useTranslation } from 'react-i18next';

type RouteParams = {
  organizationId: string;
};

type OwnProps = {
  questionnaireSections: DeepReadonly<IQuestionnaireSection[]>;
  questionnaireTileShowCompletedSections: boolean;
  handleCheckboxClick: () => void;
};

type Props = RouteComponentProps<RouteParams> & OwnProps;

const QuestionnaireTile: React.FC<Props> = ({
  match: {
    params: { organizationId }
  },
  questionnaireSections,
  questionnaireTileShowCompletedSections,
  handleCheckboxClick
}) => {
  const { t } = useTranslation();

  const totalSections = questionnaireSections.length;
  const completedSections = questionnaireSections.filter(s => s.status === QuestionnaireSectionStatus.Complete).length;
  const sectionsLeft = totalSections - completedSections;

  return (
    <Tile primaryText={t('subscriber.dashboard.questionnaireTile.title', 'Questionnaire Progress')}>
      <GridContainer>
        <Grid item xs={12}>
          <LinearProgress
            variant="determinate"
            value={Math.round((completedSections / totalSections) * 100)}
            color="secondary"
          />
          {sectionsLeft > 0 ? (
            <div style={{ textAlign: 'center' }}>
              <Typography variant="h1">{localizeNumber(totalSections - completedSections, t)}</Typography>
              <Typography variant="h6">
                {t('subscriber.dashboard.questionnaireTile.sectionsLeft', {
                  count: sectionsLeft,
                  defaultValue_plural: 'Sections Left',
                  defaultValue: 'Section Left'
                })}
              </Typography>
              <QuestionnaireTileMenu
                filterCompleted={!questionnaireTileShowCompletedSections}
                questionnaireSections={questionnaireSections}
              />
              <FormControlLabel
                control={<Checkbox checked={questionnaireTileShowCompletedSections} onClick={handleCheckboxClick} />}
                label={t('subscriber.dashboard.questionnaireTile.showCompletedSections', 'Show completed sections')}
              />
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <Typography variant="h1" color="secondary">
                ✓
              </Typography>
              <Typography variant="h6" color="secondary">
                {t('subscriber.dashboard.questionnaireTile.complete', 'Complete!')}
              </Typography>
              <Typography variant="subtitle1">
                <Link to={`/${organizationId}/questionnaire`}>
                  {t('subscriber.dashboard.questionnaireTile.reviewAllAnswers', 'Review all Answers')}
                </Link>
              </Typography>
            </div>
          )}
        </Grid>
      </GridContainer>
    </Tile>
  );
};

export const QuestionnaireTileComponent = withRouter(QuestionnaireTile);
