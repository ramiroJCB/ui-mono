import { TaskStatus } from '@pec/aion-ui-core/interfaces/taskGroup';

const { AssigneeReplied, AwaitingAction, Incomplete, OwnerReplied, Submitted } = TaskStatus;

export const getImpliedIconStatus = (isAssignee: boolean, status: TaskStatus) => {
  return isAssignee
    ? status
    : status === AssigneeReplied || status === Submitted
    ? AwaitingAction
    : status === OwnerReplied
    ? Incomplete
    : status;
};
