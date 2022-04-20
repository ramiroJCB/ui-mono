import * as React from 'react';
import { $top, fetchContractorRequirements } from '../actions/fetchRequirements';
import { connect } from 'react-redux';
import { ContractorRequirementsComponent } from '../components/ContractorRequirements';
import { merge, parse } from '@pec/aion-ui-core/helpers/querystring';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

const mapStateToProps = ({ requirements, userInfo: { userInfo } }: RootState) => ({ requirements, userInfo });

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    location: { search },
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchContractorRequirements: () => dispatch(fetchContractorRequirements(organizationId, search))
});

class Component extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.userInfo && props.fetchContractorRequirements();
  }

  componentDidUpdate({ location: { search: prevSearch }, userInfo: prevUserInfo }: Props) {
    const {
      fetchContractorRequirements,
      location: { search },
      userInfo
    } = this.props;

    if (search !== prevSearch || (prevUserInfo === null && userInfo !== null)) {
      fetchContractorRequirements();
    }
  }

  handlePageChange = (_event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => {
    const {
      history,
      location: { search }
    } = this.props;

    history.push({
      search: merge(search, {
        page: page.toString()
      })
    });
  };

  render() {
    const {
      match: {
        params: { organizationId }
      },
      location: { search }
    } = this.props;
    const { requirements, total, isFetching, error } = this.props.requirements;
    const { page = '0' } = parse(search);

    return (
      <ContractorRequirementsComponent
        requirements={requirements}
        total={total}
        isFetching={isFetching}
        error={error}
        organizationId={organizationId}
        page={parseInt(page.toString())}
        rowsPerPage={$top}
        onChangePage={this.handlePageChange}
      />
    );
  }
}

export const ContractorRequirementsContainer = connect(mapStateToProps, mapDispatchToProps)(Component);
