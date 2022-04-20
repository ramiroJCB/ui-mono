import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, { useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchScoreSetsForServiceRegion } from './slice';
import { Grid, Box } from '@material-ui/core';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IServiceRegion } from 'interfaces/serviceRegion';
import { Link, useLocation } from 'react-router-dom';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { useAppDispatch } from 'app/reducer';
import { setExistingScoreSets } from 'features/scoreSets/slice';
import { parse } from '@pec/aion-ui-core/helpers/querystring';

type Props = {
  serviceRegion: IServiceRegion;
  isExpanded: boolean;
  onExpand: (serviceRegionId: string) => void;
};

export const useSharedStyles = makeStyles(() =>
  createStyles({
    noCellBorders: {
      '& .MuiTableCell-root': {
        borderBottom: 'none !important'
      }
    }
  })
);

export const ServiceRegionAccordion: React.FC<Props> = props => {
  const classes = useSharedStyles();
  const dispatch = useAppDispatch();
  const { search } = useLocation();

  const {
    serviceRegion: {
      id: serviceRegionId,
      serviceRegionName,
      clientId,
      scoreSetsState: { scoreSets, isFetching, error }
    },
    isExpanded,
    onExpand
  } = props;

  const setScoreSets = () => {
    dispatch(setExistingScoreSets(scoreSets));
  };

  const { expanded = '' } = parse(search);

  useEffect(() => {
    isExpanded &&
      scoreSets === null &&
      !isFetching &&
      !error &&
      dispatch(fetchScoreSetsForServiceRegion({ serviceRegionId, clientId }));
  }, [dispatch, isExpanded, serviceRegionId, clientId, isFetching, scoreSets, error]);

  return (
    <Accordion expanded={isExpanded} onChange={() => onExpand(serviceRegionId)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle2">Service Region: {serviceRegionName}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {scoreSets && !error ? (
          scoreSets.length > 0 ? (
            <Table className={classes.noCellBorders}>
              <caption>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth={false}
                  component={Link}
                  onClick={setScoreSets}
                  to={`service-regions/${serviceRegionId}/score-set/add?expanded=${expanded}`}
                >
                  Add Scoring Set
                </Button>
              </caption>
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: '25%' }}>Scoring Set</TableCell>
                  <TableCell align="center">Total Points Available</TableCell>
                  <TableCell align="center">Active</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {scoreSets.map(({ name, totalPointsAvailable, id: scoreSetId, isActive }) => (
                  <TableRow hover key={scoreSetId}>
                    <TableCell style={{ width: '25%' }}>{name}</TableCell>
                    <TableCell align="center">{totalPointsAvailable}</TableCell>
                    <TableCell align="center">{isActive ? 'Yes' : 'No'}</TableCell>
                    <TableCell align="center" padding="none">
                      <Button
                        variant="text"
                        color="primary"
                        startIcon={<EditIcon fontSize="small" color="primary" />}
                        component={Link}
                        onClick={setScoreSets}
                        to={`service-regions/${serviceRegionId}/score-set/${scoreSetId}/edit?expanded=${expanded}`}
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
                    No Scoring Sets
                  </Typography>
                  <br />
                  <GridContainer justify="center" alignContent="center">
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth={false}
                      component={Link}
                      onClick={setScoreSets}
                      to={`service-regions/${serviceRegionId}/score-set/add?expanded=${expanded}`}
                    >
                      Add Scoring Set
                    </Button>
                  </GridContainer>
                </Box>
              </Grid>
            </GridContainer>
          )
        ) : error ? (
          <Error message={error.message} />
        ) : (
          <Loading />
        )}
      </AccordionDetails>
    </Accordion>
  );
};
