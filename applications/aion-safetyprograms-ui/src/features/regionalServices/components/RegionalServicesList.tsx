import * as React from 'react';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { AutoSizer, List, ListRowProps, WindowScroller } from 'react-virtualized';
import { BulkSelectButton } from '@pec/aion-ui-components/components/BulkSelectButton';
import { DeepReadonly } from 'ts-essentials';
import { FilterField } from '@pec/aion-ui-components/components/FilterField';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IRegionalService } from 'interfaces/regionalService';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';

type OwnProps = {
  serviceRegionId: string;
  regionalServices: DeepReadonly<IRegionalService[]>;
  selectedRegionalServiceIds: string[];
  selectRegionalServices: (serviceRegionId: string, ids: string[]) => void;
  deselectRegionalServices: (serviceRegionId: string, ids: string[]) => void;
  handleChangeFilter: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleResetFilter: () => void;
  filterTerm: string;
};

const styles = (theme: Theme) => ({
  filter: {
    padding: theme.spacing(0, 0, 1.5, 1.5)
  },
  icon: {
    minWidth: theme.spacing(4.5)
  },
  tip: {
    paddingLeft: theme.spacing(0.5)
  }
});

type Props = WithStyles<typeof styles> & OwnProps & I18nextProps;

type State = {
  lastClickedId: string | null;
};

class Component extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      lastClickedId: null
    };
  }

  handleClick = (id: string) => ({ shiftKey }: React.MouseEvent) => {
    const {
      serviceRegionId,
      regionalServices,
      selectedRegionalServiceIds,
      selectRegionalServices,
      deselectRegionalServices
    } = this.props;
    const { lastClickedId } = this.state;
    let ids;

    if (shiftKey && lastClickedId) {
      const allIds = regionalServices.map(({ id }) => id);
      const currentIndex = allIds.indexOf(id);
      const prevIndex = allIds.indexOf(lastClickedId);
      const [start, end] = [currentIndex, prevIndex].sort((a, b) => a - b);

      ids = allIds.slice(start, end + 1);
    } else {
      ids = [id];
    }

    if (selectedRegionalServiceIds.includes(id)) {
      deselectRegionalServices(serviceRegionId, ids);
    } else {
      selectRegionalServices(serviceRegionId, ids);
    }

    this.setState({
      lastClickedId: id
    });
  };

  handleBlur = ({ relatedTarget }: React.FocusEvent<HTMLElement>) => {
    if (!relatedTarget) {
      this.setState({ lastClickedId: null });
    }
  };

  handleSelectNone = () => {
    const { serviceRegionId, deselectRegionalServices, selectedRegionalServiceIds } = this.props;
    deselectRegionalServices(serviceRegionId, selectedRegionalServiceIds);
  };

  handleSelectAll = () => {
    const { serviceRegionId, regionalServices, selectRegionalServices } = this.props;
    selectRegionalServices(
      serviceRegionId,
      regionalServices.map(({ id }) => id)
    );
  };

  rowRenderer = ({ index, key, style }: ListRowProps) => {
    const { regionalServices, selectedRegionalServiceIds, classes } = this.props;
    const { id, serviceName } = regionalServices[index];
    const selected = selectedRegionalServiceIds.includes(id);

    return (
      <ListItem
        key={key}
        style={style}
        button
        dense
        divider
        selected={selected}
        onClick={this.handleClick(id)}
        onBlur={this.handleBlur}
      >
        <ListItemIcon className={classes.icon}>
          {selected ? (
            <CheckBoxIcon color="secondary" />
          ) : (
            <CheckBoxOutlineBlankIcon color={id === this.state.lastClickedId ? 'secondary' : undefined} />
          )}
        </ListItemIcon>
        <ListItemText primary={serviceName} primaryTypographyProps={{ noWrap: true }} title={serviceName} />
      </ListItem>
    );
  };

  noRowsRenderer = () => {
    const { t } = this.props;

    return (
      <ListItem divider style={{ justifyContent: 'center' }}>
        {this.props.filterTerm
          ? t('safetyPrograms.regionalServices.noResultsFound', 'No results found. Please refine your filter.')
          : t(
              'safetyPrograms.regionalServices.noServicesAvailable',
              'No services are available for the selected region.'
            )}
      </ListItem>
    );
  };

  render() {
    const {
      regionalServices,
      selectedRegionalServiceIds,
      handleChangeFilter,
      handleResetFilter,
      filterTerm,
      classes,
      t
    } = this.props;

    return (
      <React.Fragment>
        <GridContainer spacing={0}>
          <Grid item xs={6} className={classes.tip}>
            <GridContainer spacing={0} alignItems="baseline">
              <Grid item>
                <BulkSelectButton
                  allAreSelected={selectedRegionalServiceIds.length === regionalServices.length}
                  anyAreSelected={selectedRegionalServiceIds.length > 0}
                  handleSelectAll={this.handleSelectAll}
                  handleSelectNone={this.handleSelectNone}
                />
              </Grid>
              <Grid item style={{ flex: 1 }}>
                <Typography variant="body2" color="textSecondary">
                  {t('safetyPrograms.regionalServices.tip', 'Tip: Use shift-click to select multiple rows.')}
                </Typography>
              </Grid>
            </GridContainer>
          </Grid>
          <Grid item xs={6} className={classes.filter}>
            <FilterField value={filterTerm} handleChange={handleChangeFilter} handleReset={handleResetFilter} />
          </Grid>
        </GridContainer>
        <Divider />
        <WindowScroller>
          {({ isScrolling, onChildScroll }) => (
            <AutoSizer disableHeight>
              {({ width }) => (
                <List
                  height={400}
                  isScrolling={isScrolling}
                  onScroll={onChildScroll}
                  rowCount={regionalServices.length}
                  rowHeight={37}
                  rowRenderer={this.rowRenderer}
                  noRowsRenderer={this.noRowsRenderer}
                  width={width}
                  // The selectedRegionalServiceIds and lastClickedId props are only passed in
                  // so that the component re-renders when they change.
                  selectedRegionalServiceIds={selectedRegionalServiceIds}
                  lastClickedId={this.state.lastClickedId}
                />
              )}
            </AutoSizer>
          )}
        </WindowScroller>
      </React.Fragment>
    );
  }
}

export const RegionalServicesList = withStyles(styles)(withTranslation()(Component));
