import * as React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { ActivityAction, ActivityResourceName } from '@pec/aion-ui-core/interfaces/activities';
import { connect } from 'react-redux';
import { fetchUserInfoIfNeeded, hasPermission } from '@pec/aion-ui-core/actions/userInfo';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { Page } from '../components/Page';
import { RootActions } from '../combineActions';
import { RootState } from '../combineReducers';
import { ThunkDispatch } from 'redux-thunk';
import { UserInfoActivitiesType } from '@pec/aion-ui-core/interfaces/userInfo';
import { withTranslation } from 'react-i18next';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';

const { Read } = ActivityAction;
const { Students } = ActivityResourceName;
const { User } = UserInfoActivitiesType;

const mapStateToProps = (state: RootState) => state.userInfo;

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, RootActions>) => ({
  fetchUserInfoIfNeeded: () => dispatch(fetchUserInfoIfNeeded())
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & I18nextProps;

class CheckPermissionContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchUserInfoIfNeeded();
  }

  hasReadStudentsPermission() {
    const { userInfo } = this.props;
    return userInfo && hasPermission(userInfo, Read, Students, [{ id: userInfo.userId, type: User }]);
  }

  render() {
    const { children, isFetching, t } = this.props;
    return isFetching ? (
      <Page title={t('registration.common.searching', 'Searching…')} textAlign="center" contentMinHeight="100px">
        <Loading />
      </Page>
    ) : this.hasReadStudentsPermission() ? (
      <Page
        title={t('registration.checkPermission.alreadyRegistered', 'You Have Already Registered')}
        textAlign="center"
      >
        <GridContainer direction="column" alignItems="center" justify="center">
          <Grid item xs={12}>
            <Typography variant="h5" align="center">
              {t(
                'registration.checkPermission.loggedAsRegisteredStudent',
                'You are currently logged in as a registered student.'
              )}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="secondary" href="/">
              {t('registration.checkPermission.returnHome', 'Return Home')}
            </Button>
          </Grid>
        </GridContainer>
      </Page>
    ) : (
      children
    );
  }
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(CheckPermissionContainer));
