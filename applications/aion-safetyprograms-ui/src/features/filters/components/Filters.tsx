import * as React from 'react';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import amber from '@material-ui/core/colors/amber';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import Grid from '@material-ui/core/Grid';
import GridOffIcon from '@material-ui/icons/GridOff';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { FiltersAutocomplete } from './Autocomplete';
import { FiltersChecklist } from '@pec/aion-ui-components/components/Checklist';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IClient } from 'interfaces/client';
import { IContractor } from 'interfaces/contractor';
import { ISafetyProgram } from 'interfaces/safetyProgram';
import { LabeledIcon } from 'components/LabeledIcon';
import { RequirementStatusComponent } from 'features/requirement/components/Status';
import { SafetyProgramRequirementStatus } from '@pec/aion-ui-core/interfaces/safetyProgramRequirementStatus';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { OrganizationFeature } from '@pec/aion-ui-core/interfaces/organization';
import { RootState } from 'combineReducers';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ClientOverrideStatus } from 'interfaces/requirementOverride';
import { getClientOverrideStatusDisplayValue } from 'helpers/getStatusDisplayValues';
import { useLocation } from 'react-router-dom';

const {
  Accepted,
  AcceptedNotApplicable,
  Completable,
  Incomplete,
  Rejected,
  RejectedNotApplicable,
  SubmittedComplete,
  SubmittedNotApplicable
} = SafetyProgramRequirementStatus;

const styles = (theme: Theme) => ({
  divided: {
    borderTop: `1px solid ${theme.palette.divider}`
  }
});

type OwnProps = {
  organizationId?: string;
  open: boolean;
  statuses: string;
  hasUnreadContractorComments: string;
  isOverridden: string;
  hasGracePeriod: string;
  filters: DeepReadonly<{
    clients: IClient[];
    contractors: IContractor[];
    safetyPrograms: ISafetyProgram[];
    overrideStatuses: {
      value: ClientOverrideStatus;
      label: string;
    }[];
  }>;
  clients: DeepReadonly<{
    isFetching: boolean;
    clients: IClient[] | null;
    total: number | null;
    error: AxiosError | null;
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
  handleSelect: (
    param:
      | keyof Props['filters']
      | 'statuses'
      | 'hasUnreadContractorComments'
      | 'isOverridden'
      | 'hasGracePeriod'
      | 'overrideStatuses'
  ) => (ids: string) => void;
  handleSearch: (param: keyof Props['filters']) => (searchTerm: string) => void;
};

type Props = WithStyles<typeof styles> & OwnProps;

const Component: React.FC<Props> = ({
  organizationId,
  open,
  statuses,
  hasUnreadContractorComments,
  isOverridden,
  hasGracePeriod,
  filters,
  clients,
  contractors,
  safetyPrograms,
  handleSelect,
  handleSearch,
  classes
}) => {
  const { organization } = useSelector((state: RootState) => state.organization);
  const { t } = useTranslation();
  const isClient = organization && organization.features.includes(OrganizationFeature.Client);
  const overrideStatuses = Object.keys(ClientOverrideStatus).map(key => ({
    value: ClientOverrideStatus[key] as ClientOverrideStatus,
    label: getClientOverrideStatusDisplayValue(ClientOverrideStatus[key], t)
  }));

  const path = useLocation().pathname;
  const includesOrganizations = path.includes('organizations');

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
      {!organizationId && (
        <Grid item xs={12}>
          <FiltersAutocomplete
            open={open}
            options={clients.clients?.map(({ id, name }) => ({ value: id, label: name }))}
            defaultValue={filters.clients.map(({ id, name }) => ({ value: id, label: name }))}
            label={t('safetyPrograms.common.clients', 'Clients')}
            loading={clients.isFetching}
            hasError={Boolean(clients.error)}
            total={clients.total || 0}
            handleSelect={handleSelect('clients')}
            handleSearch={handleSearch('clients')}
          />
        </Grid>
      )}
      <Grid item xs={12}>
        <FiltersAutocomplete
          open={open}
          options={contractors.contractors?.map(({ id, name, companyNumber }) => ({
            value: id,
            label: name + (companyNumber ? ` (${companyNumber})` : '')
          }))}
          defaultValue={filters.contractors.map(({ id, name }) => ({ value: id, label: name }))}
          label={t('safetyPrograms.filters.contractors', 'Contractors')}
          loading={contractors.isFetching}
          hasError={Boolean(contractors.error)}
          total={contractors.total || 0}
          handleSelect={handleSelect('contractors')}
          handleSearch={handleSearch('contractors')}
        />
      </Grid>
      {isClient && includesOrganizations && (
        <Grid item xs={12}>
          <FiltersAutocomplete
            open={open}
            options={overrideStatuses}
            defaultValue={filters.overrideStatuses.map(x => ({
              value: x.value,
              label: getClientOverrideStatusDisplayValue(x.value, t)
            }))}
            label={t('safetyPrograms.filters.exceptionStatuses', 'Exception Statuses')}
            loading={false}
            hasError={false}
            total={overrideStatuses.length}
            handleSelect={handleSelect('overrideStatuses')}
            handleSearch={handleSearch('overrideStatuses')}
          />
        </Grid>
      )}
      <Grid item xs={12}>
        <FiltersChecklist
          values={statuses}
          handleSelect={handleSelect('statuses')}
          options={[
            Accepted,
            AcceptedNotApplicable,
            Completable,
            Incomplete,
            Rejected,
            RejectedNotApplicable,
            SubmittedComplete,
            SubmittedNotApplicable
          ].map(status => ({
            value: status,
            label: <RequirementStatusComponent status={status} />
          }))}
        />
      </Grid>
      <Grid item xs={12} className={classes.divided}>
        <FiltersChecklist
          values={isOverridden}
          handleSelect={handleSelect('isOverridden')}
          options={[
            {
              value: 'true',
              label: (
                <LabeledIcon
                  icon={<GridOffIcon color="action" />}
                  label={t('safetyPrograms.common.exceptionGranted', 'Exception Granted')}
                />
              )
            }
          ]}
        />
        {!organizationId && (
          <FiltersChecklist
            values={hasUnreadContractorComments}
            handleSelect={handleSelect('hasUnreadContractorComments')}
            options={[
              {
                value: 'true',
                label: (
                  <LabeledIcon
                    icon={<AnnouncementIcon style={{ color: amber[700] }} />}
                    label={t('safetyPrograms.filters.unreadComments', 'Unread Comments')}
                  />
                )
              }
            ]}
          />
        )}
        <FiltersChecklist
          values={hasGracePeriod}
          handleSelect={handleSelect('hasGracePeriod')}
          options={[
            {
              value: 'true',
              label: (
                <LabeledIcon
                  icon={<AccessTimeIcon color="action" />}
                  label={t('safetyPrograms.filters.hasGracePeriod', 'Has Grace Period')}
                />
              )
            }
          ]}
        />
      </Grid>
    </GridContainer>
  );
};

export const FiltersComponent = withStyles(styles)(Component);
