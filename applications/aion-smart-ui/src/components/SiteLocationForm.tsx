import * as React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { InjectedFormProps, reduxForm } from 'redux-form';
import { ISiteForm, ISiteLocation } from 'interfaces/site';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';

type OwnProps = {
  organizationId: string;
  handleCurrentLocation: (geocoder: google.maps.Geocoder, errorCallback: () => void) => void;
  handleLocationChange: (geocoder: google.maps.Geocoder, address: string) => Promise<ISiteLocation>;
  isFetchingLocation: boolean;
  enabledButtonNext: boolean;
};

type Props = InjectedFormProps<ISiteForm, OwnProps> & OwnProps & I18nextProps;

type State = {
  searchTerm: string;
  allowGeolocation: boolean;
};

class SiteLocation extends React.Component<Props, State> {
  geocoder: google.maps.Geocoder;

  constructor(props: Props) {
    super(props);
    this.state = {
      searchTerm: this.resolveSearchTerm(),
      allowGeolocation: true
    };
    this.resolveSearchTerm();
    this.geocoder = new window.google.maps.Geocoder();
  }

  componentDidUpdate({ initialValues: { latitude: prevLatitude, longitude: prevLongitude } }: Props) {
    const { latitude, longitude } = this.props.initialValues;
    if (latitude !== prevLatitude || longitude !== prevLongitude) {
      this.setState({
        searchTerm: this.resolveSearchTerm()
      });
    }
  }

  resolveSearchTerm = () => {
    const { latitude, longitude } = this.props.initialValues;
    return latitude && longitude ? `${latitude}, ${longitude}` : '';
  };

  handleLocationSearch = ({ key }: React.KeyboardEvent<HTMLInputElement>) => {
    if (key === 'Enter') {
      this.props.handleLocationChange(this.geocoder, this.state.searchTerm);
    }
  };

  handleCurrentLocation = () => {
    this.props.handleCurrentLocation(this.geocoder, () => {
      this.setState({ allowGeolocation: false });
    });
  };

  setSearchTerm = ({ target: { value: searchTerm } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      searchTerm
    });
  };

  render() {
    const {
      organizationId,
      initialValues: { latitude, longitude, id },
      isFetchingLocation,
      enabledButtonNext,
      t
    } = this.props;
    return (
      <GridContainer alignItems="flex-end">
        <Grid item xs={12} md={navigator.geolocation && this.state.allowGeolocation ? 6 : undefined}>
          <TextField
            variant="filled"
            autoFocus={!(latitude && longitude)}
            fullWidth
            required
            name="address"
            label={t('smart.siteLocationForm.enterALocation', 'Enter a Location')}
            placeholder={t('smart.siteLocationForm.searchForALocation', 'Search for a Location…')}
            value={this.state.searchTerm}
            type="search"
            InputProps={{
              onKeyUp: this.handleLocationSearch
            }}
            onChange={this.setSearchTerm}
            disabled={isFetchingLocation}
          />
        </Grid>
        {navigator.geolocation && this.state.allowGeolocation && (
          <Grid item xs={12} md={6}>
            <Button fullWidth color="primary" disabled={isFetchingLocation} onClick={this.handleCurrentLocation}>
              {t('smart.siteLocationForm.useMyCurrentLocation', 'Use My Current Location')}
            </Button>
          </Grid>
        )}
        {enabledButtonNext && (
          <Grid item xs={12}>
            <Link to={id ? `/${organizationId}/sites/${id}/edit/details` : `/${organizationId}/sites/add/details`}>
              <Button fullWidth variant="contained" color="primary" disabled={!(latitude && longitude)}>
                {t('smart.common.next', 'Next')}
              </Button>
            </Link>
          </Grid>
        )}
      </GridContainer>
    );
  }
}

export const SiteLocationForm = reduxForm<ISiteForm, OwnProps>({
  form: 'siteForm',
  destroyOnUnmount: false,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  updateUnregisteredFields: true
})(withTranslation()(SiteLocation));
