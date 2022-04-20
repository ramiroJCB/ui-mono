import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { Breadcrumbs } from 'components/Breadcrumbs';
import { DeepReadonly } from 'utility-types';
import { IContractorRequirement } from 'interfaces/requirement';
import { Props as NavLinkProps } from 'components/NavLink';
import { RequirementStatusComponent } from './Status';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { useTranslation } from 'react-i18next';

type Props = {
  organizationId: string;
  safetyProgramRequirementId: string;
  isFetching: boolean;
  requirement: DeepReadonly<IContractorRequirement> | null;
  links?: NavLinkProps[];
};

export const ContractorRequirementBreadcrumbs: React.FC<Props> = ({
  organizationId,
  safetyProgramRequirementId,
  isFetching,
  requirement,
  links = []
}) => {
  const { t } = useTranslation();

  return (
    <Grid item>
      <GridContainer justify="space-between">
        <Breadcrumbs
          links={[
            {
              to: `/organizations/${organizationId}/safety-program-requirements`,
              children: t('safetyPrograms.common.programReviews', 'Program Reviews')
            },
            {
              to: `/organizations/${organizationId}/safety-program-requirements/${safetyProgramRequirementId}`,
              children:
                !isFetching && requirement ? (
                  <React.Fragment>
                    <RequirementStatusComponent status={requirement.status} iconOnly />{' '}
                    {requirement.safetyProgram.title}
                  </React.Fragment>
                ) : (
                  '⋯'
                )
            },
            ...links
          ]}
        />
      </GridContainer>
    </Grid>
  );
};
