import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { AddTaskGroupWizardStepOne } from './AddTaskGroupWizardStepOne';
import { AddTaskGroupWizardStepThree } from './AddTaskGroupWizardStepThree';
import { AddTaskGroupWizardStepTwo } from './AddTaskGroupWizardStepTwo';
import { BackTitleHeader } from '@pec/aion-ui-components/components/BackTitleHeader';
import { capitalizeFirstLetter } from '@pec/aion-ui-core/helpers/string';
import { DeepReadonly } from 'ts-essentials';
import { FileWithPath } from 'react-dropzone';
import { FormApi } from 'final-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IAddTaskGroupForm } from 'interfaces/taskGroupForm';
import { IAttachmentWithStatus } from '@pec/aion-ui-core/interfaces/attachmentWithStatus';
import { InvalidFileUpload } from 'interfaces/invalidFileUpload';
import { OwnerType } from '@pec/aion-ui-core/interfaces/taskGroup';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { Wizard } from '@pec/aion-ui-form/components/Wizard';

type Props = {
  organizationId: string;
  state?: { step: number; from?: string };
  isLoading: boolean;
  page: number;
  totalCount: number;
  onSubmit: (values: IAddTaskGroupForm, form: FormApi<IAddTaskGroupForm>, page: number) => void;
  handleChangePage: (
    form: FormApi<IAddTaskGroupForm>
  ) => (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
  addAttachments: (
    form: FormApi<IAddTaskGroupForm>,
    acceptedFiles: FileWithPath[],
    rejectedFiles: InvalidFileUpload[]
  ) => void;
  deleteAttachment: (form: FormApi<IAddTaskGroupForm>, id: string) => void;
  uploadedAttachments: DeepReadonly<IAttachmentWithStatus[]>;
};

export const AddTaskGroupWizard: React.FC<Props> = ({
  addAttachments,
  deleteAttachment,
  organizationId,
  state,
  onSubmit,
  isLoading,
  page,
  totalCount,
  handleChangePage,
  uploadedAttachments
}) => {
  const initialValues: IAddTaskGroupForm = {
    subject: '',
    content: '',
    dueDateUtc: '',
    isAttachmentRequiredForCompletion: false,
    ownerType: OwnerType.Organization,
    ownerId: organizationId,
    contractors: [],
    tags: [],
    ignoredAssigneeGroups: [],
    confirmContractorsByTags: [],
    attachments: []
  };

  const steps = [
    { label: 'Enter in your task information' },
    {
      label: 'Add contractors by tags',
      optional: true,
      optionalLabel: 'Optional if no contractors are selected'
    },
    {
      label: 'Add individual contractors',
      optional: true,
      optionalLabel: 'Optional if no tags are selected'
    }
  ];

  const handleAddAttachments = (form: FormApi<IAddTaskGroupForm>) => (
    acceptedFiles: FileWithPath[],
    rejectedFiles: InvalidFileUpload[]
  ) => {
    addAttachments(form, acceptedFiles, rejectedFiles);
  };

  const handleDeleteAttachment = (form: FormApi<IAddTaskGroupForm>) => (id: string) => {
    deleteAttachment(form, id);
  };

  const referrer = state && state.from;

  return (
    <React.Fragment>
      <GridContainer>
        <Grid item>
          <BackTitleHeader
            to={
              referrer === 'contractors'
                ? `/${organizationId}/alerts/taskGroups/contractors`
                : referrer === 'tasks'
                ? `/${organizationId}/alerts/tasks/all`
                : `/${organizationId}/alerts/taskGroups/all`
            }
            linkTitle={`Back to ${
              referrer === 'contractors' || referrer === 'tasks' ? capitalizeFirstLetter(referrer) : 'Grouped Tasks'
            }`}
          >
            Assign New Task
          </BackTitleHeader>
        </Grid>
      </GridContainer>
      <Paper>
        <GridContainer>
          <Grid item xs={12}>
            <Wizard
              initialValues={initialValues}
              cancelLink={`/${organizationId}/alerts/taskGroups`}
              onSubmit={onSubmit}
              maxSteps={steps.length}
              steps={steps}
            >
              {({ form, step }) => (
                <Wizard.Steps step={step}>
                  <Wizard.Step>
                    <AddTaskGroupWizardStepOne
                      addAttachments={handleAddAttachments(form)}
                      deleteAttachment={handleDeleteAttachment(form)}
                      uploadedAttachments={uploadedAttachments}
                    />
                  </Wizard.Step>
                  <Wizard.Step>
                    <AddTaskGroupWizardStepTwo
                      isLoading={isLoading}
                      page={page}
                      totalCount={totalCount}
                      handleChangePage={handleChangePage}
                    />
                  </Wizard.Step>
                  <Wizard.Step>
                    <AddTaskGroupWizardStepThree />
                  </Wizard.Step>
                </Wizard.Steps>
              )}
            </Wizard>
          </Grid>
        </GridContainer>
      </Paper>
    </React.Fragment>
  );
};
