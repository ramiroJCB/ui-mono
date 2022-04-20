import * as React from 'react';
import { connect } from 'react-redux';
import { RootActions } from '../combineActions';
import { RootState } from '../combineReducers';
import { ThunkDispatch } from 'redux-thunk';
import { cancelEmployeesLinking } from 'actions/linkEmployees/cancelLinking';
import { LinkingDialogComponent } from 'components/linkingDialog';
import { linkEmployeesIfNeeded } from 'actions/linkEmployees/requestEmployeeLinking';
import { ParsedUrlQuery } from 'querystring';
import { fetchTableDataIfNeeded } from 'actions/employees/fetchEmployees';
import { fetchTableDataIfNeeded as fetchVerisourceTableDataIfNeedeed } from 'actions/employees/fetchVerisourceEmployees';
import { parse } from '@pec/aion-ui-core/helpers/querystring';

const mapStateToProps = ({
  PECEmployees: { employees },
  employeeLinking: { PECId, verisourceEmployee, isFetching }
}: RootState) => ({
  PECEmployee: employees.find(({ id }) => id === PECId),
  verisourceEmployee,
  isFetching,
  PECId
});

type OwnProps = {
  organizationId: string;
  URLSearch: string;
  isModalOpen: boolean;
  setModal: (state: boolean) => void;
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  { organizationId, setModal }: OwnProps
) => ({
  cancelLinking: () => {
    dispatch(cancelEmployeesLinking());
    setModal(false);
  },
  requestLinking: (PECEmployeeId: string, verisourceId: number) =>
    dispatch(linkEmployeesIfNeeded(PECEmployeeId, verisourceId)),
  fetchPECData: (params: ParsedUrlQuery) => dispatch(fetchTableDataIfNeeded(params, organizationId)),
  fetchVerisourceData: (params: ParsedUrlQuery) => dispatch(fetchVerisourceTableDataIfNeedeed(params))
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & OwnProps;

export class Linking extends React.Component<Props> {
  handleLink = () => {
    const {
      verisourceEmployee,
      requestLinking,
      fetchPECData,
      fetchVerisourceData,
      URLSearch,
      PECId,
      setModal
    } = this.props;
    const params = parse(URLSearch);
    return async () => {
      if (!!PECId && !!verisourceEmployee) {
        try {
          await requestLinking(PECId, verisourceEmployee.employeeId);
          fetchPECData(params);
          fetchVerisourceData(params);
        } finally {
          setModal(false);
        }
      }
    };
  };

  render() {
    const { isModalOpen, PECEmployee, verisourceEmployee, cancelLinking, isFetching } = this.props;
    return (
      <React.Fragment>
        {PECEmployee && verisourceEmployee && isModalOpen && (
          <LinkingDialogComponent
            isModalOpen={isModalOpen}
            PECEmployee={PECEmployee}
            verisourceEmployee={verisourceEmployee}
            cancelLinking={cancelLinking}
            requestLinking={this.handleLink()}
            isFetching={isFetching}
          />
        )}
      </React.Fragment>
    );
  }
}

export const LinkingContainer = connect(mapStateToProps, mapDispatchToProps)(Linking);
