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
};

const mapStateToProps = (state: RootState) => state.contractor;

type Props = ReturnType<typeof mapStateToProps> & RouteComponentProps<RouteParams> & I18nextProps;

class ContractorHeader extends React.Component<Props> {
  render() {
    const {
      isFetching,
      contractor,
      match: {
        params: { organizationId, contractorId }
      },
      t
    } = this.props;

    return (
      <Header
        item={contractor}
        isFetching={isFetching}
        toolbarLinks={[
          {
            label: t('trainingCompliance.common.assignedEmployees', 'Assigned Employees'),
            to: `/${organizationId}/training-compliance/contractors/${contractorId}`
          },
          {
            label: t('trainingCompliance.common.generalInfo', 'General Info'),
            to: `/${organizationId}/training-compliance/contractors/${contractorId}/general-info`
          }
        ]}
      >
        {({ name }) => name}
      </Header>
    );
  }
}

export const ContractorHeaderContainer = withRouter(connect(mapStateToProps)(withTranslation()(ContractorHeader)));
