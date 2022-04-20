import React from 'react';
import { Grid, Box } from '@material-ui/core';
import Typography from '@material-ui/core/Typography/Typography';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { getClientOverrideStatusDisplayValue } from 'helpers/getStatusDisplayValues';
import { useTranslation } from 'react-i18next';
import { RequirementOverrideForm } from '../components/RequirementOverrideForm';
import { IContractorRequirement } from 'interfaces/requirement';
import { DeepReadonly } from 'utility-types/dist/mapped-types';
import { IClientRequirementOverride } from 'interfaces/requirementOverride';

type Props = {
  requirement: DeepReadonly<IContractorRequirement> | null;
  requirementClientOverride: DeepReadonly<IClientRequirementOverride> | null;
  isClient: boolean;
  previousPath: string;
};

export const GrantRequirementOverrideFormContainer: React.FC<Props> = ({
  requirement,
  previousPath,
  isClient,
  requirementClientOverride
}) => {
  const { t } = useTranslation();

  return (
    <GridContainer>
      <Grid item xs={12} sm={6}>
        <Grid item>
          <Typography variant="h6">{t('safetyPrograms.requirementOverrides.exceptions', 'Exceptions')}</Typography>
          {isClient && (
            <Typography variant="subtitle1">
              {t('safetyPrograms.requirementOverrides.status', 'Status: ')}
              {requirementClientOverride
                ? getClientOverrideStatusDisplayValue(requirementClientOverride.status, t)
                : t('safetyPrograms.common.none', 'None')}
            </Typography>
          )}
        </Grid>
        {isClient && requirement && (
          <Box p={1}>
            <RequirementOverrideForm
              clientRequirementOverride={requirementClientOverride}
              requirement={requirement}
              cancelTo={previousPath}
            />
          </Box>
        )}
      </Grid>
    </GridContainer>
  );
};
