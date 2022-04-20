import * as React from 'react';
import { addRegionalReportSetting } from '../actions/addRegionalReportSetting';
import { connect } from 'react-redux';
import { fetchRegionalReportOptionsIfNeeded } from '../../clientRegionalReportOptions/actions';
import { fetchRegionalReportSettingsIfNeeded } from '../actions/fetchRegionalReportSettings';
import { IRegionalReportSetting, RegionalReportSettingValue } from 'interfaces/regionalReportSetting';
import { RegionalReportOptionKey } from 'interfaces/regionalReportOption';
import { RegionalReportSettingsComponent } from '../components/RegionalReportSettings';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { updateRegionalReportSetting } from '../actions/updateRegionalReportSetting';

const { True, False } = RegionalReportSettingValue;

type RouteParams = {
  organizationId: string;
};

const mapStateToProps = ({
  regionalReportOptions: {
    regionalReportOptions,
    isFetching: isFetchingRegionalReportOptions,
    error: regionalReportOptionsError
  },
  regionalReportSettings: {
    regionalReportSettings,
    isFetching: isFetchingRegionalReportSettings,
    error: regionalReportSettingsError
  }
}: RootState) => {
  return {
    isFetching: isFetchingRegionalReportOptions || isFetchingRegionalReportSettings,
    error: regionalReportOptionsError || regionalReportSettingsError,
    regionalReportOptions,
    regionalReportSettings
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
  fetchRegionalReportOptionsIfNeeded: () => dispatch(fetchRegionalReportOptionsIfNeeded()),
  fetchRegionalReportSettingsIfNeeded: () => dispatch(fetchRegionalReportSettingsIfNeeded(organizationId)),
  addRegionalReportSetting: (setting: Partial<IRegionalReportSetting>) =>
    dispatch(addRegionalReportSetting({ ...setting, organizationId })),
  updateRegionalReportSetting: (settingId: string, value: RegionalReportSettingValue) =>
    dispatch(updateRegionalReportSetting(settingId, value))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class RegionalReportSettings extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchRegionalReportOptionsIfNeeded();
    props.fetchRegionalReportSettingsIfNeeded();
  }

  toggleRegionalReportSetting = (optionKey: RegionalReportOptionKey) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { regionalReportSettings } = this.props;

    const newValue = event.target.checked ? True : False;
    const optionSetting = regionalReportSettings.find(s => s.regionalReportOptionKey === optionKey);

    if (optionSetting) {
      this.props.updateRegionalReportSetting(optionSetting.id, newValue);
    } else {
      this.props.addRegionalReportSetting({
        regionalReportOptionKey: optionKey,
        value: newValue
      });
    }
  };

  render() {
    const {
      isFetching,
      error,
      regionalReportOptions,
      regionalReportSettings,
      match: {
        params: { organizationId }
      }
    } = this.props;
    return (
      regionalReportOptions &&
      regionalReportSettings && (
        <RegionalReportSettingsComponent
          isFetching={isFetching}
          error={error}
          organizationId={organizationId}
          regionalReportOptions={regionalReportOptions}
          regionalReportSettings={regionalReportSettings}
          toggleRegionalReportSetting={this.toggleRegionalReportSetting}
        />
      )
    );
  }
}

export const RegionalReportSettingsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(RegionalReportSettings);
