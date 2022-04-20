import * as React from 'react';
import VerifyTraineeInfo from '../components/VerifyTraineeInfo';
import { connect } from 'react-redux';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchTraineeIfNeeded } from '../actions/fetchTrainee';
import { ITrainee } from '../interfaces/trainee';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { Page } from '../components/Page';
import { RootActions } from '../combineActions';
import { RootState } from '../combineReducers';
import { ThunkDispatch } from 'redux-thunk';
import { updateTrainee } from '../actions/updateTrainee';
import { withTranslation } from 'react-i18next';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';

type OwnProps = {
  match: {
    params: {
      traineeId: string;
    };
  };
};

const mapStateToProps = (state: RootState) => state.trainee;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { traineeId }
    }
  }: OwnProps
) => ({
  fetchTraineeIfNeeded: () => dispatch(fetchTraineeIfNeeded(traineeId)),
  updateTrainee: (trainee: ITrainee) => dispatch(updateTrainee(trainee))
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & OwnProps & I18nextProps;

class VerifyTraineeInfoContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.props.fetchTraineeIfNeeded();
  }

  saveTrainee = (trainee: ITrainee) => async () => await this.props.updateTrainee(trainee);

  render() {
    const { error, trainee, isFetching, t } = this.props;

    return trainee && !isFetching ? (
      <VerifyTraineeInfo trainee={trainee} onConfirm={this.saveTrainee(trainee)} />
    ) : error ? (
      <Error />
    ) : (
      <Page title={t('registration.common.searching', 'Searching...')} textAlign="center" contentMinHeight="100px">
        <Loading />
      </Page>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(VerifyTraineeInfoContainer));
