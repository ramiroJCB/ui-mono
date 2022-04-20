import * as React from 'react';
import { ClientCategoriesComponent } from '../components/ClientCategories';
import { connect } from 'react-redux';
import { ConnectChildren } from '@pec/aion-ui-core/types/connectChildren';
import { destroy } from 'redux-form';
import {
  fetchClientIncidentCategories,
  fetchClientIncidentCategoriesIfNeeded
} from '../actions/fetchClientIncidentCategories';
import { getOptionsAsync, setOption } from '@pec/aion-ui-core/actions/options';
import { History } from 'history';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { ThunkDispatch } from 'redux-thunk';

type OwnProps = {
  history: History;
  organizationId: string;
  incidentCategoryId?: string;
};

const mapStateToProps = (state: RootState) => ({ ...state.clientIncidentCategories, ...state.options });

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, RootActions>, { organizationId }: OwnProps) => ({
  getOptionsAsync: () => dispatch(getOptionsAsync()),
  fetchClientIncidentCategoriesIfNeeded: () => dispatch(fetchClientIncidentCategoriesIfNeeded(organizationId)),
  fetchClientIncidentCategories: (showInactive: boolean) =>
    dispatch(fetchClientIncidentCategories(organizationId, showInactive)),
  handleShowInactiveChange: (showInactive: boolean) => dispatch(setOption('showInactiveCategories', showInactive)),
  destroy: () => dispatch(destroy('clientCategoryForm'))
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & OwnProps & ConnectChildren;

class ClientCategories extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.fetchClientIncidentCategories();
  }

  async fetchClientIncidentCategories() {
    await this.props.getOptionsAsync();
    this.props.fetchClientIncidentCategoriesIfNeeded();
  }

  componentDidUpdate({ showInactiveCategories: prevShowInactiveCategories }: Props) {
    const { showInactiveCategories } = this.props;

    if (prevShowInactiveCategories !== showInactiveCategories) {
      this.props.fetchClientIncidentCategories(showInactiveCategories);
    }
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    this.props.handleShowInactiveChange(event.target.checked);

  handleAddClick = () => {
    const { history, organizationId } = this.props;

    history.push(`/${organizationId}/reporting/incidents/categories`);
    this.props.destroy();
  };

  render() {
    const {
      incidentCategories,
      isFetching,
      error,
      organizationId,
      incidentCategoryId,
      showInactiveCategories,
      children
    } = this.props;

    return (
      <ClientCategoriesComponent
        isFetching={isFetching}
        error={error}
        showInactive={showInactiveCategories}
        clientId={organizationId}
        incidentCategoryId={incidentCategoryId}
        incidentCategories={incidentCategories}
        handleChange={this.handleChange}
        handleAddClick={this.handleAddClick}
      >
        {children}
      </ClientCategoriesComponent>
    );
  }
}

export const ClientCategoriesContainer = connect(mapStateToProps, mapDispatchToProps)(ClientCategories);
