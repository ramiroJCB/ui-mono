import * as React from 'react';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { AxiosError } from 'axios';
import { Breadcrumbs } from 'components/Breadcrumbs';
import { DeepReadonly } from 'ts-essentials';
import { DropResult } from 'react-beautiful-dnd';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IEditQuestion, IExpandedQuestion, IQuestion } from 'interfaces/question';
import { IExpandedSafetyProgram } from 'interfaces/safetyProgram';
import { Link } from 'react-router-dom';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { QuestionForm } from './QuestionForm';
import { SortableQuestions } from 'components/SortableQuestions';
import { useTranslation } from 'react-i18next';

type Props = {
  safetyProgramId: string;
  questionId: string;
  question: DeepReadonly<IExpandedQuestion> | null;
  safetyProgram: DeepReadonly<IExpandedSafetyProgram> | null;
  questionNumber: string | null;
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | null;
  onConfirmDelete: () => Promise<void>;
  onSubmit: (values: IEditQuestion) => Promise<IQuestion>;
  onDragEnd: (result: DropResult) => Promise<void>;
};

export const EditQuestionComponent: React.FC<Props> = ({
  safetyProgramId,
  questionId,
  question,
  questionNumber,
  safetyProgram,
  isFetching,
  error,
  onConfirmDelete,
  onSubmit,
  onDragEnd
}) => {
  const { t } = useTranslation();
  const title =
    !isFetching && questionNumber
      ? t('safetyPrograms.question.editQuestion', {
          questionNumber,
          defaultValue: 'Edit Question {{questionNumber}}'
        })
      : '⋯';

  return (
    <GridContainer>
      <Grid item xs={12}>
        <Breadcrumbs
          links={[
            {
              to: '/safety-programs',
              children: t('safetyPrograms.common.programEditor', 'Program Editor')
            },
            {
              to: `/safety-programs/${safetyProgramId}`,
              children: !isFetching && safetyProgram ? safetyProgram.title : '⋯'
            },
            {
              to: `/safety-programs/${safetyProgramId}/questions/${questionId}`,
              children: title
            }
          ]}
        />
      </Grid>
      <Grid item xs={12}>
        <Paper hasError={!!error} isLoading={isFetching}>
          {safetyProgram && question && (
            <React.Fragment>
              <QuestionForm
                safetyProgramId={safetyProgramId}
                onConfirmDelete={onConfirmDelete}
                onSubmit={onSubmit}
                initialValues={question}
                title={title}
                submitButtonText={t('safetyPrograms.common.save', 'Save')}
              />
              <GridContainer>
                <Grid item xs={8}>
                  <SortableQuestions
                    title={t('safetyPrograms.question.subQuestionsOptional', 'Subquestions (optional)')}
                    questions={question.questions}
                    topLevelQuestions={safetyProgram.questions}
                    safetyProgramId={safetyProgramId}
                    onDragEnd={onDragEnd}
                  >
                    <Button
                      component={Link}
                      to={`/safety-programs/${safetyProgramId}/questions/add?parentQuestionId=${questionId}`}
                    >
                      <AddIcon />
                      {t('safetyPrograms.question.addSubQuestion', 'Add Subquestion')}
                    </Button>
                  </SortableQuestions>
                </Grid>
              </GridContainer>
            </React.Fragment>
          )}
        </Paper>
      </Grid>
    </GridContainer>
  );
};
