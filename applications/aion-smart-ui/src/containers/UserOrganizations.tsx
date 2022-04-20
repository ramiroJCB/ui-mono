import * as React from 'react';
import { connect } from 'react-redux';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchUserOrganizationsIfNeeded } from '@pec/aion-ui-core/actions/userOrganizations';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { NavContainer } from './Nav';
import { OrganizationFeature } from '@pec/aion-ui-core/interfaces/organization';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { UserOrganizationsComponent } from 'components/UserOrganizations';
import { withTranslation } from 'react-i18next';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';

const mapStateToProps = (state: RootState) => state.userOrganizations;

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, RootActions>) => ({
  fetchUserOrganizationsIfNeeded: () =>
    dispatch(fetchUserOrganizationsIfNeeded(organization => organization.features.includes(OrganizationFeature.Smart)))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps &
  I18nextProps;

class UserOrganizations extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.props.fetchUserOrganizationsIfNeeded();
  }

  componentDidUpdate() {
    const { userOrganizations, history } = this.props;
    if (userOrganizations && userOrganizations.length === 1) {
      history.replace(`/${userOrganizations[0].id}/sites`);
    }
  }

  render() {
    const { userOrganizations, history, isFetching, error, t } = this.props;
    return (
      <NavContainer title={t('smart.titles.myOrganizations', 'My Organizations')}>
        {userOrganizations && !isFetching ? (
          <UserOrganizationsComponent userOrganizations={userOrganizations} history={history} />
        ) : error ? (
          <Error />
        ) : (
          <Loading />
        )}
      </NavContainer>
    );
  }
}

export const UserOrganizationsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(UserOrganizations));
