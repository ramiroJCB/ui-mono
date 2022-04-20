import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import React, { useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import { fetchServiceRegions, serviceRegionsSelectors } from './slice';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { ScoringContainer } from 'common/ScoringContainer';
import { ServiceRegionAccordion } from './ServiceRegionAccordion';
import { merge, parse } from '@pec/aion-ui-core/helpers/querystring';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { useAppDispatch, useTypedSelector } from 'app/reducer';

type RouteParams = {
  organizationId: string;
};

export const ServiceRegions: React.FC = () => {
  const { organizationId } = useParams<RouteParams>();
  const dispatch = useAppDispatch();
  const { search } = useLocation();
  const history = useHistory();
  const { isFetching } = useTypedSelector(state => state.serviceRegions);
  const serviceRegions = useTypedSelector(serviceRegionsSelectors.selectAll);

  useEffect(() => {
    dispatch(fetchServiceRegions(organizationId));
  }, [dispatch, organizationId]);

  const { expanded = '' } = parse(search);

  const onExpand = (serviceRegionId: string) => {
    const expandedString = expanded.toString();
    const expandedRegions = expandedString === '' ? [] : expandedString.split(',');
    const newExpanded = expanded.includes(serviceRegionId)
      ? expandedRegions.filter(value => value !== serviceRegionId)
      : expandedRegions.concat(serviceRegionId);
    history.push({
      search: merge(search, {
        expanded: newExpanded.toString()
      })
    });
  };

  return (
    <ScoringContainer>
      <GridContainer>
        {serviceRegions.length > 0 && !isFetching ? (
          <Grid item xs={12}>
            {serviceRegions.map(serviceRegion => (
              <React.Fragment key={serviceRegion.id}>
                <ServiceRegionAccordion
                  serviceRegion={serviceRegion}
                  onExpand={onExpand}
                  isExpanded={expanded.includes(serviceRegion.id)}
                />
              </React.Fragment>
            ))}
          </Grid>
        ) : serviceRegions.length === 0 && !isFetching ? (
          <GridContainer justify="center" alignItems="center">
            <Grid item>
              <Box m={20}>
                <Typography variant="h5" align="center">
                  There are no service regions linked to this organization.
                </Typography>
                <br />
                <GridContainer justify="center" alignContent="center">
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth={false}
                    href={`/SSQV4/Admin/CompanyAdmin.aspx?organizationid=${organizationId}`}
                  >
                    Add Service Region
                  </Button>
                </GridContainer>
              </Box>
            </Grid>
          </GridContainer>
        ) : (
          <Loading />
        )}
      </GridContainer>
    </ScoringContainer>
  );
};
