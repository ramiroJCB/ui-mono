import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { EvaluatorRequirementBreadcrumbs } from 'features/requirement/components/EvaluatorBreadcrumbs';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IContractorRequirement } from 'interfaces/requirement';
import { INestedQuestion } from 'interfaces/question';
import { IReference } from 'interfaces/reference';
import { QuestionBackButton } from 'features/question/components/BackButton';
import { QuestionPaper } from 'features/question/components/QuestionPaper';
import { ReferenceContext } from './Context';
import { ReferenceSelector } from './Selector';
import { resolveQuestionNumber } from 'helpers/questionNumber';
import { useTranslation } from 'react-i18next';

type Props = {
  organizationId?: string;
  reference: DeepReadonly<IReference> | null;
  requirement: DeepReadonly<IContractorRequirement> | null;
  question?: DeepReadonly<INestedQuestion> | null;
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | null;
  accessToken?: string;
  safetyProgramRequirementId: string;
  questionAnswerId: string;
  documentReferenceId: string;
  search: string;
};

export const EvaluatorReferenceComponent: React.FC<Props> = ({
  organizationId,
  requirement,
  question,
  isFetching,
  safetyProgramRequirementId,
  questionAnswerId,
  documentReferenceId,
  reference,
  error,
  accessToken,
  search
}) => {
  const questionNumber = (requirement && question && resolveQuestionNumber(requirement.questions, question.id)) || null;
  const { t } = useTranslation();

  return (
    <GridContainer>
      {question && (
        <EvaluatorRequirementBreadcrumbs
          organizationId={organizationId}
          isFetching={isFetching}
          requirement={requirement}
          safetyProgramRequirementId={safetyProgramRequirementId}
          search={search}
          links={[
            {
              to: organizationId
                ? `/organizations/${organizationId}/safety-program-requirements/${safetyProgramRequirementId}/questions/${question.id}`
                : `/safety-program-requirements/${safetyProgramRequirementId}/questions/${question.id}`,
              children:
                !isFetching && questionNumber
                  ? t('safetyPrograms.common.questionNumber', {
                      questionNumber,
                      defaultValue: 'Question {{questionNumber}}'
                    })
                  : '⋯'
            },
            {
              to: organizationId
                ? `/organizations/${organizationId}/safety-program-requirements/${safetyProgramRequirementId}/answers/${questionAnswerId}/references/${documentReferenceId}`
                : `/safety-program-requirements/${safetyProgramRequirementId}/answers/${questionAnswerId}/references/${documentReferenceId}`,
              children:
                !isFetching && reference ? (
                  <span style={{ overflowWrap: 'anywhere' }}>{reference.documentMetadata.fileName}</span>
                ) : (
                  '⋯'
                )
            }
          ]}
        />
      )}
      <Grid item xs={12}>
        <QuestionPaper requirement={requirement} isFetching={isFetching} error={error} question={question}>
          {question && reference && reference.id === documentReferenceId && accessToken && (
            <GridContainer>
              <QuestionBackButton
                organizationId={organizationId}
                safetyProgramRequirementId={safetyProgramRequirementId}
                questionId={question.id}
                questionNumber={questionNumber}
              />
              <ReferenceContext
                fileName={reference.documentMetadata.fileName}
                question={question}
                questionNumber={questionNumber}
              />
              <ReferenceSelector
                fileName={reference.documentMetadata.fileName}
                file={{
                  url: `/files/v1/safetyProgramDocuments(${reference.documentMetadataId})`,
                  httpHeaders: {
                    Authorization: `Bearer ${accessToken}`,
                    'X-Aion-OrganizationId': organizationId
                  }
                }}
                pageNumber={reference.pageNumber}
                crop={reference.selectionLocation}
              />
            </GridContainer>
          )}
        </QuestionPaper>
      </Grid>
    </GridContainer>
  );
};
