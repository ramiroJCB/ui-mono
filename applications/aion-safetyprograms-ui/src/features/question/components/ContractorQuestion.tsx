import * as React from 'react';
import Box from '@material-ui/core/Box';
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
import { ContractorRequirementBreadcrumbs } from 'features/requirement/components/ContractorBreadcrumbs';
import { ContractorSubmitContainer } from 'features/requirement/containers/ContractorSubmit';
import { ContractorSubquestions } from './ContractorSubquestions';
import { DeepReadonly } from 'ts-essentials';
import { getAdjacentContractorQuestionIds } from 'helpers/getAdjacentQuestionIds';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IContractorRequirement } from 'interfaces/requirement';
import { INestedQuestion } from 'interfaces/question';
import { LinkifyText } from 'components/LinkifyText';
import { NavLink } from 'components/NavLink';
import { QuestionContext } from './Context';
import { QuestionPaper } from './QuestionPaper';
import { ReferencesContainer } from 'features/references/containers/References';
import { RejectedButton } from './RejectedButton';
import { requirementIsSubmitted as requirementIsSubmittedHelper } from 'helpers/requirementIsSubmitted';
import { requiresParentAnswer as requiresParentAnswerHelper } from 'helpers/requiresParentAnswer';
import { resolveQuestionNumber } from 'helpers/questionNumber';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useScreenSize } from '@pec/aion-ui-components/hooks/useScreenSize';
import { Trans, useTranslation } from 'react-i18next';

const { Accepted, Incomplete, Rejected, AutoRejected } = AnswerStatus;

