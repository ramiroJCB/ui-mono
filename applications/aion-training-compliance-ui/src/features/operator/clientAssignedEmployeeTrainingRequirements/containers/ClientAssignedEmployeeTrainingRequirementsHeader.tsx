import * as React from 'react';
import { connect } from 'react-redux';
import { fetchEmployee } from 'features/operator/employee/actions';
import { Header } from 'components/Header';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';

type RouteParams = {
  organizationId: string;
  employeeId: string;
};

const mapStateToProps = (state: RootState) => state.employee;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { employeeId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchEmployee: () => dispatch(fetchEmployee(employeeId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  I18nextProps;

class ClientAssignedEmployeeTrainingRequirementsHeader extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchEmployee();
  }

  render() {
    const {
      isFetching,
      employee,
      match: {
        params: { organizationId, employeeId }
      },
      t
    } = this.props;

    return (
      <Header
        item={employee}
        isFetching={isFetching}
        toolbarLinks={[
          {
            label: t('trainingCompliance.common.allTraining', 'All Training'),
            to: `/${organizationId}/training-compliance/assigned-employees/${employeeId}`
          }
        ]}
      >
        {({ name }) => name}
      </Header>
    );
  }
}

export const ClientAssignedEmployeeTrainingRequirementsHeaderContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ClientAssignedEmployeeTrainingRequirementsHeader))
);
