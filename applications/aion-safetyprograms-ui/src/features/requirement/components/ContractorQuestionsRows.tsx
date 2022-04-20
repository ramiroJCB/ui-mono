import * as React from 'react';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';
import { CommentsBadge } from 'components/CommentsBadge';
import { ContractorQuestionStatus } from 'features/question/components/ContractorQuestionStatus';
import { DeepReadonly } from 'ts-essentials';
import { IAnswer } from 'interfaces/answer';
import { INestedQuestion } from 'interfaces/question';
import { LinkedRow } from '@pec/aion-ui-components/components/LinkedRow';
import { requiresParentAnswer } from 'helpers/requiresParentAnswer';
import { resolveQuestionNumber } from 'helpers/questionNumber';
import { withTheme, WithTheme } from '@material-ui/core';

type OwnProps = {
  topLevelQuestions: DeepReadonly<INestedQuestion[]>;
  answers: DeepReadonly<IAnswer[]>;
  questions: DeepReadonly<INestedQuestion[]>;
  depth?: number;
  organizationId: string;
  safetyProgramRequirementId: string;
};

type Props = WithTheme & OwnProps;

const Component: React.FC<Props> = ({
  topLevelQuestions,
  answers,
  questions,
  depth = 0,
  organizationId,
  safetyProgramRequirementId,
  theme
}) => (
  <React.Fragment>
    {questions.map(({ id, title, questions: subQuestions, parentQuestionId }) => {
      const disabled = requiresParentAnswer(parentQuestionId, answers);
      const answer = answers.find(({ questionId }) => questionId === id);

      return (
        <React.Fragment key={id}>
          <LinkedRow
            to={`/organizations/${organizationId}/safety-program-requirements/${safetyProgramRequirementId}/questions/${id}`}
          >
            <TableCell>
              <Typography
                variant="body2"
                style={{ paddingLeft: theme.spacing() * depth * 4 }}
                title={title}
                color={disabled ? 'textSecondary' : undefined}
              >
                {resolveQuestionNumber(topLevelQuestions, id)}. {title}
              </Typography>
            </TableCell>
            <TableCell align="center">
              <ContractorQuestionStatus status={answer?.status} />
            </TableCell>
            <TableCell align="right">
              {answer && (
                <CommentsBadge
                  hasUnreadComments={answer.hasUnreadEvaluatorComments}
                  numberOfComments={answer.commentCount}
                />
              )}
            </TableCell>
            <TableCell align="center">{!disabled && <ChevronRightIcon color="action" />}</TableCell>
          </LinkedRow>
          {subQuestions.length > 0 && (
            <ContractorQuestionsRowsComponent
              topLevelQuestions={topLevelQuestions}
              answers={answers}
              questions={subQuestions}
              depth={depth + 1}
              organizationId={organizationId}
              safetyProgramRequirementId={safetyProgramRequirementId}
            />
          )}
        </React.Fragment>
      );
    })}
  </React.Fragment>
);

export const ContractorQuestionsRowsComponent = withTheme(Component);
