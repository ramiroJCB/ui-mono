import * as React from 'react';
import DeleteIcon from '@material-ui/icons/Add';
import { Button, createStyles, Grid, Paper, Theme, WithStyles, withStyles } from '@material-ui/core';
import { DeepReadonly } from 'ts-essentials';
import { EnvelopesTable } from '../containers/EnvelopesTable';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IEnvelope } from '@pec/aion-ui-core/interfaces/envelope';
import { Link } from 'react-router-dom';
import { PageHeaderComponent } from 'components/PageHeader';
import { useTranslation } from 'react-i18next';

const styles = (theme: Theme) =>
  createStyles({
    buttonContainer: {
      marginTop: theme.spacing(3)
    }
  });

type OwnProps = {
  envelopes: DeepReadonly<IEnvelope[]>;
  isClientOrg: boolean;
  isFetchingData: boolean;
  totalOptionsCount: number;
  onEnvelopeSelect: (envelopeId: string) => void;
  organizationId: string;
};

type Props = OwnProps & WithStyles<typeof styles>;

const Envelopes: React.FC<Props> = ({
  envelopes,
  isClientOrg,
  isFetchingData,
  onEnvelopeSelect,
  organizationId,
  totalOptionsCount
}: Props) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <PageHeaderComponent
        title={t('eSignature.common.eSignatures', 'eSignatures')}
        button={
          isClientOrg ? (
            <Button
              variant="contained"
              color="secondary"
              component={Link}
              to={`/${organizationId}/esignatures/documents/add`}
            >
              <DeleteIcon />
              {t('eSignature.envelopes.newSignature', 'New Signature')}
            </Button>
          ) : (
            undefined
          )
        }
      />
      <Paper>
        <GridContainer alignItems="center" justify="flex-end" spacing={0}>
          <Grid item xs={12}>
            <EnvelopesTable
              envelopes={envelopes}
              isFetching={isFetchingData}
              totalEnvelopesCount={totalOptionsCount}
              handleEnvelopeSelect={onEnvelopeSelect}
              isClientOrg={isClientOrg}
            />
          </Grid>
        </GridContainer>
      </Paper>
    </React.Fragment>
  );
};

export const EnvelopesComponent = withStyles(styles)(Envelopes);
