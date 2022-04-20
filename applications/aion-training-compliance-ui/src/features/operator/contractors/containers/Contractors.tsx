import * as React from 'react';
import { connect } from 'react-redux';
import { ContractorsComponent } from '../components/Contractors';
import { fetchContractors } from '../actions';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { withEnhancedRouter, WithEnhancedRouterProps } from '@pec/aion-ui-core/hocs/withEnhancedRouter';

type RouteParams = {
  organizationId: string;
};

const mapStateToProps = (state: RootState) => state.contractors;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId }
    },
    location: { search }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchContractors: (top: number = 0, skip: number = 0) =>
    dispatch(fetchContractors(organizationId, top, skip, parse(search).name))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  WithEnhancedRouterProps;

class Contractors extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchContractors();
  }

  componentDidUpdate({ location: { search: prevSearch } }: Props) {
    const {
      fetchContractors,
      location: { search }
    } = this.props;

    if (prevSearch !== search) {
      fetchContractors();
    }
  }

  handleSearch = (searchText: string) => this.props.handleQueryParamChange('name', searchText);

  render() {
    const {
      contractors,
      error,
      totalCount,
      fetchContractors,
      isFetchingInitial,
      location: { search }
    } = this.props;

    return (
      <ContractorsComponent
        isFetchingInitial={isFetchingInitial}
        error={error}
        contractors={contractors}
        totalCount={totalCount}
        searchValue={parse(search).name || ''}
        handleSearch={this.handleSearch}
        fetchContractors={fetchContractors}
      />
    );
  }
}

export const ContractorsContainer = withEnhancedRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Contractors)
);
