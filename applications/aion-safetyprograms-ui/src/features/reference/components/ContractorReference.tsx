import * as React from 'react';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Grid from '@material-ui/core/Grid';
import { AxiosError } from 'axios';
import { ContractorRequirementBreadcrumbs } from 'features/requirement/components/ContractorBreadcrumbs';
import { DeepReadonly } from 'utility-types';
import { Dialog, TriggerButtonProps } from '@pec/aion-ui-components/components/Dialog';
import { ErrorButton } from 'components/ErrorButton';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IContractorRequirement } from 'interfaces/requirement';
import { INestedQuestion } from 'interfaces/question';
import { IReference } from 'interfaces/reference';
import { PercentCrop } from 'react-image-crop';
import { QuestionBackButton } from 'features/question/components/BackButton';
import { QuestionPaper } from 'features/question/components/QuestionPaper';
import { ReferenceContext } from './Context';
import { ReferenceSelector } from './Selector';
import { requirementIsSubmitted } from 'helpers/requirementIsSubmitted';
import { resolveQuestionNumber } from 'helpers/questionNumber';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

type Props = {
  reference: DeepReadonly<IReference> | null;
  requirement: DeepReadonly<IContractorRequirement> | null;
  question?: DeepReadonly<INestedQuestion> | null;
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | null;
  accessToken?: string;
  onConfirmDelete: () => Promise<void>;
  handleSubmit: (pageNumber: number, crop: PercentCrop) => void;
  organizationId: string;
  safetyProgramRequirementId: string;
  questionAnswerId: string;
  documentReferenceId: string;
};

const renderTriggerButton = (props: TriggerButtonProps, t: TFunction) => (
  <ErrorButton {...props}>{t('safetyPrograms.reference.deleteReference', 'Delete Reference')}</ErrorButton>
);

export const ContractorReferenceComponent: React.FC<Props> = ({
  requirement,
  question,
  isFetching,
  organizationId,
  safetyProgramRequirementId,
  questionAnswerId,
  documentReferenceId,
  reference,
  error,
  accessToken,
  onConfirmDelete,
  handleSubmit
}) => {
  const questionNumber = (requirement && question && resolveQuestionNumber(requirement.questions, question.id)) || null;
  const isReadOnly = Boolean(requirement && requirementIsSubmitted(requirement.status));
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
              to: `/organizations/${organizationId}/safety-program-requirements/${safetyProgramRequirementId}/answers/${questionAnswerId}/references/${documentReferenceId}`,
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
                handleSubmit={isReadOnly ? undefined : handleSubmit}
              />
              {!isReadOnly && (
                <Grid item xs={12} style={{ textAlign: 'right' }}>
                  <Dialog renderTriggerButton={props => renderTriggerButton(props, t)} onConfirm={onConfirmDelete}>
                    {({ handleClose, handleConfirm }) => (
                      <React.Fragment>
                        <DialogContent>
                          <DialogContentText>
                            {t(
                              'safetyPrograms.reference.deleteDocReferenceConfirmation',
                              'Are you sure you want to delete this document reference?'
                            )}
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button color="primary" onClick={handleClose}>
                            {t('safetyPrograms.common.cancel', 'Cancel')}
                          </Button>
                          <Button color="secondary" variant="contained" onClick={handleConfirm}>
                            {t('safetyPrograms.common.yesDeleteIt', 'Yes, delete it')}
                          </Button>
                        </DialogActions>
                      </React.Fragment>
                    )}
                  </Dialog>
                </Grid>
              )}
            </GridContainer>
          )}
        </QuestionPaper>
      </Grid>
    </GridContainer>
  );
};
