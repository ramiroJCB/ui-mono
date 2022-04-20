import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { fetchContractorImports } from 'features/contractor/contractorImports/slice';
import { fetchContractorViolationsCount } from './contractorViolationsCount/slice';
import { fetchContractorViolations } from './contractorViolations/slice';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { OshaResources } from './oshaResources/OshaResources';
import { useAppDispatch } from 'app/reducer';
import { ViolationTotals } from './violationTotals/ViolationTotals';
import { useParams } from 'react-router-dom';
import { ContractorTable } from './contractorTable/ContractorTable';
import { useHistory } from 'react-router';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { useTranslation } from 'react-i18next';

export const ContractorDetails: React.FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const { organizationId } = useParams<{ organizationId: string }>();
  const {
    location: { search }
  } = useHistory();

  const { pageSize, page, order = 'desc', orderBy = 'closedDate' } = parse(search) as {
    page: string;
    pageSize: string;
    order: string;
    orderBy: string;
  };

  React.useEffect(() => {
    dispatch(fetchContractorViolationsCount(organizationId));
    dispatch(fetchContractorViolations({ organizationId, pageSize, page, order, orderBy }));
    dispatch(fetchContractorImports({ orderBy: 'runDateTimeUtc', order: 'desc' }));
  }, [dispatch, order, orderBy, organizationId, page, pageSize]);

  return (
    <GridContainer spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h5">{t('oshaViolations.oshaViolations', 'OSHA Violations')}</Typography>
      </Grid>
      <Grid item container spacing={2}>
        <Grid item xs={12} md={7}>
          <ViolationTotals />
        </Grid>
        <Grid item xs={12} md={5}>
          <OshaResources />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <ContractorTable />
      </Grid>
    </GridContainer>
  );
};
