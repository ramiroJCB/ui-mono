import React from 'react';
import { Breadcrumbs } from '@pec/aion-ui-components/components/Breadcrumbs';
import { IBreadcrumbLink } from '@pec/aion-ui-core/interfaces/breadcrumbLink';
import { Grid } from '@material-ui/core';
import { useLocation, useParams } from 'react-router-dom';

export const CompareServiceRegionScoresBreadcrumbs: React.FC = () => {
  const { organizationId } = useParams<{
    organizationId: string;
  }>();

  const { search } = useLocation();

  const links: IBreadcrumbLink[] = [
    {
      to: { pathname: `/${organizationId}/scoring/comparison/service-regions`, search },
      label: 'Compare Service Regions Scoring'
    }
  ];

  return (
    <Grid item style={{ paddingLeft: 0 }}>
      <Breadcrumbs links={links.map((link, i) => ({ ...link, i }))} />
    </Grid>
  );
};
