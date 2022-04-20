import * as React from 'react';
import { connect } from 'react-redux';
import { fetchSiteIfNeeded } from 'actions/fetchSite';
import { Footer } from '@pec/aion-ui-components/containers/Footer';
import { NavContainer as CommonNavContainer } from '@pec/aion-ui-components/containers/Nav';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { SideNav } from 'components/SideNav';
import { SiteHeadingComponent } from 'components/SiteHeading';
import { ThunkDispatch } from 'redux-thunk';

type OwnProps = {
  title?: string;
};

type RouteParams = {
  organizationId?: string;
  siteId?: string;
};

const mapStateToProps = (state: RootState) => state.site;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId, siteId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchSiteIfNeeded: () => {
    if (organizationId && siteId) {
      dispatch(fetchSiteIfNeeded(organizationId, siteId));
    }
  }
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  OwnProps;

class Nav extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.props.fetchSiteIfNeeded();
  }

  render() {
    const {
      title,
      site,
      children,
      match: {
        params: { organizationId }
      },
      location
    } = this.props;

    return (
      <CommonNavContainer
        title={title}
        sideNav={organizationId ? <SideNav organizationId={organizationId} site={site} /> : undefined}
        organizationId={organizationId}
        location={location}
      >
        <SiteHeadingComponent site={site} />
        {children}
        <Footer />
      </CommonNavContainer>
    );
  }
}

export const NavContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(Nav));
