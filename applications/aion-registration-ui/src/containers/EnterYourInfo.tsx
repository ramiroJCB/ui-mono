import * as React from 'react';
import EnterYourInfo from '../components/EnterYourInfo';
import MultipleTrainees from '../components/MultipleTrainees';
import { connect } from 'react-redux';
import { Error } from '@pec/aion-ui-components/components/Error';
import { History, Location } from 'history';
import { ITrainee } from '../interfaces/trainee';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { Page } from '../components/Page';
import { RootActions } from '../combineActions';
import { RootState } from '../combineReducers';
import { searchTrainees } from '../actions/searchTrainees';
import { ThunkDispatch } from 'redux-thunk';
import { updateTrainee } from '../actions/updateTrainee';
import { withTranslation } from 'react-i18next';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';

type OwnProps = {
  history: History;
  location: Location;
  match: {
    params: {
      companyId: string;
    };
  };
};

const mapStateToProps = ({
  trainee: { trainee, isFetching: isFetchingTrainee, error: traineeError },
  trainees: { trainees, isFetching: isFetchingTrainees, error: traineesError, lastFetchedPecId },
  userInfo: { userInfo }
}: RootState) => ({
  trainee,
  trainees,
  lastFetchedPecId,
  isFetching: isFetchingTrainee || isFetchingTrainees,
  error: traineeError || traineesError,
  userEmailAddress: userInfo && (userInfo.emailAddress ? userInfo.emailAddress : userInfo.userName)
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    history,
    match: {
      params: { companyId }
    }
  }: OwnProps
) => ({
  updateTrainee: (trainee: ITrainee) => dispatch(updateTrainee({ ...trainee, organizationId: companyId })),
  searchTrainees: (trainee: Partial<ITrainee>) =>
    dispatch(searchTrainees({ ...trainee, organizationId: companyId }, history))
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & OwnProps & I18nextProps;

class EnterYourInfoContainer extends React.Component<Props> {
  onSubmit = async (trainee: ITrainee) => await this.props.searchTrainees(trainee);
  handleRowClick = (trainee: ITrainee) => async () => await this.props.updateTrainee(trainee);

  render() {
    const {
      history,
      location: { state },
      trainees,
      isFetching,
      lastFetchedPecId,
      userEmailAddress: emailAddress,
      error,
      t
    } = this.props;
    return !isFetching && (!error || lastFetchedPecId !== null) ? (
      state && state.hasMultipleResults !== false && trainees ? (
        <Page
          title={t('registration.common.multipleRecordsFound', 'Multiple Records Found')}
          textAlign="center"
          contentMinHeight="250px"
        >
          <MultipleTrainees history={history} trainees={trainees} handleRowClick={this.handleRowClick} />
        </Page>
      ) : (
        <EnterYourInfo onSubmit={this.onSubmit} initialValues={{ emailAddress }} />
      )
    ) : error ? (
      <Error />
    ) : (
      <Page title={t('registration.common.searching', 'Searching...')} textAlign="center" contentMinHeight="100px">
        <Loading />
      </Page>
    );
  }
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(EnterYourInfoContainer));
