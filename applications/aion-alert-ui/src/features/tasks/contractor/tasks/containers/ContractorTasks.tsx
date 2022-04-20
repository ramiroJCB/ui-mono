import * as React from 'react';
import { connect } from 'react-redux';
import { ContractorTasksComponent } from '../components/ContractorTasks';
import { fetchContractorTasks } from '../actions';
import { IContractorTaskTableOption } from 'interfaces/contractorTaskTableOption';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
};

const mapStateToProps = (state: RootState) => state.contractorTasks;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    location: { search },
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchContractorTasks: () => dispatch(fetchContractorTasks(organizationId, parse(search)))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class ContractorTasks extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchContractorTasks();
  }

  componentDidUpdate({ location: { search: prevSearch } }: Props) {
    const {
      location: { search }
    } = this.props;

    if (prevSearch !== search) {
      this.props.fetchContractorTasks();
    }
  }

  handleRowSelect = ({ id: taskId }: IContractorTaskTableOption) => {
    const {
      history,
      match: {
        params: { organizationId }
      }
    } = this.props;
    history.push(`/${organizationId}/alerts/tasks/${taskId}`);
  };

  render() {
    const { contractorTasks, isFetching, totalContractorTasksCount } = this.props;

    return (
      <ContractorTasksComponent
        contractorTasks={contractorTasks}
        handleRowSelect={this.handleRowSelect}
        isFetchingData={isFetching}
        totalOptionsCount={totalContractorTasksCount}
      />
    );
  }
}

export const ContractorTasksContainer = connect(mapStateToProps, mapDispatchToProps)(ContractorTasks);
