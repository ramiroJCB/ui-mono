import * as React from 'react';
import amber from '@material-ui/core/colors/amber';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Typography from '@material-ui/core/Typography';
import { AcceptedButton } from './AcceptedButton';
import { AnswerStatus, IAnswer } from 'interfaces/answer';
import { AxiosError } from 'axios';
import { CommentsContainer } from 'features/comments/containers/Comments';
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
import { RejectedButton } from './RejectedButton';
import { resolveQuestionNumber } from 'helpers/questionNumber';
import { useSharedQuestionStyles } from './ContractorQuestion';
import { useScreenSize } from '@pec/aion-ui-components/hooks/useScreenSize';
import { useTranslation } from 'react-i18next';

const { Accepted, Rejected, AutoRejected, Acceptable, AcceptableOrRejectable } = AnswerStatus;

type Props = {
  requirement: DeepReadonly<IContractorRequirement> | null;
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | null;
  question?: DeepReadonly<INestedQuestion> | null;
  answer?: DeepReadonly<IAnswer> | null;
  safetyProgramRequirementId: string;
  questionId: string;
  changeAnswerStatus: (status: AnswerStatus) => () => void;
  resetAnswerStatus: () => void;
  search: string;
};

export const EvaluatorQuestionComponent: React.FC<Props> = ({
  requirement,
  isFetching,
  error,
  question,
  answer,
  safetyProgramRequirementId,
  questionId,
  changeAnswerStatus,
  resetAnswerStatus,
  search
}) => {
  const questionNumber = requirement && resolveQuestionNumber(requirement.questions, questionId);
  const { nextQuestionId, prevQuestionId } =
    (requirement && getAdjacentEvaluatorQuestionIds(requirement.questions, requirement.questionAnswers, questionId)) ||
    {};
  const classes = useSharedQuestionStyles();
  const { isMediumUp } = useScreenSize();
  const { t } = useTranslation();

  return (
    <GridContainer>
      <EvaluatorRequirementBreadcrumbs
        isFetching={isFetching}
        requirement={requirement}
        safetyProgramRequirementId={safetyProgramRequirementId}
        search={search}
        links={[
          {
            to: `/safety-program-requirements/${safetyProgramRequirementId}/questions/${questionId}`,
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
              <Grid
                item
                xs={12}
                md={6}
                className={isMediumUp ? classes.divideRight : classes.divideBottom}
                style={{ paddingLeft: 0 }}
              >
                <Box mb={2}>
                  <QuestionContext
                    question={question}
                    questionNumber={questionNumber}
                    nextQuestionUrl={
                      nextQuestionId &&
                      `/safety-program-requirements/${safetyProgramRequirementId}/questions/${nextQuestionId}`
                    }
                    prevQuestionUrl={
                      prevQuestionId &&
                      `/safety-program-requirements/${safetyProgramRequirementId}/questions/${prevQuestionId}`
                    }
                  />
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
                                  <AcceptedButton />
                                </Grid>
                                <Grid item>
                                  <Button onClick={resetAnswerStatus}>{t('safetyPrograms.common.undo', 'Undo')}</Button>
                                </Grid>
                              </GridContainer>
                            ) : answer.status === Rejected || answer.status === AutoRejected ? (
                              <GridContainer>
                                <Grid item>
                                  <RejectedButton />
                                </Grid>
                                <Grid item>
                                  <Button onClick={resetAnswerStatus} disabled={answer.status === AutoRejected}>
                                    {t('safetyPrograms.common.undo', 'Undo')}
                                  </Button>
                                </Grid>
                              </GridContainer>
                            ) : answer.status === AcceptableOrRejectable ? (
                              <GridContainer>
                                <Grid item xs={12}>
                                  <Typography color="secondary">
                                    {t(
                                      'safetyPrograms.question.reviewDocAndComments',
                                      'Please review all documentation and comments, then click “Accept” or “Reject.”'
                                    )}
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <Button variant="contained" color="secondary" onClick={changeAnswerStatus(Accepted)}>
                                    {t('safetyPrograms.common.accept', 'Accept')}
                                  </Button>
                                </Grid>
                                <Grid item>
                                  <ErrorButton variant="contained" onClick={changeAnswerStatus(Rejected)}>
                                    {t('safetyPrograms.common.reject', 'Reject')}
                                  </ErrorButton>
                                </Grid>
                              </GridContainer>
                            ) : answer.status === Acceptable ? (
                              <GridContainer>
                                <Grid item xs={12}>
                                  <Typography style={{ color: amber[900] }}>
                                    {t(
                                      'safetyPrograms.question.pleaseAddComment',
                                      'If this answer should be rejected, please add a comment to explain why, then click “Reject.”'
                                    )}
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <Button variant="contained" color="secondary" onClick={changeAnswerStatus(Accepted)}>
                                    {t('safetyPrograms.common.accept', 'Accept')}
                                  </Button>
                                </Grid>
                                <Grid item>
                                  <ErrorButton variant="contained" disabled>
                                    {t('safetyPrograms.common.reject', 'Reject')}
                                  </ErrorButton>
                                </Grid>
                              </GridContainer>
                            ) : (
                              <GridContainer>
                                <Grid item xs={12}>
                                  <Typography color="textPrimary">
                                    {t(
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
                        questions={question.questions}
                        requirement={requirement}
                        safetyProgramRequirementId={safetyProgramRequirementId}
                      />
                    )}
                  </GridContainer>
                </Box>
              </Grid>
              <Grid item xs={12} md={6} style={{ paddingRight: 0 }}>
                {answer && (
                  <CommentsContainer
                    safetyProgramRequirementId={safetyProgramRequirementId}
                    questionAnswerId={answer.id}
                    requirementStatus={requirement.status}
                    isEvaluator={true}
                  />
                )}
              </Grid>
            </GridContainer>
          )}
        </QuestionPaper>
      </Grid>
    </GridContainer>
  );
};
