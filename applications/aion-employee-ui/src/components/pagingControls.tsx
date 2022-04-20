import * as React from 'react';
import {
  Accordion,
  AccordionSummary,
  createStyles,
  Grid,
  TablePagination,
  withStyles,
  WithStyles
} from '@material-ui/core';

type OwnProps = {
  itemCount: number;
  handlePageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
  currentPage: number;
  rowsPerPage: number;
};

const styles = createStyles({
  pageSelection: {
    borderBottom: 'none',
    width: '100%'
  }
});

type Props = OwnProps & WithStyles;

const PagingControlsComponent: React.JSXElementConstructor<Props> = ({
  itemCount,
  handlePageChange,
  currentPage,
  rowsPerPage,
  classes
}: Props) => (
  <Accordion expanded={false}>
    <AccordionSummary expandIcon={null}>
      <Grid container direction="row" justify="flex-end">
        <table>
          <tbody>
            <tr>
              <TablePagination
                count={itemCount === undefined ? 0 : itemCount}
                onChangePage={handlePageChange}
                className={classes.pageSelection}
                page={currentPage === undefined ? 0 : currentPage}
                rowsPerPage={rowsPerPage || 0}
                rowsPerPageOptions={[]}
              />
            </tr>
          </tbody>
        </table>
      </Grid>
    </AccordionSummary>
  </Accordion>
);

export type PagingControlsProps = OwnProps;

export const PagingControls = withStyles(styles)(PagingControlsComponent);
