import * as React from 'react';
import { connect } from 'react-redux';
import { deleteSafetyProgram } from '../actions/deleteSafetyProgram';
import { DropResult } from 'react-beautiful-dnd';
import { EditSafetyProgramComponent } from '../components/EditSafetyProgram';
import { fetchSafetyProgramIfNeeded } from '../actions/fetchSafetyProgram';
import { IEditSafetyProgram } from 'interfaces/safetyProgram';
import { resolveSortOrder } from 'helpers/questionOrder';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { updateQuestionSortOrder, updateSafetyProgram } from '../actions/updateSafetyProgram';

type RouteParams = {
  safetyProgramId: string;
};

const mapStateToProps = (state: RootState) => state.safetyProgram;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { safetyProgramId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  deleteSafetyProgram: () => dispatch(deleteSafetyProgram(safetyProgramId)),
  fetchSafetyProgramIfNeeded: () => dispatch(fetchSafetyProgramIfNeeded(safetyProgramId)),
  updateSafetyProgram: (values: IEditSafetyProgram) => dispatch(updateSafetyProgram(values)),
  updateQuestionSortOrder: (questionId: string, sortOrder: number, sourceIndex: number, destinationIndex: number) =>
    dispatch(updateQuestionSortOrder(safetyProgramId, questionId, sortOrder, sourceIndex, destinationIndex))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class Component extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchSafetyProgramIfNeeded();
  }

  onConfirmDelete = async () => {
    const { deleteSafetyProgram, history } = this.props;

    await deleteSafetyProgram();
    history.push('/safety-programs');
  };

  onSubmit = async (values: IEditSafetyProgram) => {
    const {
      history,
      updateSafetyProgram,
      match: {
        params: { safetyProgramId }
      }
    } = this.props;

    await updateSafetyProgram(values);
    history.push(`/safety-programs/${safetyProgramId}`);
  };

  onDragEnd = async ({ draggableId, source, destination }: DropResult) => {
    const { safetyProgram, updateQuestionSortOrder } = this.props;

    if (safetyProgram?.questions && destination && destination.index !== source.index) {
      const sortOrder = resolveSortOrder(safetyProgram.questions, source.index, destination.index);

      await updateQuestionSortOrder(draggableId, sortOrder, source.index, destination.index);
    }
  };

  render() {
    const {
      safetyProgram,
      isFetching,
      error,
      match: {
        params: { safetyProgramId }
      }
    } = this.props;

    return (
      <EditSafetyProgramComponent
        safetyProgramId={safetyProgramId}
        safetyProgram={safetyProgram}
        isFetching={isFetching}
        error={error}
        onConfirmDelete={this.onConfirmDelete}
        onSubmit={this.onSubmit}
        onDragEnd={this.onDragEnd}
      />
    );
  }
}

export const EditSafetyProgramContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(Component));
