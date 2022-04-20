import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import { AxiosError } from 'axios';
import { ContractorWorkGroupJobTypeHeaderContainer } from '../containers/ContractorWorkGroupJobTypeHeader';
import { DeepReadonly } from 'ts-essentials';
import { Error } from '@pec/aion-ui-components/components/Error';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IContractorJobTypeTrainingRequirement } from 'interfaces/contractorJobTypeTrainingRequirement';
import { InfiniteCardGrid } from 'components/InfiniteCardGrid';
import { InfoCard } from 'components/InfoCard';
import { IWorkGroupJobType } from '@pec/aion-ui-core/interfaces/workGroupJobType';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { Message } from 'components/Message';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Search } from 'components/Search';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

type RouteParams = {
  organizationId: string;
  clientId: string;
  workGroupContractorId: string;
  workGroupJobTypeId: string;
};

type OwnProps = {
  isFetchingInitialJobTypeTrainingRequirements: boolean;
  error: DeepReadonly<AxiosError> | null;
  workGroupJobType: DeepReadonly<IWorkGroupJobType> | null;
  contractorJobTypeTrainingRequirements: DeepReadonly<IContractorJobTypeTrainingRequirement[]>;
  totalCount: number;
  searchValue: string | string[];
  handleSearch: (searchText: string) => void;
  fetchContractorJobTypeTrainingRequirements: (
    jobTypeId: string
  ) => (top: number, skip: number) => Promise<IContractorJobTypeTrainingRequirement[]>;
};

type Props = RouteComponentProps<RouteParams> & OwnProps;

const WorkGroupJobTypeTraining: React.FC<Props> = ({
  isFetchingInitialJobTypeTrainingRequirements,
  error,
  workGroupJobType,
  contractorJobTypeTrainingRequirements,
  totalCount,
  searchValue,
  handleSearch,
  fetchContractorJobTypeTrainingRequirements,
  match: {
    params: { organizationId, clientId, workGroupContractorId, workGroupJobTypeId }
  }
}) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <ContractorWorkGroupJobTypeHeaderContainer />
      {(searchValue || totalCount > 0) && (
        <GridContainer justify="flex-end">
          <Grid item xs={12} md={3}>
            <Search handleSearch={handleSearch} searchValue={searchValue} />
          </Grid>
        </GridContainer>
      )}
      {totalCount > 0 && workGroupJobType && !error ? (
        <InfiniteCardGrid
          items={contractorJobTypeTrainingRequirements}
          totalCount={totalCount}
          fetchItems={fetchContractorJobTypeTrainingRequirements(workGroupJobType.jobTypeId)}
          subtitle
        >
          {({ item: { id: jobTypeTrainingRequirementId, trainingRequirementName, trainingRequirement } }) => (
            <InfoCard
              key={jobTypeTrainingRequirementId}
              cardType={
                trainingRequirement && trainingRequirement.organizationId
                  ? t('trainingCompliance.common.customTraining', 'Custom Training')
                  : t('trainingCompliance.common.standardTraining', 'Standard Training')
              }
              variant={
                trainingRequirement && trainingRequirement.organizationId ? 'customTraining' : 'standardTraining'
              }
              name={trainingRequirementName}
              to={`/${organizationId}/training-compliance/clients/${clientId}/work-groups/${workGroupContractorId}/job-types/${workGroupJobTypeId}/training/${jobTypeTrainingRequirementId}`}
              subtitle={
                trainingRequirement && trainingRequirement.organizationId ? (
                  <Typography variant="body2" color="secondary">
                    <span style={{ fontWeight: 500 }}>
                      {t('trainingCompliance.common.selfValidated', 'Self Validated')}
                    </span>
                  </Typography>
                ) : (
                  <React.Fragment>
                    <VerifiedUserIcon fontSize="inherit" color="secondary" />
                    <Typography variant="body2" color="secondary">
                      <span style={{ fontWeight: 500 }}>
                        {t('trainingCompliance.common.PECValidated', 'PEC Validated')}
                      </span>
                    </Typography>
                  </React.Fragment>
                )
              }
            />
          )}
        </InfiniteCardGrid>
      ) : error ? (
        <Error
          message={t('trainingCompliance.common.processingRequestError', 'There was an error processing your request.')}
        />
      ) : !isFetchingInitialJobTypeTrainingRequirements && searchValue && totalCount === 0 ? (
        <Message message={t('trainingCompliance.common.noSearchResultsFound', 'No search results found')} />
      ) : isFetchingInitialJobTypeTrainingRequirements ? (
        <Loading />
      ) : (
        <Message
          message={t(
            'trainingCompliance.common.noTrainingRequirementsAssigned',
            'No training requirements have been assigned'
          )}
        />
      )}
    </React.Fragment>
  );
};

export const WorkGroupJobTypeTrainingComponent = withRouter(WorkGroupJobTypeTraining);
