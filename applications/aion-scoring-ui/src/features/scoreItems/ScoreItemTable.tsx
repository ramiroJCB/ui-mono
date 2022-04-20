import EditIcon from '@material-ui/icons/Edit';
import React, { useEffect } from 'react';
import { Button, Table, TableHead, TableRow, TableCell, TableBody, Typography } from '@material-ui/core';
import { Error } from '@pec/aion-ui-components/components/Error';
import { Grid, Box } from '@material-ui/core';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { Link, useLocation } from 'react-router-dom';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { useSharedStyles } from 'features/serviceRegions/ServiceRegionAccordion';
import { useAppDispatch, useTypedSelector } from 'app/reducer';
import { fetchExistingScoreItems } from 'features/scoreSets/slice';

type Props = {
  scoreSetId: string;
};

export const ScoreItemTable: React.FC<Props> = ({ scoreSetId }) => {
  const classes = useSharedStyles();
  const dispatch = useAppDispatch();
  const { search } = useLocation();
  const { scoreItems, error } = useTypedSelector(state => state.scoreSet);
  const { expanded = '' } = parse(search);

  useEffect(() => {
    dispatch(fetchExistingScoreItems(scoreSetId));
  }, [dispatch, scoreSetId]);

  return (
    <>
      {scoreItems && !error ? (
        scoreItems.length > 0 ? (
          <Table className={classes.noCellBorders}>
            <TableHead>
              <TableRow>
                <TableCell style={{ width: '25%' }}>Scoring Item Title</TableCell>
                <TableCell align="center">Total Points Available</TableCell>
                <TableCell align="center">Active</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scoreItems.map(({ id, name, totalPointsAvailable, isActive }) => (
                <TableRow hover key={id}>
                  <TableCell style={{ width: '25%' }}>{name}</TableCell>
                  <TableCell align="center">{totalPointsAvailable}</TableCell>
                  <TableCell align="center">{isActive ? 'Yes' : 'No'}</TableCell>
                  <TableCell align="center" padding="none">
                    <Button
                      variant="text"
                      color="primary"
                      startIcon={<EditIcon fontSize="small" color="primary" />}
                      component={Link}
                      to={`score-item/${id}/edit?expanded=${expanded}`}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <GridContainer justify="center" alignItems="center">
            <Grid item>
              <Box m={2}>
                <Typography variant="h5" align="center">
                  No Score Items
                </Typography>
              </Box>
            </Grid>
          </GridContainer>
        )
      ) : error ? (
        <Error message="There was an error processing your request." />
      ) : (
        <Loading />
      )}
    </>
  );
};
