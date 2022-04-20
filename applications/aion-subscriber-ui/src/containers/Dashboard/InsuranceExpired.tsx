import * as React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { fetchInsurancesIfNeeded } from 'actions/insurances';
import { InsuranceExpiredComponent } from 'components/Dashboard/InsuranceExpired';
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
    expiredInsurances:
      insurances &&
      insurances.filter(({ earliestPolicyExpirationDate }) => moment(earliestPolicyExpirationDate).isBefore())
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

class InsuranceExpired extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchInsurancesIfNeeded();
  }

  render() {
    const { expiredInsurances } = this.props;

    return expiredInsurances ? <InsuranceExpiredComponent expiredInsurances={expiredInsurances} /> : null;
  }
}

export const InsuranceExpiredContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(InsuranceExpired));
