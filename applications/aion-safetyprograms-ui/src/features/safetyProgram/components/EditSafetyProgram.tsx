import * as React from 'react';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { AxiosError } from 'axios';
import { Breadcrumbs } from 'components/Breadcrumbs';
import { DeepReadonly } from 'ts-essentials';
import { DropResult } from 'react-beautiful-dnd';
import { FormApi } from 'final-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IEditSafetyProgram } from 'interfaces/safetyProgram';
import { IExpandedSafetyProgram } from 'interfaces/safetyProgram';
import { Link } from 'react-router-dom';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { SafetyProgramForm } from './SafetyProgramForm';
import { SortableQuestions } from 'components/SortableQuestions';
import { useTranslation } from 'react-i18next';

type Props = {
  safetyProgramId: string;
  safetyProgram: DeepReadonly<IExpandedSafetyProgram> | null;
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | null;
  onConfirmDelete: () => Promise<void>;
  onSubmit: (values: IEditSafetyProgram, form: FormApi<IEditSafetyProgram>) => Promise<void>;
  onDragEnd: (result: DropResult) => Promise<void>;
};

export const EditSafetyProgramComponent: React.FC<Props> = ({
  safetyProgramId,
  safetyProgram,
  isFetching,
  error,
  onConfirmDelete,
  onSubmit,
  onDragEnd
}) => {
  const { t } = useTranslation();

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
              children: t('safetyPrograms.common.editProgram', 'Edit Program')
            }
          ]}
        />
      </Grid>
      <Grid item xs={12}>
        <Paper hasError={!!error} isLoading={isFetching}>
          {safetyProgram && (
            <React.Fragment>
              <SafetyProgramForm
                cancelTo={`/safety-programs/${safetyProgramId}`}
                onConfirmDelete={onConfirmDelete}
                onSubmit={onSubmit}
                initialValues={safetyProgram}
                title={t('safetyPrograms.common.editProgram', 'Edit Program')}
                submitButtonText={t('safetyPrograms.common.save', 'Save')}
              />
              <GridContainer>
                <Grid item xs={8}>
                  <SortableQuestions
                    title={t('safetyPrograms.common.questions', 'Questions')}
                    questions={safetyProgram.questions}
                    topLevelQuestions={safetyProgram.questions}
                    safetyProgramId={safetyProgramId}
                    onDragEnd={onDragEnd}
                  >
                    <Button component={Link} to={`/safety-programs/${safetyProgramId}/questions/add`}>
                      <AddIcon />
                      {t('safetyPrograms.common.addQuestion', 'Add Question')}
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
