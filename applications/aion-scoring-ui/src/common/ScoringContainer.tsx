import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { Typography, Button } from '@material-ui/core';

type RouteParams = {
  organizationId: string;
  tab: string;
};

export const ScoringContainer: React.FC = ({ children }) => {
  const { organizationId, tab } = useParams<RouteParams>();
  const isComparingAionLegacyScores = useLocation()?.pathname.includes('comparison');

  return isComparingAionLegacyScores ? (
    <Grid item xs={12}>
      <Paper>
        <GridContainer>
          <Grid container item justify="space-between">
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Aion vs. Legacy Scoring</Typography>
            </Grid>
            <Grid item xs={12} sm={6} style={{ textAlign: 'right' }}>
              <Button color="primary" component={Link} to={`/${organizationId}/scoring/service-regions`}>
                Aion Scoring
              </Button>
            </Grid>
          </Grid>
        </GridContainer>
        <Tabs value={tab || 0} indicatorColor="primary">
          <Tab
            component={Link}
            label="Service Regions"
            to={`/${organizationId}/scoring/comparison/service-regions`}
            value="service-regions"
          />
          <Tab
            component={Link}
            label="Business Units"
            to={`/${organizationId}/scoring/comparison/business-units`}
            value="business-units"
          />
        </Tabs>
        {children}
      </Paper>
    </Grid>
  ) : (
    <Grid item xs={12}>
      <Paper>
        <GridContainer>
          <Grid container item justify="space-between">
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">SSQ Scoring System</Typography>
            </Grid>
            <Grid item xs={12} sm={6} style={{ textAlign: 'right' }}>
              <Button color="primary" component={Link} to={`/${organizationId}/scoring/comparison/service-regions`}>
                Compare Scoring
              </Button>
            </Grid>
          </Grid>
        </GridContainer>
        <Tabs value={tab || 0} indicatorColor="primary">
          <Tab
            component={Link}
            label="Service Regions"
            to={`/${organizationId}/scoring/service-regions`}
            value="service-regions"
          />
          <Tab
            component={Link}
            label="Business Units"
            to={`/${organizationId}/scoring/business-units`}
            value="business-units"
          />
          <Tab component={Link} label="Report" to={`/${organizationId}/scoring/reports`} value="reports" />
          <Tab component={Link} label="Admin" to={`/${organizationId}/scoring/admin`} value="admin" />
        </Tabs>
        {children}
      </Paper>
    </Grid>
  );
};
