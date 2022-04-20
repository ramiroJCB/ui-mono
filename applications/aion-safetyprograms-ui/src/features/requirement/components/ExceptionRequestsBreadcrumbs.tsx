import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { Breadcrumbs } from 'components/Breadcrumbs';
import { Props as NavLinkProps } from 'components/NavLink';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { useTranslation } from 'react-i18next';

type Props = {
  organizationId: string;
  safetyProgramRequirementId: string;
  isFetching: boolean;
  overrideRequest: any;
  links?: NavLinkProps[];
};

export const ExceptionRequestsBreadcrumbs: React.FC<Props> = ({
  organizationId,
  safetyProgramRequirementId,
  isFetching,
  overrideRequest,
  links = []
}) => {
  const { t } = useTranslation();

  return (
    <Grid item>
      <GridContainer justify="space-between">
        <Breadcrumbs
          links={[
            {
              to: `/organizations/${organizationId}/safety-program-requirements/requests`,
              children: t('safetyPrograms.requirement.exceptionRequests', 'Exception Requests')
            },
            {
              to: `/organizations/${organizationId}/safety-program-requirements/${safetyProgramRequirementId}`,
              children: !isFetching && overrideRequest ? <>{overrideRequest.safetyProgramName}</> : '⋯'
            },
            ...links
          ]}
        />
      </GridContainer>
    </Grid>
  );
};
