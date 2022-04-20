import * as React from 'react';
import { connect } from 'react-redux';
import { fetchJobTypeIfNeeded } from '../actions/fetchJobType';
import { Header } from 'components/Header';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';

type RouteParams = {
  organizationId: string;
  jobTypeId: string;
};

const mapStateToProps = (state: RootState) => state.jobType;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { jobTypeId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchJobTypeIfNeeded: () => dispatch(fetchJobTypeIfNeeded(jobTypeId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  I18nextProps;

class OperatorJobTypeHeader extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchJobTypeIfNeeded();
  }

  render() {
    const {
      isFetching,
      jobType,
      match: {
        params: { organizationId, jobTypeId }
      },
      t
    } = this.props;

    return (
      <Header
        item={jobType}
        isFetching={isFetching}
        toolbarLinks={[
          {
            label: t('trainingCompliance.common.workGroups', 'Work Groups'),
            to: `/${organizationId}/training-compliance/job-types/${jobTypeId}`
          },
          {
            label: t('trainingCompliance.common.requiredTraining', 'Required Training'),
            to: `/${organizationId}/training-compliance/job-types/${jobTypeId}/training`
          },
          {
            label: t('trainingCompliance.common.generalInfoAndEdit', 'General Info & Edit'),
            to: `/${organizationId}/training-compliance/job-types/${jobTypeId}/general-info`
          }
        ]}
      >
        {({ name }) => name}
      </Header>
    );
  }
}

export const OperatorJobTypeHeaderContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withTranslation()(OperatorJobTypeHeader))
);
