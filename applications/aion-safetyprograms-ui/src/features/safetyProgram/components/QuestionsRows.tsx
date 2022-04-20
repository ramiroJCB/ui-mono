import * as React from 'react';
import EditIcon from '@material-ui/icons/Edit';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';
import { DeepReadonly } from 'ts-essentials';
import { INestedQuestion } from 'interfaces/question';
import { LinkedRow } from '@pec/aion-ui-components/components/LinkedRow';
import { resolveQuestionNumber } from 'helpers/questionNumber';
import { withTheme, WithTheme } from '@material-ui/core';
import { localizeDate, localizeDateTime } from '@pec/aion-ui-i18next/helpers/localize';
import { useTranslation } from 'react-i18next';

type OwnProps = {
  topLevelQuestions: DeepReadonly<INestedQuestion[]>;
  questions: DeepReadonly<INestedQuestion[]>;
  depth?: number;
  safetyProgramId: string;
};

type Props = WithTheme & OwnProps;

const Component: React.FC<Props> = ({ topLevelQuestions, questions, depth = 0, safetyProgramId, theme }) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      {questions.map(({ id, title, updatedDateUtc, updatedBy, questions: subQuestions }) => {
        const date = new Date(updatedDateUtc);

        return (
          <React.Fragment key={id}>
            <LinkedRow to={`/safety-programs/${safetyProgramId}/questions/${id}`}>
              <TableCell>
                <Typography variant="body2" style={{ paddingLeft: theme.spacing() * depth * 4 }} title={title} noWrap>
                  {resolveQuestionNumber(topLevelQuestions, id)}. {title}
                </Typography>
              </TableCell>
              <TableCell title={localizeDateTime(date, t)}>{localizeDate(date, t)}</TableCell>
              <TableCell>
                <Typography variant="body2" title={updatedBy} noWrap>
                  {updatedBy}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <EditIcon fontSize="small" color="action" />
              </TableCell>
            </LinkedRow>
            {subQuestions.length > 0 && (
              <SafetyProgramQuestionsRowsComponent
                topLevelQuestions={topLevelQuestions}
                questions={subQuestions}
                depth={depth + 1}
                safetyProgramId={safetyProgramId}
              />
            )}
          </React.Fragment>
        );
      })}
    </React.Fragment>
  );
};

export const SafetyProgramQuestionsRowsComponent = withTheme(Component);