export const useSharedQuestionStyles = makeStyles((theme: Theme) => ({
  divideRight: {
    borderRight: `1px solid ${theme.palette.divider}`
  },
  divideBottom: {
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}));

type Props = {
  requirement: DeepReadonly<IContractorRequirement> | null;
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | null;
  question?: DeepReadonly<INestedQuestion> | null;
  answer?: DeepReadonly<IAnswer> | null;
  organizationId: string;
  safetyProgramRequirementId: string;
  questionId: string;
  handleChangeAnswerValue: (event: React.ChangeEvent, value: 'true' | 'false') => void;
};

export const ContractorQuestionComponent: React.FC<Props> = ({
  requirement,
  isFetching,
  error,
  question,
  answer,
  organizationId,
  safetyProgramRequirementId,
  questionId,
  handleChangeAnswerValue
}) => {
  const questionNumber = requirement && resolveQuestionNumber(requirement.questions, questionId);
  const { nextQuestionId, prevQuestionId } =
    (requirement && getAdjacentContractorQuestionIds(requirement.questions, requirement.questionAnswers, questionId)) ||
    {};
  const requiresParentAnswer = Boolean(
    question && requirement && requiresParentAnswerHelper(question.parentQuestionId, requirement.questionAnswers)
  );
  const requirementIsSubmitted = Boolean(requirement && requirementIsSubmittedHelper(requirement.status));
  const isReadOnly = requirementIsSubmitted || answer?.status === Accepted;
  const classes = useSharedQuestionStyles();
  const { isMediumUp } = useScreenSize();
  const { t } = useTranslation();

  return (
    <GridContainer>
      <GridContainer justify="space-between">
        <ContractorRequirementBreadcrumbs
          isFetching={isFetching}
          organizationId={organizationId}
          requirement={requirement}
          safetyProgramRequirementId={safetyProgramRequirementId}
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
        {requirement && (
          <Grid item>
            <ContractorSubmitContainer safetyProgramRequirementId={safetyProgramRequirementId} />
          </Grid>
        )}
      </GridContainer>
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
                      `/organizations/${organizationId}/safety-program-requirements/${safetyProgramRequirementId}/questions/${nextQuestionId}`
                    }
                    prevQuestionUrl={
                      prevQuestionId &&
                      `/organizations/${organizationId}/safety-program-requirements/${safetyProgramRequirementId}/questions/${prevQuestionId}`
                    }
                  />
                  <GridContainer>
                    <Grid item xs={12}>
                      {question.body && (
                        <Typography paragraph>
                          <LinkifyText>{question.body}</LinkifyText>
                        </Typography>
                      )}
                      <GridContainer style={{ padding: 0 }}>
                        <Grid item xs={12}>
                          {requiresParentAnswer ? (
                            <Typography color="secondary" paragraph>
                              <Trans i18nKey="safetyPrograms.question.thisQuestionOnlyApplies">
                                This question only applies if you answer “Yes” to its parent question.{' '}
                                <NavLink
                                  color="inherit"
                                  underline="always"
                                  to={`/organizations/${organizationId}/safety-program-requirements/${safetyProgramRequirementId}`}
                                >
                                  Click here to go back.
                                </NavLink>
                              </Trans>
                            </Typography>
                          ) : requirementIsSubmitted ? (
                            <Typography color="secondary" paragraph>
                              {t(
                                'safetyPrograms.question.changesDisabledBecauseProgramSubmitted',
                                'Changes are disabled because this program has been submitted.'
                              )}
                            </Typography>
                          ) : answer ? (
                            answer.status === Accepted && (
                              <Typography color="secondary" paragraph>
                                {t(
                                  'safetyPrograms.question.changesDisabledBecauseAnswerAccepted',
                                  'Changes are disabled because this answer has been accepted by an evaluator.'
                                )}
                              </Typography>
                            )
                          ) : (
                            <Typography color="secondary" paragraph>
                              {t('safetyPrograms.question.answerYesNo', 'Please answer “Yes” or “No”.')}
                            </Typography>
                          )}
                          <FormControl>
                            <RadioGroup onChange={handleChangeAnswerValue}>
                              <FormControlLabel
                                control={<Radio checked={answer?.answerValue === true} />}
                                label={t('safetyPrograms.common.yes', 'Yes')}
                                value="true"
                                disabled={requiresParentAnswer || isReadOnly}
                              />
                              <FormControlLabel
                                control={<Radio checked={answer?.answerValue === false} />}
                                label={t('safetyPrograms.common.no', 'No')}
                                value="false"
                                disabled={requiresParentAnswer || isReadOnly}
                              />
                            </RadioGroup>
                          </FormControl>
                        </Grid>
                        {answer && (
                          <React.Fragment>
                            {!requiresParentAnswer && [Incomplete, Rejected].includes(answer.status) && (
                              <Grid item xs={12} style={{ paddingTop: 0 }}>
                                <Typography color="secondary">
                                  {answer.answerValue
                                    ? question.questions.length > 0
                                      ? t(
                                          'safetyPrograms.question.answerSubQuestions',
                                          'Please answer all of the subquestions.'
                                        )
                                      : t(
                                          'safetyPrograms.question.addDocumentation',
                                          'Please add documentation to support your answer.'
                                        )
                                    : t(
                                        'safetyPrograms.question.explainAnswer',
                                        'Please explain your answer by adding a comment.'
                                      )}
                                </Typography>
                              </Grid>
                            )}
                            {answer.status === Accepted && (
                              <Grid item xs={12}>
                                <AcceptedButton />
                              </Grid>
                            )}
                            {(answer.status === Rejected || answer.status === AutoRejected) && (
                              <Grid item xs={12}>
                                <RejectedButton />
                              </Grid>
                            )}
                            {answer.answerValue && question.questions.length === 0 && (
                              <Grid item xs={12}>
                                <ReferencesContainer questionAnswerId={answer.id} isReadOnly={isReadOnly} />
                              </Grid>
                            )}
                          </React.Fragment>
                        )}
                      </GridContainer>
                    </Grid>
                    {question.questions.length > 0 && (
                      <ContractorSubquestions
                        questions={question.questions}
                        requirement={requirement}
                        answer={answer}
                        organizationId={organizationId}
                        safetyProgramRequirementId={safetyProgramRequirementId}
                      />
                    )}
                  </GridContainer>
                </Box>
              </Grid>
              <Grid item xs={12} md={6} style={{ paddingRight: 0 }}>
                {answer && !requiresParentAnswer && (
                  <CommentsContainer
                    safetyProgramRequirementId={safetyProgramRequirementId}
                    questionAnswerId={answer.id}
                    requirementStatus={requirement.status}
                    isReadOnly={isReadOnly}
                    isEvaluator={false}
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
