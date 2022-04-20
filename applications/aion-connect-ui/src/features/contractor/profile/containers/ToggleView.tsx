import * as React from 'react';
import { connect } from 'react-redux';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { ThunkDispatch } from 'redux-thunk';
import { toggleViewAsClient } from '../actions';
import { ToggleViewComponent } from '../components/ToggleView';

const mapStateToProps = (state: RootState) => state.profile;

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, RootActions>) => ({
  toggleView: () => dispatch(toggleViewAsClient())
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class ToggleView extends React.Component<Props> {
  handleToggle = () => this.props.toggleView();

  render() {
    const { viewAsClient } = this.props;
    return <ToggleViewComponent viewAsClient={viewAsClient} toggleViewAsClient={this.handleToggle} />;
  }
}

export const ToggleViewContainer = connect(mapStateToProps, mapDispatchToProps)(ToggleView);
