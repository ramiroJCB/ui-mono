import * as React from 'react';
import filesize from 'filesize';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { ContractorFilterContainer } from '../containers/ContractorFilter';
import { DeepReadonly } from 'ts-essentials';
import { IDocument } from 'interfaces/document';
import { LinkedRow } from '@pec/aion-ui-components/components/LinkedRow';
import { Search } from '@pec/aion-ui-components/components/Search';
import { SortableTableCell } from 'components/SortableTableCell';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { useSharedTableStyles } from 'hooks/useSharedTableStyles';
import { useTranslation } from 'react-i18next';
import { localizeDate, localizeDateTime, localizeNumber } from '@pec/aion-ui-i18next/helpers/localize';

type Props = {
  basepath: string;
  isFetching: boolean;
  documents: DeepReadonly<IDocument[]> | null;
  page: number;
  searchTerm: string;
  $orderby: string;
  total: number | null;
  rowsPerPage: number;
  handleSearch: (searchTerm: string) => void;
  handleHeaderClick: (orderby: string) => () => void;
  onChangePage: (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => void;
};

export const DocumentsTableComponent: React.FC<Props> = ({
  basepath,
  documents,
  isFetching,
  page,
  searchTerm,
  $orderby,
  total,
  rowsPerPage,
  handleSearch,
  handleHeaderClick,
  onChangePage
}) => {
  const classes = useSharedTableStyles();
  const { t, i18n } = useTranslation();

  return (
    <React.Fragment>
      <GridContainer justify="flex-end">
        <Grid item xs={12} md={6} lg={4} xl={3}>
          <ContractorFilterContainer />
        </Grid>
        <Grid item xs={12} md={6} lg={4} xl={3}>
          <Search
            isFetching={isFetching}
            searchTerm={searchTerm}
            handleSearch={handleSearch}
            fullWidth
            label={t('safetyPrograms.common.searchFileName', 'Search File Name')}
          />
        </Grid>
      </GridContainer>
      <Grid item xs={12}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className={classes.tableCell} align="left" style={{ whiteSpace: 'nowrap' }}>
                {t('safetyPrograms.common.companyID', 'Company ID')}
              </TableCell>
              <SortableTableCell handleClick={handleHeaderClick} orderby={$orderby} property="organizationName">
                {t('safetyPrograms.common.contractor', 'Contractor')}
              </SortableTableCell>
              <SortableTableCell handleClick={handleHeaderClick} orderby={$orderby} property="fileName">
                {t('safetyPrograms.common.fileName', 'File Name')}
              </SortableTableCell>
              <SortableTableCell handleClick={handleHeaderClick} orderby={$orderby} property="createdDateUtc">
                {t('safetyPrograms.common.uploaded', 'Uploaded')}
              </SortableTableCell>
              <TableCell className={classes.tableCell}>{t('safetyPrograms.common.size', 'Size')}</TableCell>
            </TableRow>
          </TableHead>
          {documents && (
            <TableBody>
              {documents.length > 0 ? (
                documents.map(
                  ({ fileName, id, fileSize, createdDateUtc, organizationCompanyNumber, organizationName }) => {
                    const date = new Date(createdDateUtc);

                    return (
                      <LinkedRow key={id} to={`${basepath}/${id}`}>
                        <TableCell align="left">{organizationCompanyNumber}</TableCell>
                        <TableCell>{organizationName}</TableCell>
                        <TableCell style={{ overflowWrap: 'anywhere' }}>{fileName}</TableCell>
                        <TableCell title={localizeDateTime(date, t)}>{localizeDate(date, t)}</TableCell>
                        <TableCell
                          style={{ whiteSpace: 'nowrap' }}
                          title={t('safetyPrograms.common.bytes', {
                            filesize: localizeNumber(fileSize, t),
                            defaultValue: '{{filesize}} bytes'
                          })}
                        >
                          {filesize(fileSize, { locale: i18n.language })}
                        </TableCell>
                      </LinkedRow>
                    );
                  }
                )
              ) : (
                <TableRow>
                  <TableCell className={classes.tableCell} colSpan={5} align="center">
                    {searchTerm
                      ? t('safetyPrograms.common.noResultsFound', 'No results found. Please refine your search.')
                      : t('safetyPrograms.common.noDocumentsUploaded', 'No documents have been uploaded.')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
          {total !== null && (
            <TableFooter>
              <TableRow>
                <TablePagination
                  className={classes.pagination}
                  count={total}
                  onChangePage={onChangePage}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  rowsPerPageOptions={[]}
                />
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </Grid>
    </React.Fragment>
  );
};
