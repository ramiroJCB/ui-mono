import * as React from 'react';
import { addQuestion } from '../actions/addQuestion';
import { AddQuestionComponent } from '../components/AddQuestion';
import { connect } from 'react-redux';
import { fetchSafetyProgram } from 'features/safetyProgram/actions/fetchSafetyProgram';
import { gracePeriodExpired } from 'helpers/gracePeriodExpired';
import { IAddQuestion } from 'interfaces/question';
import { ISafetyProgram } from 'interfaces/safetyProgram';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { resolveNextQuestionNumber } from 'helpers/questionNumber';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { updateSafetyProgram } from 'features/safetyProgram/actions/updateSafetyProgram';
import { updateGracePeriodPrompted } from 'features/safetyProgram/actions/updateGracePeriodPrompted';

type RouteParams = {
  safetyProgramId: string;
};

const mapStateToProps = (
  { safetyProgram: { safetyProgram, isFetching, error, gracePeriodPrompted } }: RootState,
  { location: { search } }: RouteComponentProps<RouteParams>
) => {
  const parentQuestionId = parse(search).parentQuestionId?.toString() || null;
  return {
    safetyProgram,
    isFetching,
    error,
    gracePeriodPrompted,
    parentQuestionId,
    questionNumber: safetyProgram && resolveNextQuestionNumber(safetyProgram.questions, parentQuestionId)
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { safetyProgramId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  addQuestion: (values: IAddQuestion) => dispatch(addQuestion(values)),
  updateGracePeriodPrompted: (value: boolean) => dispatch(updateGracePeriodPrompted(value)),
  updateSafetyProgram: (safetyProgram: ISafetyProgram | null) =>
    safetyProgram && dispatch(updateSafetyProgram(safetyProgram)),
  fetchSafetyProgram: () => dispatch(fetchSafetyProgram(safetyProgramId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class Component extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchSafetyProgram();
  }

  onSubmit = async (values: IAddQuestion) => {
    const {
      addQuestion,
      history,
      match: {
        params: { safetyProgramId }
      },
      safetyProgram,
      updateGracePeriodPrompted,
      updateSafetyProgram
    } = this.props;

    const { id } = await addQuestion(values);
    updateGracePeriodPrompted(true);
    const { gracePeriodExpirationDateUtc } = values;

    if (safetyProgram) {
      const { gracePeriodExpirationDateUtc: programGraceExpiration } = safetyProgram;

      const shouldUpdateGracePeriod =
        (programGraceExpiration === null || gracePeriodExpired(programGraceExpiration)) && gracePeriodExpirationDateUtc;

      shouldUpdateGracePeriod && (await updateSafetyProgram({ ...safetyProgram, gracePeriodExpirationDateUtc }));
    }

    history.push(`/safety-programs/${safetyProgramId}/questions/${id}`);
  };

  render() {
    const {
      safetyProgram,
      gracePeriodPrompted,
      isFetching,
      error,
      match: {
        params: { safetyProgramId }
      },
      parentQuestionId,
      questionNumber
    } = this.props;

    return (
      <AddQuestionComponent
        safetyProgramId={safetyProgramId}
        onSubmit={this.onSubmit}
        initialValues={{ safetyProgramId, parentQuestionId }}
        safetyProgram={safetyProgram}
        gracePeriodPrompted={gracePeriodPrompted}
        questionNumber={questionNumber}
        isFetching={isFetching}
        error={error}
      />
    );
  }
}

export const AddQuestionContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(Component));
