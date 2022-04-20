import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { AxiosError } from 'axios';
import { ContractorRequirementBreadcrumbs } from 'features/requirement/components/ContractorBreadcrumbs';
import { DeepReadonly } from 'utility-types';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IContractorRequirement } from 'interfaces/requirement';
import { IDocument } from 'interfaces/document';
import { INestedQuestion } from 'interfaces/question';
import { PercentCrop } from 'react-image-crop';
import { QuestionBackButton } from 'features/question/components/BackButton';
import { QuestionPaper } from 'features/question/components/QuestionPaper';
import { ReferenceContext } from './Context';
import { ReferenceSelector } from './Selector';
import { resolveQuestionNumber } from 'helpers/questionNumber';
import { useTranslation } from 'react-i18next';

type Props = {
  document: DeepReadonly<IDocument> | null;
  requirement: DeepReadonly<IContractorRequirement> | null;
  question?: DeepReadonly<INestedQuestion> | null;
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | null;
  accessToken?: string;
  handleSubmit: (pageNumber: number, crop: PercentCrop) => void;
  organizationId: string;
  safetyProgramRequirementId: string;
  questionAnswerId: string;
  documentMetadataId: string;
};

export const AddReferenceComponent: React.FC<Props> = ({
  requirement,
  question,
  document,
  isFetching,
  organizationId,
  safetyProgramRequirementId,
  questionAnswerId,
  documentMetadataId,
  error,
  accessToken,
  handleSubmit
}) => {
  const questionNumber = (requirement && question && resolveQuestionNumber(requirement.questions, question.id)) || null;
  const { t } = useTranslation();

  return (
    <GridContainer>
      {question && (
        <ContractorRequirementBreadcrumbs
          isFetching={isFetching}
          organizationId={organizationId}
          requirement={requirement}
          safetyProgramRequirementId={safetyProgramRequirementId}
          links={[
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
              to: `/organizations/${organizationId}/safety-program-requirements/${safetyProgramRequirementId}/answers/${questionAnswerId}/references/add/${documentMetadataId}`,
              children:
                !isFetching && document ? <span style={{ overflowWrap: 'anywhere' }}>{document.fileName}</span> : '⋯'
            }
          ]}
        />
      )}
      <Grid item xs={12}>
        <QuestionPaper requirement={requirement} isFetching={isFetching} error={error} question={question}>
          {question && document && document.id === documentMetadataId && accessToken && (
            <GridContainer>
              <QuestionBackButton
                organizationId={organizationId}
                safetyProgramRequirementId={safetyProgramRequirementId}
                questionId={question.id}
                questionNumber={questionNumber}
              />
              <ReferenceContext fileName={document.fileName} question={question} questionNumber={questionNumber} />
              <ReferenceSelector
                fileName={document.fileName}
                file={{
                  url: `/files/v1/safetyProgramDocuments(${documentMetadataId})`,
                  httpHeaders: {
                    Authorization: `Bearer ${accessToken}`,
                    'X-Aion-OrganizationId': organizationId
                  }
                }}
                pageNumber={1}
                handleSubmit={handleSubmit}
              />
            </GridContainer>
          )}
        </QuestionPaper>
      </Grid>
    </GridContainer>
  );
};
