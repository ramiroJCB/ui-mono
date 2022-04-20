import * as React from 'react';
import { addLogo } from '../actions/addLogo';
import { connect } from 'react-redux';
import { LogoComponent } from '../components/Logo';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
};

const mapStateToProps = (state: RootState) => {
  const { isFetching, logo, metaData, error } = state.logo;
  const { viewAsClient } = state.profile;

  return {
    isFetching,
    logo,
    metaData,
    error,
    viewAsClient
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  addLogo: (logo: Blob, name: string) => dispatch(addLogo(organizationId, logo, name))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class Logo extends React.Component<Props> {
  render() {
    const { addLogo, logo, metaData, error, isFetching, viewAsClient } = this.props;
    return (
      <LogoComponent
        addLogo={addLogo}
        logo={logo}
        metaData={metaData}
        viewAsClient={viewAsClient}
        error={error}
        isFetching={isFetching}
      />
    );
  }
}

export const LogoContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(Logo));
