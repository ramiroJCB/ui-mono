import * as React from 'react';
import { connect } from 'react-redux';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchUserOrganizationsIfNeeded } from '@pec/aion-ui-core/actions/userOrganizations';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { Redirect } from 'react-router';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { ThunkDispatch } from 'redux-thunk';
import { UserOrganizationsComponent } from 'components/UserOrganizations';
import { withTranslation } from 'react-i18next';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';

const mapStateToProps = (state: RootState) => state.userOrganizations;

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, RootActions>) => ({
  fetchUserOrganizationsIfNeeded: () => dispatch(fetchUserOrganizationsIfNeeded())
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & I18nextProps;

class UserOrganizations extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchUserOrganizationsIfNeeded();
  }

  render() {
    const { userOrganizations, isFetching, error, t } = this.props;

    if (userOrganizations && !isFetching && !error) {
      switch (userOrganizations.length) {
        case 0:
          return (
            <Error
              message={t(
                'veriforceIntegration.userOrganizations.error',
                'This user doesn’t belong to any organizations'
              )}
            />
          );
        case 1:
          return <Redirect to={`/${userOrganizations[0].id}`} />;
        default:
          return <UserOrganizationsComponent userOrganizations={userOrganizations} />;
      }
    } else if (error) {
      return <Error />;
    } else {
      return <Loading />;
    }
  }
}

export const UserOrganizationsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(UserOrganizations));
