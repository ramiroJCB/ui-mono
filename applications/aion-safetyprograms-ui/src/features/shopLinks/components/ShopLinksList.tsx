import * as React from 'react';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { AutoSizer, List, ListRowProps, WindowScroller } from 'react-virtualized';
import { BulkSelectButton } from '@pec/aion-ui-components/components/BulkSelectButton';
import { DeepReadonly } from 'ts-essentials';
import { FilterField } from '@pec/aion-ui-components/components/FilterField';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { IEditShopLinksForm, ISafetyProgram } from 'interfaces/safetyProgram';
import { FormApi } from 'final-form';
import { Box, Typography } from '@material-ui/core';
import { SortableTableCell } from 'components/SortableTableCell';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';

type OwnProps = {
  orderby: string;
  form: FormApi<IEditShopLinksForm>;
  safetyPrograms: DeepReadonly<ISafetyProgram[]>;
  selectedSafetyProgramIds: string[];
  unfilteredSafetyProgramIds: string[];
  handleChangeFilter: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleResetFilter: () => void;
  handleHeaderClick: (orderby: string) => () => void;
  updateUnfilteredIds: (ids: string[]) => void;
  filterTerm: string;
};

const styles = (theme: Theme) => ({
  filter: {
    padding: theme.spacing(0, 0, 1.5, 1.5)
  },
  icon: {
    minWidth: theme.spacing(4.5)
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
      safetyPrograms,
      selectedSafetyProgramIds,
      form,
      unfilteredSafetyProgramIds,
      updateUnfilteredIds
    } = this.props;

    const { lastClickedId } = this.state;
    let ids;
    if (shiftKey && lastClickedId) {
      const allIds = safetyPrograms.map(({ id }) => id);
      const currentIndex = allIds.indexOf(id);
      const prevIndex = allIds.indexOf(lastClickedId);
      const [start, end] = [currentIndex, prevIndex].sort((a, b) => a - b);

      ids = allIds.slice(start, end + 1);
    } else {
      ids = [id];
    }
    if (unfilteredSafetyProgramIds.includes(id)) {
      updateUnfilteredIds(unfilteredSafetyProgramIds.filter(x => x !== id));
    }
    if (selectedSafetyProgramIds.includes(id)) {
      form.change(
        'safetyProgramIds',
        selectedSafetyProgramIds.filter(x => x !== id)
      );
    } else {
      form.change('safetyProgramIds', selectedSafetyProgramIds.concat(ids));
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
    const { form, updateUnfilteredIds } = this.props;
    updateUnfilteredIds([]);
    form.change('safetyProgramIds', []);
  };

  handleSelectAll = () => {
    const { safetyPrograms, form, updateUnfilteredIds } = this.props;
    updateUnfilteredIds([]);
    form.change(
      'safetyProgramIds',
      safetyPrograms.map(({ id }) => id)
    );
  };

  rowRenderer = ({ index, key, style }: ListRowProps) => {
    const { safetyPrograms, selectedSafetyProgramIds, classes } = this.props;
    const { id, title } = safetyPrograms[index];
    const selected = selectedSafetyProgramIds.includes(id);

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
            <CheckBoxIcon color="primary" />
          ) : (
            <CheckBoxOutlineBlankIcon color={id === this.state.lastClickedId ? 'primary' : undefined} />
          )}
        </ListItemIcon>
        <Box ml={2}>
          <ListItemText primary={title} primaryTypographyProps={{ noWrap: true }} title={title} />
        </Box>
      </ListItem>
    );
  };

  noRowsRenderer = () => {
    const { filterTerm, t } = this.props;

    return (
      <ListItem divider style={{ justifyContent: 'center' }}>
        {filterTerm
          ? t('safetyPrograms.common.noResultsFound', 'No results found. Please refine your search.')
          : t('safetyPrograms.shopLinks.noSafetyProgramsAvailable', 'No Program Reviews are available.')}
      </ListItem>
    );
  };

  render() {
    const {
      safetyPrograms,
      selectedSafetyProgramIds,
      handleChangeFilter,
      handleResetFilter,
      handleHeaderClick,
      orderby,
      filterTerm,
      classes,
      t
    } = this.props;

    return (
      <>
        <GridContainer>
          <Grid item xs={12}>
            <Box padding={1}>
              <Typography variant="h6">{t('safetyPrograms.common.editShopLinks', 'Edit Shop Links')}</Typography>
            </Box>
          </Grid>
          <Grid item xs={8} style={{ paddingLeft: 4 }}>
            <GridContainer spacing={0} alignItems="center">
              <BulkSelectButton
                allAreSelected={selectedSafetyProgramIds.length === safetyPrograms.length}
                anyAreSelected={selectedSafetyProgramIds.length > 0}
                handleSelectAll={this.handleSelectAll}
                handleSelectNone={this.handleSelectNone}
              />
              <table style={{ margin: 0 }}>
                <tbody>
                  <tr>
                    <SortableTableCell
                      handleClick={handleHeaderClick}
                      orderby={orderby}
                      property="title"
                      borderless={true}
                    >
                      {t('safetyPrograms.common.programName', 'Program Name')}
                    </SortableTableCell>
                  </tr>
                </tbody>
              </table>
            </GridContainer>
          </Grid>
          <Grid item xs={4} className={classes.filter}>
            <FilterField
              value={filterTerm}
              label={t('safetyPrograms.shopLinks.searchPrograms', 'Search Programs')}
              handleChange={handleChangeFilter}
              handleReset={handleResetFilter}
            />
          </Grid>
        </GridContainer>
        <WindowScroller>
          {({ isScrolling, onChildScroll }) => (
            <AutoSizer disableHeight>
              {({ width }) => (
                <List
                  height={400}
                  isScrolling={isScrolling}
                  onScroll={onChildScroll}
                  rowCount={safetyPrograms.length}
                  rowHeight={37}
                  rowRenderer={this.rowRenderer}
                  noRowsRenderer={this.noRowsRenderer}
                  width={width}
                  selectedSafetyProgramIds={selectedSafetyProgramIds}
                  lastClickedId={this.state.lastClickedId}
                />
              )}
            </AutoSizer>
          )}
        </WindowScroller>
      </>
    );
  }
}

export const ShopLinksList = withStyles(styles)(withTranslation()(Component));
