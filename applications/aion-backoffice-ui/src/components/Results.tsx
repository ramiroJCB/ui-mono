import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { DeepReadonly } from 'utility-types';
import { History } from 'history';
import { Link } from '@pec/aion-ui-components/components/Link';
import { WithStyles, withStyles } from '@material-ui/core/styles';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';

type IResult = {
  id: string;
  [key: string]: any;
};

type OwnProps = {
  searchTerm: string;
  results: DeepReadonly<IResult[]> | null;
  cols: { [key: string]: string };
  uri: string;
  emptyMessage: string;
  activePage: string;
  pageSize: number;
  totalCount: number;
  pageUri: string;
  history: History;
  excludeLinkInProperty: string;
};

const styles = () => ({
  cell: {
    fontSize: 14
  }
});

type Props = WithStyles<typeof styles> & OwnProps & I18nextProps;

class Results extends React.Component<Props> {
  handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
    const { history, searchTerm, pageUri } = this.props;
    const uri = pageUri.replace('%s', encodeURIComponent(searchTerm)).replace('%p', (page + 1).toString());
    history.push(uri);
  };

  render() {
    const {
      results,
      cols,
      uri,
      emptyMessage,
      classes,
      activePage,
      pageSize,
      totalCount,
      t,
      excludeLinkInProperty
    } = this.props;
    return (
      <Grid item xs={12}>
        <Typography variant="subtitle1">{t('backoffice.results.searchResults', 'Search results')}</Typography>
        {results && results.length ? (
          <Table>
            <TableHead>
              <TableRow>
                {Object.keys(cols).map(key => (
                  <TableCell className={classes.cell} key={key}>
                    {cols[key]}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map(result => {
                const { id } = result;
                return (
                  <TableRow key={id}>
                    {Object.keys(cols).map(key => (
                      <TableCell className={classes.cell} key={`${key}-${id}`}>
                        {key === excludeLinkInProperty ? (
                          <Typography>{result[key]}</Typography>
                        ) : (
                          <Link to={uri.replace('%s', id)}>{result[key]}</Link>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  colSpan={Object.keys(cols).length}
                  count={totalCount}
                  rowsPerPage={pageSize}
                  page={parseInt(activePage, 10) - 1}
                  onChangePage={this.handleChangePage}
                  rowsPerPageOptions={[pageSize]}
                />
              </TableRow>
            </TableFooter>
          </Table>
        ) : (
          <Typography>{emptyMessage}</Typography>
        )}
      </Grid>
    );
  }
}

export default withStyles(styles)(withTranslation()(Results));
