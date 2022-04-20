import * as React from 'react';
import IdentifyTrainee from '../components/IdentifyTrainee';
import MultipleTrainees from '../components/MultipleTrainees';
import { connect } from 'react-redux';
import { fetchTrainees } from '../actions/fetchTrainees';
import { History, Location } from 'history';
import { IIdentifyTraineeForm } from '../interfaces/identifyTraineeForm';
import { ITrainee } from '../interfaces/trainee';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { Page } from '../components/Page';
import { RootActions } from '../combineActions';
import { RootState } from '../combineReducers';
import { ThunkDispatch } from 'redux-thunk';
import { withTranslation } from 'react-i18next';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';

type OwnProps = {
  history: History;
  location: Location;
};

const mapStateToProps = (state: RootState) => {
  const {
    trainees: { trainees, isFetching, lastFetchedPecId }
  } = state;
  const lastFetchedPecIdMasked = lastFetchedPecId && lastFetchedPecId.slice(3);

  return {
    trainees,
    isFetching,
    lastFetchedPecIdMasked
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, RootActions>, { history }: OwnProps) => ({
  fetchTrainees: (pecIdentifier: string) => dispatch(fetchTrainees(pecIdentifier, history))
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & OwnProps & I18nextProps;

class IdentifyTraineeContainer extends React.Component<Props> {
  onSubmit = async ({ pecIdentifier }: IIdentifyTraineeForm) => await this.props.fetchTrainees(`PEC${pecIdentifier}`);

  handleRowClick = (trainee: ITrainee) => () => {
    return new Promise<ITrainee>(resolve => {
      this.props.history.push(`/trainees/${trainee.id}`);
      resolve(trainee);
    });
  };

  render() {
    const {
      history,
      location: { state },
      trainees,
      isFetching,
      lastFetchedPecIdMasked,
      t
    } = this.props;
    return !isFetching ? (
      state && state.hasMultipleResults !== false && trainees ? (
        <Page
          title={t('registration.common.multipleRecordsFound', 'Multiple Records Found')}
          textAlign="center"
          contentMinHeight="250px"
        >
          <MultipleTrainees history={history} trainees={trainees} handleRowClick={this.handleRowClick} />
        </Page>
      ) : (
        <IdentifyTrainee onSubmit={this.onSubmit} initialValues={{ pecIdentifier: lastFetchedPecIdMasked }} />
      )
    ) : (
      <Page title={t('registration.common.searching', 'Searching...')} textAlign="center" contentMinHeight="100px">
        <Loading />
      </Page>
    );
  }
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(IdentifyTraineeContainer));
