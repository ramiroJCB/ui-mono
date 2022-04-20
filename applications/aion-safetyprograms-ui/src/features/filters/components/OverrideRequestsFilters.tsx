import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IContractor } from 'interfaces/contractor';
import { ISafetyProgram } from 'interfaces/safetyProgram';
import { FiltersAutocomplete } from './Autocomplete';
import { useTranslation } from 'react-i18next';

const styles = (theme: Theme) => ({
  divided: {
    borderTop: `1px solid ${theme.palette.divider}`
  }
});

type OwnProps = {
  organizationId?: string;
  open: boolean;
  filters: DeepReadonly<{
    contractors: IContractor[];
    safetyPrograms: ISafetyProgram[];
  }>;
  contractors: DeepReadonly<{
    isFetching: boolean;
    contractors: IContractor[] | null;
    total: number | null;
    error: AxiosError | null;
  }>;
  safetyPrograms: DeepReadonly<{
    isFetching: boolean;
    safetyPrograms: ISafetyProgram[] | null;
    total: number | null;
    error: AxiosError | null;
  }>;
  handleSelect: (param: keyof Props['filters']) => (ids: string) => void;
  handleSearch: (param: keyof Props['filters']) => (searchTerm: string) => void;
};

type Props = WithStyles<typeof styles> & OwnProps;

const Component: React.FC<Props> = ({ open, filters, contractors, safetyPrograms, handleSelect, handleSearch }) => {
  const { t } = useTranslation();

  return (
    <GridContainer>
      <Grid item xs={12}>
        <FiltersAutocomplete
          open={open}
          options={safetyPrograms.safetyPrograms?.map(({ id, title }) => ({ value: id, label: title }))}
          defaultValue={filters.safetyPrograms.map(({ id, title }) => ({ value: id, label: title }))}
          label={t('safetyPrograms.common.programReviews', 'Program Reviews')}
          loading={safetyPrograms.isFetching}
          hasError={Boolean(safetyPrograms.error)}
          total={safetyPrograms.total || 0}
          handleSelect={handleSelect('safetyPrograms')}
          handleSearch={handleSearch('safetyPrograms')}
        />
      </Grid>
      <Grid item xs={12}>
        <FiltersAutocomplete
          open={open}
          options={contractors.contractors?.map(({ id, name, companyNumber }) => ({
            value: id,
            label: name + (companyNumber ? ` (${companyNumber})` : '')
          }))}
          defaultValue={filters.contractors.map(({ id, name }) => ({ value: id, label: name }))}
          label={t('safetyPrograms.filters.contractorsOrCompanyID', 'Contractors or Company ID')}
          loading={contractors.isFetching}
          hasError={Boolean(contractors.error)}
          total={contractors.total || 0}
          handleSelect={handleSelect('contractors')}
          handleSearch={handleSearch('contractors')}
        />
      </Grid>
    </GridContainer>
  );
};

export const OverrideRequestsFiltersComponent = withStyles(styles)(Component);
