import * as React from 'react';
import { connect } from 'react-redux';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchOrganizationFeaturesIfNeeded } from 'actions/organizationFeatures';
import { IOrganizationFeatureForm } from 'interfaces/organizationFeatureForm';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { ManageGlobalOrganizationFeaturesComponent } from 'components/ManageGlobalOrganizationFeatures';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { ThunkDispatch } from 'redux-thunk';
import { addGlobalOrganizationFeature } from 'actions/addGlobalOrganizationFeature';
import { deleteGlobalOrganizationFeature } from 'actions/deleteGlobalOrganizationFeature';

const mapStateToProps = (state: RootState) => state.organizationFeatures;

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, RootActions>) => ({
  fetchOrganizationFeaturesIfNeeded: () => dispatch(fetchOrganizationFeaturesIfNeeded()),
  addGlobalOrganizationFeature: (orgFeature: IOrganizationFeatureForm) =>
    dispatch(addGlobalOrganizationFeature(orgFeature)),
  deleteGlobalOrganizationFeature: (orgFeature: IOrganizationFeatureForm) =>
    dispatch(deleteGlobalOrganizationFeature(orgFeature))
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class GlobalOrganizationFeaturesContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.props.fetchOrganizationFeaturesIfNeeded();
  }

  onAddFeature = (orgFeature: IOrganizationFeatureForm) => this.props.addGlobalOrganizationFeature(orgFeature);

  onDeleteFeature = (orgFeature: IOrganizationFeatureForm) => this.props.deleteGlobalOrganizationFeature(orgFeature);

  render() {
    const { organizationFeatures, isFetching, error } = this.props;

    return !isFetching && organizationFeatures?.length ? (
      <ManageGlobalOrganizationFeaturesComponent
        organizationFeatures={organizationFeatures}
        addGlobalOrganizationFeature={this.onAddFeature}
        deleteGlobalOrganizationFeature={this.onDeleteFeature}
      />
    ) : error ? (
      <Error />
    ) : (
      <Loading />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GlobalOrganizationFeaturesContainer);
