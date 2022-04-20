import * as React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { fetchInsurancesIfNeeded } from 'actions/insurances';
import { InsuranceExpiringComponent } from 'components/Dashboard/InsuranceExpiring';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
};

const mapStateToProps = (state: RootState) => {
  const { insurances } = state.insurances;

  return {
    expiringInsurances:
      insurances &&
      insurances.filter(({ earliestPolicyExpirationDate }) =>
        moment(earliestPolicyExpirationDate).isBetween(moment(), moment().add(30, 'days'))
      )
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchInsurancesIfNeeded: () => dispatch(fetchInsurancesIfNeeded(organizationId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class InsuranceExpiring extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchInsurancesIfNeeded();
  }

  render() {
    const { expiringInsurances } = this.props;

    return expiringInsurances ? <InsuranceExpiringComponent expiringInsurances={expiringInsurances} /> : null;
  }
}

export const InsuranceExpiringContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(InsuranceExpiring));
