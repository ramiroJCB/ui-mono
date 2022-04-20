import * as React from 'react';
import { addTaskGroup } from '../actions/addTaskGroup';
import { addTaskGroupAttachment } from '../actions/addTaskGroupAttachment';
import { AddTaskGroupWizard } from '../components/AddTaskGroupWizard';
import { connect } from 'react-redux';
import { deleteTaskGroupAttachment } from '../actions/deleteTaskGroupAttachment';
import { fetchContractorTags } from '../contractorTags/actions';
import { FileWithPath } from 'react-dropzone';
import { FormApi } from 'final-form';
import { IAddTaskGroupForm } from 'interfaces/taskGroupForm';
import { InvalidFileUpload } from 'interfaces/invalidFileUpload';
import { ITag } from 'interfaces/tag';
import { removePendingAttachments } from '../actions/removePendingAttachments';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
};

const mapStateToProps = (state: RootState) => {
  const { contractorTags, isFetching, error, total, currentPage } = state.contractorTags;
  const { pendingAttachments } = state.taskGroup;

  return {
    isFetching,
    error,
    total,
    currentPage,
    confirmContractorsByTags:
      contractorTags && contractorTags.every(c => c.tags !== undefined)
        ? contractorTags.map(c => ({ ...c, ignore: true }))
        : [],
    pendingAttachments
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId }
    },
    history
  }: RouteComponentProps<RouteParams>
) => ({
  addTaskGroup: (taskGroupForm: IAddTaskGroupForm) => dispatch(addTaskGroup(taskGroupForm, organizationId, history)),
  fetchContractorTags: (tags?: ITag[], page: number = 1, top: number = 10) =>
    dispatch(fetchContractorTags(page, top, tags)),
  addAttachments: (acceptedFiles: FileWithPath[], rejectedFiles: InvalidFileUpload[]) =>
    dispatch(addTaskGroupAttachment(acceptedFiles, rejectedFiles)),
  deleteAttachment: (id: string) => dispatch(deleteTaskGroupAttachment(id)),
  removePendingAttachments: () => dispatch(removePendingAttachments())
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class AddTaskGroup extends React.Component<Props> {
  componentWillUnmount() {
    this.props.removePendingAttachments();
  }

  onSubmit = async (values: IAddTaskGroupForm, _form: FormApi<IAddTaskGroupForm>, step: number) =>
    step === 3 && this.props.addTaskGroup(values);

  handleChangePage = (form: FormApi<IAddTaskGroupForm>) => async (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    page: number
  ) => {
    const { tags, ignoredAssigneeGroups } = form.getState().values;
    await this.props.fetchContractorTags(tags, page + 1);
    const confirmContractorsByTags = this.props.confirmContractorsByTags.map(c => ({
      ...c,
      ignore: !ignoredAssigneeGroups.includes(c.id)
    }));
    form.change('confirmContractorsByTags', confirmContractorsByTags);
  };

  handleChangeIgnoredAssigneeGroups = (form: FormApi<IAddTaskGroupForm>, contractorId: string) => (
    _event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    const { ignoredAssigneeGroups: previousPagesSelected } = form.getState().values;

    if (!checked && previousPagesSelected && !previousPagesSelected.includes(contractorId)) {
      form.change('ignoredAssigneeGroups', [...previousPagesSelected, contractorId]);
    } else {
      form.change('ignoredAssigneeGroups', [...previousPagesSelected.filter(id => id !== contractorId)]);
    }
  };

  handleAddAttachments = async (
    form: FormApi<IAddTaskGroupForm>,
    acceptedFiles: FileWithPath[],
    rejectedFiles: InvalidFileUpload[]
  ) => {
    const { attachments } = form.getState().values;

    const attachmentIds = await this.props.addAttachments(acceptedFiles, rejectedFiles);

    form.change('attachments', [...attachments, ...attachmentIds]);
  };

  handleDeleteAttachment = async (form: FormApi<IAddTaskGroupForm>, id: string) => {
    const { attachments } = form.getState().values;

    await this.props.deleteAttachment(id);

    form.change(
      'attachments',
      attachments.filter(attachment => attachment.id !== id)
    );
  };

  render() {
    const {
      match: {
        params: { organizationId }
      },
      location: { state },
      isFetching,
      currentPage,
      total,
      pendingAttachments
    } = this.props;

    return (
      <AddTaskGroupWizard
        addAttachments={this.handleAddAttachments}
        deleteAttachment={this.handleDeleteAttachment}
        organizationId={organizationId}
        state={state}
        isLoading={isFetching}
        page={currentPage - 1} // MUI is zero-indexed; API is one-indexed
        totalCount={total}
        onSubmit={this.onSubmit}
        handleChangePage={this.handleChangePage}
        uploadedAttachments={pendingAttachments}
      />
    );
  }
}

export const AddTaskGroupContainer = connect(mapStateToProps, mapDispatchToProps)(AddTaskGroup);
