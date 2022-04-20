import * as React from 'react';
import { ClientCategoriesContainer } from '../../clientCategories/containers/ClientCategories';
import { ClientCategoryForm } from './ClientCategoryForm';
import { connect } from 'react-redux';
import { fetchClientIncidentCategoryIfNeeded } from '../actions/fetchClientIncidentCategory';
import { IIncidentCategory } from 'interfaces/incidentCategory';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router';
import { ThunkDispatch } from 'redux-thunk';
import { updateClientIncidentCategory } from '../actions/updateClientIncidentCategory';

type RouteParams = {
  organizationId: string;
  incidentCategoryId: string;
};

const mapStateToProps = (state: RootState) => ({ ...state.clientIncidentCategory, ...state.options });

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId, incidentCategoryId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchClientIncidentCategoryIfNeeded: () => dispatch(fetchClientIncidentCategoryIfNeeded(incidentCategoryId)),
  updateClientIncidentCategory: (form: IIncidentCategory, showInactiveCategories: boolean) =>
    dispatch(updateClientIncidentCategory(form, organizationId, showInactiveCategories))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class EditClientCategory extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchClientIncidentCategoryIfNeeded();
  }

  componentDidUpdate({
    match: {
      params: { incidentCategoryId: prevIncidentCategoryId }
    }
  }: Props) {
    const {
      match: {
        params: { incidentCategoryId }
      }
    } = this.props;

    if (incidentCategoryId && prevIncidentCategoryId !== incidentCategoryId) {
      this.props.fetchClientIncidentCategoryIfNeeded();
    }
  }

  onSubmit = (form: IIncidentCategory) =>
    this.props.updateClientIncidentCategory(form, this.props.showInactiveCategories);

  render() {
    const {
      history,
      incidentCategory,
      isFetching,
      error,
      match: {
        params: { organizationId, incidentCategoryId }
      }
    } = this.props;

    return (
      <ClientCategoriesContainer
        history={history}
        organizationId={organizationId}
        incidentCategoryId={incidentCategoryId}
      >
        {incidentCategory && (
          <ClientCategoryForm
            isFetching={isFetching}
            errorResponse={error}
            onSubmit={this.onSubmit}
            initialValues={incidentCategory}
          />
        )}
      </ClientCategoriesContainer>
    );
  }
}

export const EditClientCategoryContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditClientCategory);
