import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { ContractorQuestionStatus } from './ContractorQuestionStatus';
import { DeepReadonly } from 'ts-essentials';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IAnswer } from 'interfaces/answer';
import { IContractorRequirement } from 'interfaces/requirement';
import { INestedQuestion } from 'interfaces/question';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { resolveQuestionNumber } from 'helpers/questionNumber';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { WrappingLink } from '@pec/aion-ui-components/components/WrappingLink';
import { useTranslation } from 'react-i18next';

const styles = (theme: Theme) => ({
  divideBottom: {
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  subquestion: {
    '&:hover': {
      background: theme.palette.action.hover
    },
    cursor: 'pointer'
  }
});

type OwnProps = {
  questions: DeepReadonly<INestedQuestion[]>;
  requirement: DeepReadonly<IContractorRequirement>;
  answer: DeepReadonly<IAnswer> | null | undefined;
  organizationId: string;
  safetyProgramRequirementId: string;
};

type Props = WithStyles<typeof styles> & OwnProps;

const Component: React.FC<Props> = ({
  questions,
  requirement,
  answer,
  organizationId,
  safetyProgramRequirementId,
  classes
}) => {
  const { t } = useTranslation();

  return (
    <Grid item xs={12}>
      <Paper variant="outlined" style={{ padding: 0 }}>
        <GridContainer>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color={answer?.answerValue ? undefined : 'textSecondary'}>
              {t('safetyPrograms.common.subQuestions', 'Subquestions')}
            </Typography>
          </Grid>
          <Grid item xs={12} style={{ padding: 0 }}>
            {questions.map(({ id, title }) => {
              const question = (
                <GridContainer
                  className={`${answer?.answerValue ? classes.subquestion : ''} ${classes.divideBottom}`}
                  justify="space-between"
                  wrap="nowrap"
                >
                  <Grid item zeroMinWidth>
                    <Typography noWrap color={answer?.answerValue ? undefined : 'textSecondary'} title={title}>
                      {resolveQuestionNumber(requirement.questions, id)}. {title}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <ContractorQuestionStatus
                      status={requirement.questionAnswers.find(({ questionId }) => questionId === id)?.status}
                      fontSize="small"
                    />
                  </Grid>
                </GridContainer>
              );

              return answer?.answerValue ? (
                <WrappingLink
                  key={id}
                  to={`/organizations/${organizationId}/safety-program-requirements/${safetyProgramRequirementId}/questions/${id}`}
                >
                  {question}
                </WrappingLink>
              ) : (
                <React.Fragment key={id}>{question}</React.Fragment>
              );
            })}
          </Grid>
        </GridContainer>
      </Paper>
    </Grid>
  );
};

export const ContractorSubquestions = withStyles(styles)(Component);
