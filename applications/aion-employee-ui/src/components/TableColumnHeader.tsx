import * as React from 'react';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { Accordion, AccordionSummary, createStyles, Grid, Typography, withStyles, WithStyles } from '@material-ui/core';
import { IHeaderObject } from 'interfaces/HeaderObject';
import { TableHeader } from '../components/tableHeader';

const styles = createStyles({
  header: {
    fontWeight: 'bold',
    cursor: 'default'
  },
  rtl: {
    direction: 'rtl'
  }
});

type OwnProps = {
  headers: IHeaderObject[];
  sortClickHandler: (id: string) => () => void;
  orderBy?: string | null;
  order: 'desc' | 'asc';
  setSearch: (v: string) => void;
  tableName: string;
  searchValue: string;
  onSearchChange: (evt: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
};

type Props = OwnProps & WithStyles;

const TableHeaderComponent: React.FunctionComponent<Props> = ({
  headers,
  sortClickHandler,
  classes,
  orderBy,
  order,
  setSearch,
  tableName,
  searchValue,
  onSearchChange
}) => (
  <Accordion expanded={false}>
    <AccordionSummary>
      <Grid container direction="column">
        <TableHeader
          setSearch={setSearch}
          tableName={tableName}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
        />
        {headers.length > 0 && (
          <Grid container item justify="space-between" direction="row">
            {headers.map((col: IHeaderObject) => (
              <Grid item sm={col.size} md={col.size} lg={col.size} key={col.id}>
                <Typography
                  onClick={col.isOrderable !== false ? sortClickHandler(col.id) : undefined}
                  className={`${classes.header} ${col.rtl && classes.rtl}`}
                >
                  {col.label}
                  <TableSortLabel
                    active={orderBy === col.id}
                    direction={order}
                    onClick={sortClickHandler(col.id)}
                    disabled={col.isOrderable === false}
                  />
                </Typography>
              </Grid>
            ))}
          </Grid>
        )}
      </Grid>
    </AccordionSummary>
  </Accordion>
);

export const TableColumnHeader = withStyles(styles)(TableHeaderComponent);
