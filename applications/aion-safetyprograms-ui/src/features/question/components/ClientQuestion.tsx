import * as React from 'react';
import Button from '@material-ui/core/Button';
import CheckRoundedIcon from '@material-ui/icons/CheckRounded';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Typography from '@material-ui/core/Typography';
import { AnswerStatus, IAnswer } from 'interfaces/answer';
import { AxiosError } from 'axios';
import { ClientCommentsContainer } from 'features/comments/containers/ClientComments';
import { DeepReadonly } from 'ts-essentials';
import { ErrorButton } from 'components/ErrorButton';
import { EvaluatorRequirementBreadcrumbs } from 'features/requirement/components/EvaluatorBreadcrumbs';
import { EvaluatorSubquestions } from './EvaluatorSubquestions';
import { getAdjacentEvaluatorQuestionIds } from 'helpers/getAdjacentQuestionIds';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IContractorRequirement } from 'interfaces/requirement';
import { INestedQuestion } from 'interfaces/question';
import { LinkifyText } from 'components/LinkifyText';
import { QuestionContext } from './Context';
import { QuestionPaper } from './QuestionPaper';
import { ReferencesContainer } from 'features/references/containers/References';
import { resolveQuestionNumber } from 'helpers/questionNumber';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

const { Accepted, Rejected, Acceptable, AcceptableOrRejectable, AutoRejected } = AnswerStatus;

const styles = (theme: Theme) => ({
  divideRight: {
    borderRight: `1px solid ${theme.palette.divider}`
  }
});

type OwnProps = {
  organizationId: string;
  requirement: DeepReadonly<IContractorRequirement> | null;
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | null;
  question?: DeepReadonly<INestedQuestion> | null;
  answer?: DeepReadonly<IAnswer> | null;
  safetyProgramRequirementId: string;
  questionId: string;
  search: string;
};

type Props = WithStyles<typeof styles> & OwnProps;

const Component: React.FC<Props> = ({
  organizationId,
  requirement,
  isFetching,
  error,
  question,
  answer,
  safetyProgramRequirementId,
  questionId,
  search,
  classes
}) => {
  const questionNumber = requirement && resolveQuestionNumber(requirement.questions, questionId);
  const { nextQuestionId, prevQuestionId } =
    (requirement && getAdjacentEvaluatorQuestionIds(requirement.questions, requirement.questionAnswers, questionId)) ||
    {};
  const { t } = useTranslation();

  return (
    <GridContainer>
      <EvaluatorRequirementBreadcrumbs
        organizationId={organizationId}
        isFetching={isFetching}
        requirement={requirement}
        safetyProgramRequirementId={safetyProgramRequirementId}
        search={search}
        links={[
          {
            to: `/organizations/${organizationId}/safety-program-requirements/${safetyProgramRequirementId}/questions/${questionId}`,
            children:
              !isFetching && questionNumber
                ? t('safetyPrograms.common.questionNumber', {
                    questionNumber,
                    defaultValue: 'Question {{questionNumber}}'
                  })
                : '⋯'
          }
        ]}
      />
      <Grid item xs={12}>
        <QuestionPaper requirement={requirement} isFetching={isFetching} error={error} question={question}>
          {requirement && question && (
            <GridContainer>
              <QuestionContext
                question={question}
                questionNumber={questionNumber}
                nextQuestionUrl={
                  nextQuestionId &&
                  `/organizations/${organizationId}/safety-program-requirements/${safetyProgramRequirementId}/questions/${nextQuestionId}`
                }
                prevQuestionUrl={
                  prevQuestionId &&
                  `/organizations/${organizationId}/safety-program-requirements/${safetyProgramRequirementId}/questions/${prevQuestionId}`
                }
              />
              <Grid item xs={6} className={classes.divideRight} style={{ paddingLeft: 0 }}>
                <GridContainer>
                  <Grid item xs={12}>
                    {question.body && (
                      <Typography paragraph>
                        <LinkifyText>{question.body}</LinkifyText>
                      </Typography>
                    )}
                    {answer ? (
                      <GridContainer style={{ padding: 0 }}>
                        <Grid item xs={12}>
                          <FormControl>
                            <RadioGroup>
                              <FormControlLabel
                                control={<Radio checked={answer.answerValue === true} />}
                                label={t('safetyPrograms.common.yes', 'Yes')}
                                disabled
                              />
                              <FormControlLabel
                                control={<Radio checked={answer.answerValue === false} />}
                                label={t('safetyPrograms.common.no', 'No')}
                                disabled
                              />
                            </RadioGroup>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} style={{ padding: 0 }}>
                          {answer.status === Accepted ? (
                            <GridContainer>
                              <Grid item>
                                <Button variant="outlined" disabled>
                                  <CheckRoundedIcon />
                                  {t('safetyPrograms.common.accepted', 'Accepted')}
                                </Button>
                              </Grid>
                            </GridContainer>
                          ) : answer.status === Rejected || answer.status === AutoRejected ? (
                            <GridContainer>
                              <Grid item>
                                <ErrorButton variant="outlined" disabled>
                                  <CloseRoundedIcon />
                                  {t('safetyPrograms.common.rejected', 'Rejected')}
                                </ErrorButton>
                              </Grid>
                            </GridContainer>
                          ) : (
                            <GridContainer>
                              <Grid item xs={12}>
                                <Typography color="textPrimary">
                                  {[Acceptable, AcceptableOrRejectable].includes(answer.status)
                                    ? t(
                                        'safetyPrograms.question.evaluatorReview',
                                        'An evaluator will review this answer, and accept or reject it.'
                                      )
                                    : t(
                                        'safetyPrograms.common.answerCannotBeAccepted',
                                        'This answer cannot be accepted or rejected until the contractor submits their safety program.'
                                      )}
                                </Typography>
                              </Grid>
                            </GridContainer>
                          )}
                        </Grid>
                        <Grid item xs={12}>
                          <ReferencesContainer questionAnswerId={answer.id} isReadOnly={true} />
                        </Grid>
                      </GridContainer>
                    ) : (
                      <Typography color="textPrimary">
                        {t(
                          'safetyPrograms.common.contractorNotAnswered',
                          'The contractor hasn’t answered this question yet.'
                        )}
                      </Typography>
                    )}
                  </Grid>
                  {question.questions.length > 0 && (
                    <EvaluatorSubquestions
                      organizationId={organizationId}
                      questions={question.questions}
                      requirement={requirement}
                      safetyProgramRequirementId={safetyProgramRequirementId}
                    />
                  )}
                </GridContainer>
              </Grid>
              <Grid item xs={6} style={{ paddingRight: 0 }}>
                {answer && <ClientCommentsContainer questionAnswerId={answer.id} />}
              </Grid>
            </GridContainer>
          )}
        </QuestionPaper>
      </Grid>
    </GridContainer>
  );
};

export const ClientQuestionComponent = withStyles(styles)(Component);
