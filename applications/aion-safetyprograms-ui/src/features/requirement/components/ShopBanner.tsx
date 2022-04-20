import * as React from 'react';
import Button from '@material-ui/core/Button/Button';
import Grid from '@material-ui/core/Grid/Grid';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import Typography from '@material-ui/core/Typography/Typography';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { useTranslation } from 'react-i18next';

type Props = {
  shopLink: string;
};

export const ShopBanner: React.FC<Props> = ({ shopLink }) => {
  const { t } = useTranslation();

  return (
    <Paper style={{ backgroundColor: '#00953B1F' }} color="#00953B1F">
      <GridContainer>
        <Grid item style={{ flex: 1 }}>
          <Typography style={{ fontWeight: 500 }} color="textPrimary">
            {t(
              'safetyPrograms.requirement.closeSafetyProgramGap',
              'Close your safety program gap with world-class programs through our trusted partner.'
            )}
          </Typography>
          <Typography variant="caption">
            {t(
              'safetyPrograms.requirement.useVeriforceId',
              'Use your Veriforce Member ID at checkout to receive an exclusive discount.'
            )}
          </Typography>
        </Grid>
        <Grid item style={{ padding: 0 }}>
          <GridContainer alignItems="center">
            <Grid item>
              <Tooltip
                title={t(
                  'safetyPrograms.requirement.resolveThroughRecommendedPartner',
                  'Resolve here through our recommended partner.'
                ).toString()}
              >
                <Button
                  startIcon={<OpenInNewIcon />}
                  rel="noopener noreferrer"
                  target="_blank"
                  variant="outlined"
                  color="secondary"
                  href={shopLink}
                >
                  {t('safetyPrograms.requirement.buyProgram', 'Buy Program')}
                </Button>
              </Tooltip>
            </Grid>
          </GridContainer>
        </Grid>
      </GridContainer>
    </Paper>
  );
};
