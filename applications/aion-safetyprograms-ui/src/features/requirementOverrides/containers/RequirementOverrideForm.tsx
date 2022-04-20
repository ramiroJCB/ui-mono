import React from 'react';
import { Grid, Box } from '@material-ui/core';
import Typography from '@material-ui/core/Typography/Typography';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { localizeDateTime } from '@pec/aion-ui-i18next/helpers/localize';
import { getClientOverrideStatusDisplayValue } from 'helpers/getStatusDisplayValues';
import { ClientOverrideStatus, IClientRequirementOverride } from 'interfaces/requirementOverride';
import { useTranslation } from 'react-i18next';
import { RequirementOverrideForm } from '../components/RequirementOverrideForm';
import { DeepReadonly } from 'utility-types/dist/mapped-types';
import { IContractorRequirement } from 'interfaces/requirement';

type Props = {
  requirement: DeepReadonly<IContractorRequirement>;
  requirementClientOverride: DeepReadonly<IClientRequirementOverride> | null;
  overrideRequest: any;
  previousPath: string;
};

export const RequirementOverrideFormContainer: React.FC<Props> = ({
  overrideRequest,
  previousPath,
  requirement,
  requirementClientOverride
}) => {
  const { t } = useTranslation();

  return (
    <>
      <GridContainer>
        <Grid item>
          <Typography variant="h6">{t('safetyPrograms.requirementOverrides.exceptions', 'Exceptions')}</Typography>
          <Typography variant="subtitle1">
            {t('safetyPrograms.requirementOverrides.status', 'Status: ')}
            {requirementClientOverride
              ? getClientOverrideStatusDisplayValue(requirementClientOverride.status, t)
              : t('safetyPrograms.common.none', 'None')}
          </Typography>
          {requirementClientOverride && requirementClientOverride.status === ClientOverrideStatus.Requested && (
            <Box mt={2} mb={2} borderLeft={3} borderColor="primary.main">
              <Box pl={2}>
                <Typography variant="subtitle2" color="textSecondary">
                  {overrideRequest.createdBy} · {localizeDateTime(overrideRequest.createdDateUtc, t)}
                </Typography>
                <Typography>{overrideRequest.comment}</Typography>
              </Box>
            </Box>
          )}
        </Grid>
      </GridContainer>
      <GridContainer>
        <Grid item>
          {requirementClientOverride && (
            <RequirementOverrideForm
              clientRequirementOverride={requirementClientOverride}
              requirement={requirement}
              cancelTo={previousPath}
            />
          )}
        </Grid>
      </GridContainer>
    </>
  );
};
