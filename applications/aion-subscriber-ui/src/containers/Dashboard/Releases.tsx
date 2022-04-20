import * as React from 'react';
import { connect } from 'react-redux';
import { fetchReleasesIfNeeded } from 'actions/releases';
import { ReleasesComponent } from 'components/Dashboard/Releases';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
};

const mapStateToProps = (state: RootState) => {
  const { releases, error } = state.releases;

  return {
    hasPendingReleases: releases && releases.some(r => r.status === 'Pending'),
    error
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
  fetchReleasesIfNeeded: () => dispatch(fetchReleasesIfNeeded(organizationId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class Releases extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchReleasesIfNeeded();
  }

  render() {
    const { hasPendingReleases } = this.props;

    return <ReleasesComponent hasPendingReleases={hasPendingReleases} />;
  }
}

export const ReleasesContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(Releases));
