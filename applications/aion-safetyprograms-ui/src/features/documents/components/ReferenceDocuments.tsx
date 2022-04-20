import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { AddDocumentContainer } from 'features/document/containers/AddDocument';
import { AxiosError } from 'axios';
import { ContractorRequirementBreadcrumbs } from 'features/requirement/components/ContractorBreadcrumbs';
import { DeepReadonly } from 'ts-essentials';
import { DocumentsTableContainer } from '../containers/DocumentsTable';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IContractorRequirement } from 'interfaces/requirement';
import { INestedQuestion } from 'interfaces/question';
import { QuestionBackButton } from 'features/question/components/BackButton';
import { QuestionPaper } from 'features/question/components/QuestionPaper';
import { resolveQuestionNumber } from 'helpers/questionNumber';
import { Paper } from 'components/Paper';
import { useTranslation } from 'react-i18next';

type Props = {
  organizationId: string;
  safetyProgramRequirementId: string;
  questionAnswerId: string;
  requirement: DeepReadonly<IContractorRequirement> | null;
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | null;
  question?: DeepReadonly<INestedQuestion> | null;
};

export const ReferenceDocumentsComponent: React.FC<Props> = ({
  isFetching,
  organizationId,
  requirement,
  safetyProgramRequirementId,
  error,
  question,
  questionAnswerId
}) => {
  const questionNumber = (requirement && question && resolveQuestionNumber(requirement.questions, question.id)) || null;
  const { t } = useTranslation();

  return (
    <GridContainer>
      <ContractorRequirementBreadcrumbs
        isFetching={isFetching}
        organizationId={organizationId}
        requirement={requirement}
        safetyProgramRequirementId={safetyProgramRequirementId}
        links={
          question
            ? [
                {
                  to: `/organizations/${organizationId}/safety-program-requirements/${safetyProgramRequirementId}/questions/${question.id}`,
                  children:
                    !isFetching && questionNumber
                      ? t('safetyPrograms.common.questionNumber', {
                          questionNumber,
                          defaultValue: 'Question {{questionNumber}}'
                        })
                      : '⋯'
                },
                {
                  to: `/organizations/${organizationId}/safety-program-requirements/${safetyProgramRequirementId}/answers/${questionAnswerId}/references/add`,
                  children: t('safetyPrograms.common.addDocumentation', 'Add Documentation')
                }
              ]
            : undefined
        }
      />
      <Grid item xs={12}>
        <QuestionPaper requirement={requirement} isFetching={isFetching} error={error} question={question}>
          {requirement && question && (
            <GridContainer>
              <QuestionBackButton
                organizationId={organizationId}
                safetyProgramRequirementId={safetyProgramRequirementId}
                questionId={question.id}
                questionNumber={questionNumber}
              />
              <Grid item xs={8}>
                <Typography variant="h6" paragraph>
                  {t('safetyPrograms.common.addDocumentation', 'Add Documentation')}
                </Typography>
                <Typography>
                  {questionNumber ? `${questionNumber}. ` : ''}
                  {question.title}
                </Typography>
              </Grid>
              {question.body && (
                <Grid item xs={8}>
                  <Typography variant="body2">{question.body}</Typography>
                </Grid>
              )}
              <Grid item xs={8}>
                <Paper variant="outlined" style={{ padding: 0 }}>
                  <GridContainer justify="space-between">
                    <Grid item>
                      <Typography variant="subtitle2" color="secondary">
                        {t('safetyPrograms.documents.selectDocument', 'Select a Document')}
                      </Typography>
                    </Grid>
                    <DocumentsTableContainer
                      isContractor={true}
                      organizationId={organizationId}
                      basepath={`/organizations/${organizationId}/safety-program-requirements/${safetyProgramRequirementId}/answers/${questionAnswerId}/references/add`}
                    />
                  </GridContainer>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <AddDocumentContainer />
              </Grid>
            </GridContainer>
          )}
        </QuestionPaper>
      </Grid>
    </GridContainer>
  );
};
