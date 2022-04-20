import * as React from 'react';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';
import { CommentsBadge } from 'components/CommentsBadge';
import { DeepReadonly } from 'ts-essentials';
import { EvaluatorQuestionStatus } from 'features/question/components/EvaluatorQuestionStatus';
import { IAnswer } from 'interfaces/answer';
import { INestedQuestion } from 'interfaces/question';
import { LinkedRow } from '@pec/aion-ui-components/components/LinkedRow';
import { resolveQuestionNumber } from 'helpers/questionNumber';
import { withTheme, WithTheme } from '@material-ui/core';

type OwnProps = {
  organizationId?: string;
  topLevelQuestions: DeepReadonly<INestedQuestion[]>;
  answers: DeepReadonly<IAnswer[]>;
  questions: DeepReadonly<INestedQuestion[]>;
  depth?: number;
  safetyProgramRequirementId: string;
};

type Props = WithTheme & OwnProps;

const Component: React.FC<Props> = ({
  organizationId,
  topLevelQuestions,
  answers,
  questions,
  depth = 0,
  safetyProgramRequirementId,
  theme
}) => (
  <React.Fragment>
    {questions.map(({ id, title, questions: subQuestions }) => {
      const answer = answers.find(({ questionId }) => questionId === id);

      return (
        <React.Fragment key={id}>
          <LinkedRow
            to={
              organizationId
                ? `/organizations/${organizationId}/safety-program-requirements/${safetyProgramRequirementId}/questions/${id}`
                : `/safety-program-requirements/${safetyProgramRequirementId}/questions/${id}`
            }
          >
            <TableCell>
              <Typography
                variant="body2"
                style={{ paddingLeft: theme.spacing() * depth * 4 }}
                title={title}
                color={answer ? undefined : 'textSecondary'}
              >
                {resolveQuestionNumber(topLevelQuestions, id)}. {title}
              </Typography>
            </TableCell>
            <TableCell align="center">
              <EvaluatorQuestionStatus status={answer?.status} />
            </TableCell>
            <TableCell align="right">
              {answer && (
                <CommentsBadge
                  hasUnreadComments={answer.hasUnreadContractorComments}
                  numberOfComments={answer.commentCount}
                />
              )}
            </TableCell>
            <TableCell align="center">{answer && <ChevronRightIcon color="action" />}</TableCell>
          </LinkedRow>
          {subQuestions.length > 0 && (
            <EvaluatorQuestionsRowsComponent
              organizationId={organizationId}
              topLevelQuestions={topLevelQuestions}
              answers={answers}
              questions={subQuestions}
              depth={depth + 1}
              safetyProgramRequirementId={safetyProgramRequirementId}
            />
          )}
        </React.Fragment>
      );
    })}
  </React.Fragment>
);

export const EvaluatorQuestionsRowsComponent = withTheme(Component);
