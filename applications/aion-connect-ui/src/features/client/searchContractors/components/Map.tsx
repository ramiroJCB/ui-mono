import * as React from 'react';
import * as ReactDOM from 'react-dom/server';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'utility-types';
import { InfoWindow } from './InfoWindow';
import { ISearchResult } from 'interfaces/searchResult';
import { isEqual } from 'lodash';

const styles = (theme: Theme) =>
  createStyles({
    map: {
      width: '100%',
      height: '60vh',
      [theme.breakpoints.down('sm')]: {
        borderBottomLeftRadius: theme.spacing(0.5),
        borderBottomRightRadius: theme.spacing(0.5)
      },
      [theme.breakpoints.up('md')]: {
        borderTopRightRadius: theme.spacing(0.5),
        borderBottomRightRadius: theme.spacing(0.5)
      }
    },
    mapContainer: {
      position: 'relative'
    }
  });

type OwnProps = {
  selectedIndex: number;
  searchResults: DeepReadonly<ISearchResult[]>;
  setSelected: (selectedIndex: number) => void;
};

type Props = OwnProps & WithStyles<typeof styles>;

class Map extends React.Component<Props> {
  mapRef = React.createRef<HTMLDivElement>();
  map: google.maps.Map | null;
  infoWindow: google.maps.InfoWindow | null;
  markers: (google.maps.Marker | undefined)[];
  bounds: google.maps.LatLngBounds | null;
  icon: google.maps.ReadonlySymbol;

  constructor(props: Props) {
    super(props);
    this.map = null;
    this.infoWindow = null;
    this.bounds = null;
    this.markers = [];
    this.icon = {
      path: window.google.maps.SymbolPath.CIRCLE,
      scale: 6,
      fillColor: '#FF0000',
      fillOpacity: 0.7,
      strokeWeight: 0.4
    };
  }

  componentDidMount() {
    const { selectedIndex, searchResults } = this.props;
    const selected = searchResults[selectedIndex];
    const position = { lat: selected.latitude, lng: selected.longitude } || { lat: 30.433006, lng: -90.086872 };
    const styles = [
      {
        featureType: 'poi' as const,
        elementType: 'labels' as const,
        stylers: [
          {
            visibility: 'off'
          }
        ]
      }
    ];

    if (this.mapRef.current) {
      this.infoWindow = new window.google.maps.InfoWindow();
      this.bounds = new window.google.maps.LatLngBounds();
      this.map = new window.google.maps.Map(this.mapRef.current, {
        zoom: 5,
        maxZoom: 13,
        center: position,
        mapTypeControlOptions: {
          style: window.google.maps.MapTypeControlStyle.DROPDOWN_MENU
        },
        streetViewControl: false,
        zoomControl: false,
        styles
      });

      if (searchResults.length) {
        this.drawMarkers();
        this.drawInfoWindow();
      }
    }
  }

  componentDidUpdate({ selectedIndex: prevSelectedIndex, searchResults: prevSearchResults }: Props) {
    const { selectedIndex, searchResults } = this.props;

    if (!isEqual(prevSearchResults, searchResults)) {
      this.clearMarkers();
      this.drawMarkers();
      this.drawInfoWindow();
    }

    if (prevSelectedIndex !== selectedIndex) {
      this.markers[prevSelectedIndex]!.setIcon(this.icon);
      this.markers[selectedIndex]!.setIcon(null);
      this.drawInfoWindow();
    }
  }

  clearMarkers() {
    this.markers.forEach(marker => marker?.setMap(null));
  }

  drawMarkers() {
    const { selectedIndex, searchResults } = this.props;
    this.markers = searchResults.map((searchResult, index) => this.createMarker(searchResult, selectedIndex, index));
    this.map && this.bounds && this.map.fitBounds(this.bounds);
  }

  drawInfoWindow() {
    if (this.map && this.infoWindow) {
      const { selectedIndex, searchResults } = this.props;
      const selected = searchResults[selectedIndex];

      this.infoWindow.setContent(ReactDOM.renderToString(<InfoWindow searchResult={selected} />));
      this.infoWindow.open(this.map, this.markers[selectedIndex]);
    }
  }

  createMarker({ latitude, longitude }: DeepReadonly<ISearchResult>, selectedIndex: number, index: number) {
    if (this.map) {
      const position = { lat: latitude, lng: longitude };
      const marker = new window.google.maps.Marker({
        position,
        map: this.map,
        icon: selectedIndex !== index ? this.icon : undefined
      });

      this.bounds && this.bounds.extend(position);

      marker.addListener('click', () => {
        if (this.map && this.infoWindow) {
          this.drawInfoWindow();
          this.props.setSelected(index);
        }
      });

      return marker;
    } else {
      return undefined;
    }
  }

  render() {
    const { classes } = this.props;
    return <div className={classes.map} ref={this.mapRef} />;
  }
}

export const MapComponent = withStyles(styles)(Map);
