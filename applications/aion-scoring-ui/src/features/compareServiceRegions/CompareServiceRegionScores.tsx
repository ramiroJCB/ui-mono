import React, { useEffect } from 'react';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import { contractorsAionScoresSelectors, fetchContractorsAionScores } from './contractorsAionScores/slice';
import { contractorsLegacyScoresSelectors, fetchContractorsLegacyScores } from './contractorsLegacyScores/slice';
import { Error } from '@pec/aion-ui-components/components/Error';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { makeStyles, createStyles, Theme } from '@material-ui/core';
import { RankingRow } from './RankingRow';
import { ScoringContainer } from 'common/ScoringContainer';
import { useAppDispatch, useTypedSelector } from 'app/reducer';
import { useParams } from 'react-router-dom';

type RouteParams = {
  organizationId: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tableCell: {
      fontSize: 16
    },
    search: {
      width: theme.spacing(38)
    }
  })
);

export const CompareServiceRegionScores: React.FC = () => {
  const classes = useStyles();
  const { organizationId } = useParams<RouteParams>();
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = React.useState('');
  const { isFetching, error, total } = useTypedSelector(state => state.contractorsLegacyScores);
  const contractorsLegacyScores = useTypedSelector(contractorsLegacyScoresSelectors.selectAll);
  const contractorsAionScores = useTypedSelector(contractorsAionScoresSelectors.selectAll);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const contractorScores = searchTerm
    ? contractorsLegacyScores.filter(x => x.contractorName.toLowerCase().includes(searchTerm.toLowerCase()))
    : contractorsLegacyScores;

  const getAionScore = (contractorId: string): string =>
    contractorsAionScores?.find(x => x.contractorId === contractorId)?.calculatedScore || '0';

  useEffect(() => {
    dispatch(fetchContractorsLegacyScores({ organizationId }));
  }, [dispatch, organizationId]);

  useEffect(() => {
    dispatch(fetchContractorsAionScores({ organizationId }));
  }, [dispatch, organizationId]);

  return (
    <ScoringContainer>
      {!isFetching && !error ? (
        <>
          <GridContainer justify={'flex-end'}>
            <TextField
              className={classes.search}
              placeholder={'Search for a Contractor'}
              onChange={handleSearch}
              variant="filled"
              inputProps={{ style: { padding: '20px 0 20px 12px' } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </GridContainer>
          <Table>
            <colgroup>
              <col style={{ width: '60%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '20%' }} />
            </colgroup>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableCell}>Contractor ({total})</TableCell>
                <TableCell className={classes.tableCell} align="center">
                  Aion Score
                </TableCell>
                <TableCell className={classes.tableCell} align="center">
                  Score Discrepancy
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contractorScores.length > 0 &&
                contractorScores.map(({ contractorOrganizationId, contractorName, ssqScore }) => (
                  <React.Fragment key={contractorOrganizationId}>
                    <RankingRow
                      name={contractorName}
                      aionScore={getAionScore(contractorOrganizationId)}
                      legacyScore={ssqScore}
                    />
                  </React.Fragment>
                ))}
            </TableBody>
          </Table>
        </>
      ) : error ? (
        <Error message="There was an error processing your request." />
      ) : (
        <Loading />
      )}
    </ScoringContainer>
  );
};
