import * as React from 'react';
import { ClientCommentsComponent } from '../components/ClientComments';
import { connect } from 'react-redux';
import { fetchComments } from '../actions/fetchComments';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { ThunkDispatch } from 'redux-thunk';

type OwnProps = {
  questionAnswerId: string;
};

const mapStateToProps = ({
  comments: { comments, isFetching, error, questionAnswerId: storedQuestionAnswerId }
}: RootState) => ({
  comments,
  isFetching,
  error,
  storedQuestionAnswerId
});

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, RootActions>, { questionAnswerId }: OwnProps) => ({
  fetchComments: () => dispatch(fetchComments(questionAnswerId))
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & OwnProps;

class Component extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchComments();
  }

  componentDidUpdate() {
    const { isFetching, error, questionAnswerId, storedQuestionAnswerId, fetchComments } = this.props;

    if (!isFetching && !error && questionAnswerId !== storedQuestionAnswerId) {
      fetchComments();
    }
  }

  render() {
    const { comments, isFetching, error } = this.props;

    return <ClientCommentsComponent comments={comments} isFetching={isFetching} error={error} />;
  }
}

export const ClientCommentsContainer = connect(mapStateToProps, mapDispatchToProps)(Component);
