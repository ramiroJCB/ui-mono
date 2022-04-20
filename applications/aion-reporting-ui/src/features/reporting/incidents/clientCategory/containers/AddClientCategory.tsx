import * as React from 'react';
import { addClientIncidentCategory } from '../actions/addClientIncidentCategory';
import { ClientCategoriesContainer } from '../../clientCategories/containers/ClientCategories';
import { ClientCategoryForm } from './ClientCategoryForm';
import { connect } from 'react-redux';
import { IIncidentCategory } from 'interfaces/incidentCategory';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
};

const mapStateToProps = (state: RootState) => state.options;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  addClientIncidentCategory: (form: IIncidentCategory, showInactiveCategories: boolean) =>
    dispatch(addClientIncidentCategory(form, organizationId, showInactiveCategories))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class AddClientCategory extends React.Component<Props> {
  onSubmit = (form: IIncidentCategory) => this.props.addClientIncidentCategory(form, this.props.showInactiveCategories);

  render() {
    const {
      history,
      match: {
        params: { organizationId }
      }
    } = this.props;

    return (
      <ClientCategoriesContainer history={history} organizationId={organizationId}>
        <ClientCategoryForm onSubmit={this.onSubmit} />
      </ClientCategoriesContainer>
    );
  }
}

export const AddClientCategoryContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddClientCategory);
