import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { DeepReadonly } from 'ts-essentials';
import { EvaluatorQuestionStatus } from './EvaluatorQuestionStatus';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IContractorRequirement } from 'interfaces/requirement';
import { INestedQuestion } from 'interfaces/question';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { resolveQuestionNumber } from 'helpers/questionNumber';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { WrappingLink } from '@pec/aion-ui-components/components/WrappingLink';
import { useTranslation } from 'react-i18next';

const styles = (theme: Theme) => ({
  subquestion: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:hover': {
      background: theme.palette.action.hover
    },
    cursor: 'pointer'
  }
});

type OwnProps = {
  organizationId?: string;
  questions: DeepReadonly<INestedQuestion[]>;
  requirement: DeepReadonly<IContractorRequirement>;
  safetyProgramRequirementId: string;
};

type Props = WithStyles<typeof styles> & OwnProps;

const Component: React.FC<Props> = ({
  organizationId,
  questions,
  requirement,
  safetyProgramRequirementId,
  classes
}) => {
  const { t } = useTranslation();

  return (
    <Grid item xs={12}>
      <Paper variant="outlined" style={{ padding: 0 }}>
        <GridContainer>
          <Grid item xs={12}>
            <Typography variant="subtitle2">{t('safetyPrograms.common.subQuestions', 'Subquestions')}</Typography>
          </Grid>
          <Grid item xs={12} style={{ padding: 0 }}>
            {questions.map(({ id, title }) => {
              const answer = requirement.questionAnswers.find(answer => answer.questionId === id);

              return (
                <WrappingLink
                  key={id}
                  to={
                    organizationId
                      ? `/organizations/${organizationId}/safety-program-requirements/${safetyProgramRequirementId}/questions/${id}`
                      : `/safety-program-requirements/${safetyProgramRequirementId}/questions/${id}`
                  }
                >
                  <GridContainer className={classes.subquestion} justify="space-between" wrap="nowrap">
                    <Grid item zeroMinWidth>
                      <Typography noWrap color={answer ? undefined : 'textSecondary'} title={title}>
                        {resolveQuestionNumber(requirement.questions, id)}. {title}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <EvaluatorQuestionStatus status={answer?.status} fontSize="small" />
                    </Grid>
                  </GridContainer>
                </WrappingLink>
              );
            })}
          </Grid>
        </GridContainer>
      </Paper>
    </Grid>
  );
};

export const EvaluatorSubquestions = withStyles(styles)(Component);
