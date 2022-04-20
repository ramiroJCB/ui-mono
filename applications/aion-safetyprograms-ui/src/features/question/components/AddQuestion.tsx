import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { AxiosError } from 'axios';
import { Breadcrumbs } from 'components/Breadcrumbs';
import { DeepReadonly } from 'ts-essentials';
import { gracePeriodExpired } from 'helpers/gracePeriodExpired';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IAddQuestion } from 'interfaces/question';
import { IExpandedSafetyProgram } from 'interfaces/safetyProgram';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { QuestionForm } from './QuestionForm';
import { useTranslation } from 'react-i18next';

type Props = {
  safetyProgramId: string;
  safetyProgram: DeepReadonly<IExpandedSafetyProgram> | null;
  questionNumber: string | null;
  gracePeriodPrompted: boolean;
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | null;
  onSubmit: (values: IAddQuestion) => Promise<void>;
  initialValues: Pick<IAddQuestion, 'safetyProgramId' | 'parentQuestionId'>;
};

export const AddQuestionComponent: React.FC<Props> = ({
  safetyProgramId,
  safetyProgram,
  questionNumber,
  gracePeriodPrompted,
  isFetching,
  error,
  onSubmit,
  initialValues
}) => {
  const { t } = useTranslation();
  const title =
    !isFetching && questionNumber
      ? t('safetyPrograms.question.addQuestion', {
          questionNumber,
          defaultValue: 'Add Question {{questionNumber}}'
        })
      : '⋯';
  const [gracePeriodPrompt, setGracePeriodPrompt] = React.useState(false);
  const gracePeriodExists =
    (safetyProgram?.gracePeriodExpirationDateUtc !== null || gracePeriodPrompted) &&
    !gracePeriodExpired(safetyProgram?.gracePeriodExpirationDateUtc);

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
              to: `/safety-programs/${safetyProgramId}/questions/add${
                initialValues.parentQuestionId
                  ? `?parentQuestionId=${encodeURIComponent(initialValues.parentQuestionId)}`
                  : ''
              }`,
              children: title
            }
          ]}
        />
      </Grid>
      <Grid item xs={12}>
        <Paper hasError={!!error} isLoading={isFetching}>
          <QuestionForm
            safetyProgramId={safetyProgramId}
            gracePeriodPrompt={gracePeriodPrompt}
            setGracePeriodPrompt={setGracePeriodPrompt}
            gracePeriodExists={gracePeriodExists}
            onSubmit={onSubmit}
            initialValues={initialValues}
            title={title}
            submitButtonText={t('safetyPrograms.common.next', 'Next')}
          />
        </Paper>
      </Grid>
    </GridContainer>
  );
};
