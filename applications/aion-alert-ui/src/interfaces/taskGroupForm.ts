import { DeepReadonly } from 'ts-essentials';
import { IAttachmentWithStatus } from '@pec/aion-ui-core/interfaces/attachmentWithStatus';
import { IContractor } from './contractor';
import { ITag } from './tag';
import { OwnerType } from '@pec/aion-ui-core/interfaces/taskGroup';

export interface ITaskGroupForm {
  subject: string;
  content: string;
  attachments: DeepReadonly<IAttachmentWithStatus[]>;
  dueDateUtc: string;
  isAttachmentRequiredForCompletion: boolean;
}

export interface IAddTaskGroupForm extends ITaskGroupForm {
  ownerType: OwnerType;
  ownerId: string;
  contractors: IContractor[];
  tags: ITag[];
  confirmContractorsByTags: IAssignedContractor[];
  ignoredAssigneeGroups: string[];
}

export interface IAssignedContractor extends IContractor {
  ignore: boolean;
}
