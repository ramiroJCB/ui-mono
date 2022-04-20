import * as React from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { AutoSizer, Index, List, ListRowProps } from 'react-virtualized';
import { AxiosError } from 'axios';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'utility-types';
import { Error } from '@pec/aion-ui-components/components/Error';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { ISearchResultWithLogo } from 'interfaces/searchResult';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { MapComponent } from './Map';
import { SearchResultsPanel } from './SearchResultsPanel';

const maxCount = 100;
const styles = (theme: Theme) =>
  createStyles({
    paper: {
      height: '60vh'
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      padding: '0 25px',
      backgroundColor: theme.palette.common.white,
      borderBottom: `1px solid ${theme.palette.divider}`
    },
    center: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center'
    }
  });

type OwnProps = {
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | null;
  totalCount: number;
  searchResults: DeepReadonly<ISearchResultWithLogo[]>;
  fetchSearchResultLogoIfNeeded: (organizationId: string) => void;
};

type Props = OwnProps & WithStyles<typeof styles>;

type State = {
  selectedIndex: number;
  expanded: { [index: number]: boolean };
};

class SearchResults extends React.PureComponent<Props, State> {
  listRef = React.createRef<List>();

  constructor(props: Props) {
    super(props);

    this.state = {
      selectedIndex: 0,
      expanded: Array(maxCount)
        .fill(null)
        .reduce((values, _, i) => ({ ...values, [i]: false }), {})
    };
  }

  rowRenderer = (width: number) => ({ key, index, style }: ListRowProps) => {
    const { searchResults, fetchSearchResultLogoIfNeeded } = this.props;
    const { expanded, selectedIndex } = this.state;

    return index < maxCount ? (
      <SearchResultsPanel
        key={key}
        searchResult={searchResults[index]}
        expanded={expanded[index]}
        selected={selectedIndex === index}
        style={style}
        handleOnClick={this.setSelectedAndExpand(index)}
        containerWidth={width}
        fetchSearchResultLogoIfNeeded={fetchSearchResultLogoIfNeeded}
      />
    ) : (
      <Accordion expanded={false} key={key} style={style} square>
        <AccordionSummary>
          <Typography variant="body1" noWrap>
            Refine search criteria to see more results
          </Typography>
        </AccordionSummary>
      </Accordion>
    );
  };

  updateList() {
    if (this.listRef.current) {
      this.listRef.current.recomputeRowHeights();
      this.listRef.current.forceUpdateGrid();
    }
  }

  setSelectedAndExpand = (selectedIndex: number) => () => {
    this.setState(prevState => ({
      selectedIndex,
      expanded: { ...prevState.expanded, [selectedIndex]: !prevState.expanded[selectedIndex] }
    }));

    this.updateList();
  };

  setSelected = (selectedIndex: number) => {
    this.setState(prevState => ({
      selectedIndex,
      expanded: { ...prevState.expanded, [selectedIndex]: true }
    }));

    this.updateList();
  };

  getRowHeight = ({ index }: Index) =>
    this.state.expanded[index] && this.props.searchResults[index].description
      ? 265
      : this.state.expanded[index] && this.props.searchResults[index].tradeName
      ? 185
      : this.state.expanded[index]
      ? 170
      : 50;

  render() {
    const { classes, totalCount, searchResults, isFetching, error } = this.props;
    const { selectedIndex } = this.state;
    const searchResultsWithoutLogo = searchResults.map(({ logo, hasFetched, isFetching, ...rest }) => rest);

    return !isFetching && searchResults.length ? (
      <Grid item xs={12}>
        <Paper>
          <GridContainer spacing={0}>
            <Grid item xs={12} md={6} lg={4} xl={3} className={classes.paper}>
              <AutoSizer>
                {({ width, height }) => (
                  <List
                    ref={this.listRef}
                    style={{ outline: 'none' }}
                    height={height}
                    width={width}
                    rowHeight={this.getRowHeight}
                    rowCount={totalCount > maxCount ? searchResults.length + 1 : searchResults.length}
                    rowRenderer={this.rowRenderer(width)}
                    scrollToIndex={selectedIndex}
                  />
                )}
              </AutoSizer>
            </Grid>
            <Grid item xs={12} md={6} lg={8} xl={9}>
              <MapComponent
                selectedIndex={selectedIndex}
                searchResults={searchResultsWithoutLogo}
                setSelected={this.setSelected}
              />
            </Grid>
          </GridContainer>
        </Paper>
      </Grid>
    ) : error ? (
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <div className={classes.center}>
            <Error message="There was an error processing your request." />
          </div>
        </Paper>
      </Grid>
    ) : isFetching ? (
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <div className={classes.center}>
            <Loading />
          </div>
        </Paper>
      </Grid>
    ) : null;
  }
}

export const SearchResultsComponent = withStyles(styles)(SearchResults);
