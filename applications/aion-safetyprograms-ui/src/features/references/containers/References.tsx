import * as React from 'react';
import { connect } from 'react-redux';
import { fetchReferences } from '../actions/fetchReferences';
import { ReferencesComponent } from '../components/References';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
  safetyProgramRequirementId: string;
};

type OwnProps = {
  questionAnswerId: string;
  isReadOnly: boolean;
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  OwnProps;

const mapStateToProps = ({
  references: { references, questionAnswerId: storedQuestionAnswerId, error, isFetching }
}: RootState) => ({
  references,
  storedQuestionAnswerId,
  error,
  isFetching
});

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, RootActions>, { questionAnswerId }: OwnProps) => ({
  fetchReferences: () => {
    dispatch(fetchReferences(questionAnswerId));
  }
});

class Component extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchReferences();
  }

  componentDidUpdate() {
    const { isFetching, error, questionAnswerId, storedQuestionAnswerId, fetchReferences } = this.props;

    if (!isFetching && !error && questionAnswerId !== storedQuestionAnswerId) {
      fetchReferences();
    }
  }

  render() {
    const {
      references,
      isFetching,
      error,
      questionAnswerId,
      isReadOnly,
      match: {
        params: { organizationId, safetyProgramRequirementId }
      }
    } = this.props;

    return (
      <ReferencesComponent
        references={references}
        isFetching={isFetching}
        error={error}
        organizationId={organizationId}
        safetyProgramRequirementId={safetyProgramRequirementId}
        questionAnswerId={questionAnswerId}
        isReadOnly={isReadOnly}
      />
    );
  }
}

export const ReferencesContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(Component));
