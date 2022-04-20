import * as React from 'react';
import SearchIcon from '@material-ui/icons/Search';
import { createStyles, Grid, Input, Typography, withStyles, WithStyles } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';

type OwnProps = {
  tableName: string;
  setSearch: (searchValue: string) => void;
  onSearchChange: (evt: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  searchValue: string;
};

const styles = createStyles({
  headerRow: {
    marginBottom: '5px',
    cursor: 'default'
  }
});

type Props = OwnProps & WithStyles & I18nextProps;

const searchOnEnter = (fn: (s: string) => void, value: string) => (evt: React.KeyboardEvent<HTMLDivElement>) => {
  if (evt.key === 'Enter') {
    fn(value);
  }
};

const clickSearch = (fn: (s: string) => void, value: string) => (_: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
  fn(value);
};

const TableHeaderComponent: React.JSXElementConstructor<Props> = ({
  tableName,
  onSearchChange,
  searchValue,
  setSearch,
  classes,
  t
}: Props) => (
  <Grid item container justify="space-between" direction="row" className={classes.headerRow}>
    <Grid item>
      <Typography variant="h6">{tableName}</Typography>
    </Grid>
    <Grid item>
      <Input
        placeholder={t('employee.tableHeader.search', 'Search')}
        value={searchValue}
        onChange={onSearchChange}
        onKeyPress={searchOnEnter(setSearch, searchValue)}
        startAdornment={<SearchIcon onClick={clickSearch(setSearch, searchValue)} />}
      />
    </Grid>
  </Grid>
);

export type TableHeaderProps = OwnProps;

export const TableHeader = withStyles(styles)(withTranslation()(TableHeaderComponent));
