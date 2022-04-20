import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { ISiteLocation } from 'interfaces/site';

type OwnProps = {
  location: ISiteLocation;
  isFetchingLocation: boolean;
};

type State = {
  searchTerm: string;
  allowGeolocation: boolean;
};

const spinnerSize = 150;

const styles = createStyles({
  helperText: {
    paddingBottom: 10
  },
  map: {
    width: '100%',
    minHeight: 300,
    height: '100%'
  },
  mapContainer: {
    position: 'relative',
    flexGrow: 1
  },
  spinner: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    margin: `-${spinnerSize / 2}px 0 0 -${spinnerSize / 2}px`,
    opacity: 0.5,
    zIndex: 1
  },
  gridContainerFix: {
    flexGrow: 1
  }
});

type Props = WithStyles<typeof styles> & OwnProps;

class SiteLocationMap extends React.Component<Props, State> {
  map: google.maps.Map | null;
  mapRef: HTMLDivElement | null;
  marker: google.maps.Marker | null;

  constructor(props: Props) {
    super(props);
    this.map = null;
    this.mapRef = null;
    this.marker = null;
  }

  componentDidMount() {
    const { latitude, longitude } = this.props.location;
    const center = {
      lat: latitude || 40,
      lng: longitude || -90
    };
    if (this.mapRef) {
      this.map = new window.google.maps.Map(this.mapRef, {
        zoom: 5,
        center,
        mapTypeControlOptions: {
          style: window.google.maps.MapTypeControlStyle.DROPDOWN_MENU
        },
        streetViewControl: false,
        zoomControl: false
      });
      this.marker = new window.google.maps.Marker({ map: this.map, position: center });
    }
  }

  componentDidUpdate({
    location: { latitude: prevLatitude, longitude: prevLongitude, formattedAddress: prevFormattedAddress }
  }: Props) {
    const { latitude, longitude, formattedAddress } = this.props.location;
    if (latitude !== prevLatitude || longitude !== prevLongitude || formattedAddress !== prevFormattedAddress) {
      if (this.map && this.marker && latitude && longitude) {
        const latLng = {
          lat: latitude,
          lng: longitude
        };
        this.map.setCenter(latLng);
        this.marker.setPosition(latLng);
      }
    }
  }

  render() {
    const { classes, isFetchingLocation } = this.props;
    return (
      <GridContainer style={{ display: 'flex' }} spacing={0} className={classes.gridContainerFix}>
        <Grid item xs={12} className={classes.mapContainer}>
          {isFetchingLocation && <CircularProgress className={classes.spinner} size={spinnerSize} />}
          <div className={classes.map} ref={ref => (this.mapRef = ref)} />
        </Grid>
      </GridContainer>
    );
  }
}

export const SiteLocationMapComponent = withStyles(styles)(SiteLocationMap);
