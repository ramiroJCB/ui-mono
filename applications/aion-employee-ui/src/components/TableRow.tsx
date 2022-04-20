import * as React from 'react';
import classNames from 'classnames';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  createStyles,
  Grid,
  Theme,
  Typography,
  withStyles,
  WithStyles
} from '@material-ui/core';
import { Error } from '@pec/aion-ui-components/components/Error';
import { IAllEmployeesRow } from 'reducers/allEmployeesTable';
import { IHeaderObject } from 'interfaces/HeaderObject';
import { IPECEmployee } from 'interfaces/PECEmployee';
import { IVerisourceEmployee } from 'interfaces/VerisourceEmployee';
import { Loading } from '@pec/aion-ui-components/components/Loading';

type Row = IPECEmployee | IVerisourceEmployee;

const styles = (theme: Theme) =>
  createStyles({
    row: {
      cursor: 'pointer',
      width: '100%'
    },
    hover: {
      '&:hover': {
        backgroundColor: theme.palette.grey[300]
      }
    },
    selected: {
      backgroundColor: theme.palette.grey[300]
    },
    detail: {
      width: 'calc(100% - 32px)'
    },
    disabledRow: {
      opacity: 0.5
    }
  });

type OwnProps = {
  headers: IHeaderObject[];
  row: Row;
  expanded?: boolean;
  toggleExpandedRow?: (employee: IPECEmployee) => () => void;
  rowAction?: (row: Row) => () => void;
  renderFunctions?: {
    [id: string]: (
      data: string | number | boolean | { id: string; name: string }[],
      row: Row,
      mouseOver?: boolean
    ) => JSX.Element | string;
  };
  selected?: boolean;
  detailData?: IAllEmployeesRow;
};

type Props = OwnProps & WithStyles;

type State = {
  mouseOver: boolean;
};

class TableRowComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      mouseOver: false
    };
  }

  handleMouseEnter = (_: React.MouseEvent<HTMLDivElement, MouseEvent>) => this.setState({ mouseOver: true });

  handleMouseLeave = (_: React.MouseEvent<HTMLDivElement, MouseEvent>) => this.setState({ mouseOver: false });

  render() {
    const {
      row,
      headers,
      classes,
      expanded,
      toggleExpandedRow,
      rowAction,
      renderFunctions = {},
      selected,
      detailData
    } = this.props;
    const { mouseOver } = this.state;
    const { isFetching, error, data } = detailData || {};
    return (
      <Accordion
        expanded={expanded !== undefined ? expanded : false}
        onChange={toggleExpandedRow && toggleExpandedRow(row as IPECEmployee)}
        key={row['id']}
        classes={{ root: classNames(classes.hover, selected && classes.selected) }}
      >
        <AccordionSummary expandIcon={toggleExpandedRow && <ExpandMoreIcon />}>
          <div
            className={row['disabled'] ? classes.disabledRow : classes.row}
            onClick={!row['disabled'] && !!rowAction ? rowAction(row) : undefined}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
          >
            <Grid container justify="space-between" direction="row">
              {headers.map(({ id, size }: IHeaderObject) => (
                <Grid item sm={size} md={size} lg={size} key={`${id} ${row[id]}`}>
                  <Typography>
                    {renderFunctions[id] ? renderFunctions[id](row[id], row, mouseOver) : row[id]}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </div>
        </AccordionSummary>
        <AccordionDetails classes={{ root: classes.detail }}>
          <div
            key={row['id']}
            className={row['disabled'] ? classes.disabledRow : classes.row}
            onClick={!row['disabled'] && !!rowAction ? rowAction(row) : undefined}
          >
            {isFetching ? (
              <Loading />
            ) : !!error ? (
              <Error />
            ) : (
              <Grid container justify="space-between" direction="row">
                {headers.map(
                  ({ expandedId: id, id: oldId, size }: IHeaderObject) =>
                    data && (
                      <Grid item sm={size} md={size} lg={size} key={`${id} ${data[id || oldId]}`}>
                        <Typography>
                          {id && renderFunctions[id] ? renderFunctions[id || oldId](data[id], data) : data[id || oldId]}
                        </Typography>
                      </Grid>
                    )
                )}
              </Grid>
            )}
          </div>
        </AccordionDetails>
      </Accordion>
    );
  }
}

export const TableRow = withStyles(styles)(TableRowComponent);
