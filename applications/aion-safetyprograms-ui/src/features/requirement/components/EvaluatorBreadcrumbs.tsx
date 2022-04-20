import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { Breadcrumbs } from 'components/Breadcrumbs';
import { DeepReadonly } from 'utility-types';
import { IContractorRequirement } from 'interfaces/requirement';
import { Props as NavLinkProps } from 'components/NavLink';
import { RequirementStatusComponent } from './Status';
import { useTranslation } from 'react-i18next';

type Props = {
  organizationId?: string;
  safetyProgramRequirementId: string;
  isFetching: boolean;
  requirement: DeepReadonly<IContractorRequirement> | null;
  search: string;
  links?: NavLinkProps[];
};

export const EvaluatorRequirementBreadcrumbs: React.FC<Props> = ({
  organizationId,
  safetyProgramRequirementId,
  isFetching,
  requirement,
  search,
  links = []
}) => {
  const { t } = useTranslation();

  return (
    <Grid item xs={12}>
      <Breadcrumbs
        links={[
          organizationId
            ? {
                to: { pathname: `/organizations/${organizationId}/safety-program-requirements`, search },
                children: t('safetyPrograms.common.programReviews', 'Program Reviews')
              }
            : {
                to: { pathname: '/safety-program-requirements', search },
                children: t('safetyPrograms.common.programEvaluations', 'Program Evaluations')
              },
          {
            to: organizationId
              ? `/organizations/${organizationId}/safety-program-requirements/${safetyProgramRequirementId}`
              : `/safety-program-requirements/${safetyProgramRequirementId}`,
            children:
              !isFetching && requirement ? (
                <React.Fragment>
                  <RequirementStatusComponent status={requirement.status} iconOnly /> {requirement.contractorName}
                  {requirement.contractorCompanyNumber ? ` (${requirement.contractorCompanyNumber})` : ''}:{' '}
                  {requirement.safetyProgram.title}
                </React.Fragment>
              ) : (
                '⋯'
              )
          },
          ...links
        ]}
      />
    </Grid>
  );
};
