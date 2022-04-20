import * as React from 'react';
import { connect } from 'react-redux';
import { fetchWorkGroupIfNeeded } from 'features/operator/workGroup/actions/fetchWorkGroup';
import { Header } from 'components/Header';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';

type RouteParams = {
  organizationId: string;
  workGroupId: string;
};

const mapStateToProps = (state: RootState) => state.workGroup;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { workGroupId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchWorkGroupIfNeeded: () => dispatch(fetchWorkGroupIfNeeded(workGroupId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  I18nextProps;

class OperatorWorkGroupHeader extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchWorkGroupIfNeeded();
  }

  render() {
    const {
      isFetching,
      workGroup,
      match: {
        params: { organizationId, workGroupId }
      },
      t
    } = this.props;

    return (
      <Header
        item={workGroup}
        isFetching={isFetching}
        toolbarLinks={[
          {
            label: t('trainingCompliance.common.jobTypes', 'Job Types'),
            to: `/${organizationId}/training-compliance/work-groups/${workGroupId}`
          },
          {
            label: t('trainingCompliance.common.generalInfoAndEdit', 'General Info & Edit'),
            to: `/${organizationId}/training-compliance/work-groups/${workGroupId}/general-info`
          }
        ]}
      >
        {({ name }) => name}
      </Header>
    );
  }
}

export const OperatorWorkGroupHeaderContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withTranslation()(OperatorWorkGroupHeader))
);
