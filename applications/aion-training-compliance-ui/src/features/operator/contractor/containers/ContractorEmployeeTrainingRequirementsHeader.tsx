import * as React from 'react';
import { connect } from 'react-redux';
import { Header } from 'components/Header';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';

type RouteParams = {
  organizationId: string;
  contractorId: string;
  employeeId: string;
};

const mapStateToProps = (state: RootState) => state.employee;

type Props = ReturnType<typeof mapStateToProps> & RouteComponentProps<RouteParams> & I18nextProps;

class ContractorEmployeeTrainingRequirementsHeader extends React.Component<Props> {
  render() {
    const {
      isFetching,
      employee,
      match: {
        params: { organizationId, contractorId, employeeId }
      },
      t
    } = this.props;

    return (
      <Header
        item={employee}
        isFetching={isFetching}
        toolbarLinks={[
          {
            label: t('trainingCompliance.operator.contractor.allTrainings', 'All trainings'),
            to: `/${organizationId}/training-compliance/contractors/${contractorId}/assigned-employees/${employeeId}`
          }
        ]}
      >
        {({ name }) => name}
      </Header>
    );
  }
}

export const ContractorEmployeeTrainingRequirementsHeaderContainer = withRouter(
  connect(mapStateToProps)(withTranslation()(ContractorEmployeeTrainingRequirementsHeader))
);
