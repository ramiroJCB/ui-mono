import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import DownloadIcon from '@material-ui/icons/GetApp';
import Grid from '@material-ui/core/Grid';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'ts-essentials';
import { EnvelopeItem } from './EnvelopeItem';
import { EnvelopeStatus, IEnvelope } from '@pec/aion-ui-core/interfaces/envelope';
import { EnvelopeStatusIcon } from 'components/EnvelopeStatusIcon';
import { getImpliedEnvelopeStatus } from 'helpers/status';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { ICompletedEnvelopeDocument, IEnvelopeDocument } from '@pec/aion-ui-core/interfaces/envelopeDocument';
import { LoadingButton } from '@pec/aion-ui-components/components/LoadingButton';
import { useTranslation } from 'react-i18next';
import { localizeDate } from '@pec/aion-ui-i18next/helpers/localize';
import { localizeEnvelopeStatusDescription } from '../../../../helpers/envelope';

const { AssigneeAssigned, Completed, OwnerAssigned, Pending } = EnvelopeStatus;

const styles = (theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(3)
    },
    signNotificationText: {
      display: 'inline-block',
      marginLeft: theme.spacing(2)
    }
  });

type OwnProps = {
  downloadDocument: (document: IEnvelopeDocument) => Promise<void>;
  downloadingDocumentIds: DeepReadonly<string[]>;
  downloadMenuAnchorEl: HTMLElement | ((element: HTMLElement) => HTMLElement) | null | undefined;
  envelope: DeepReadonly<IEnvelope>;
  isClientOrg: boolean;
  signDocument: () => void;
  closeDownloadMenu: () => void;
  openDownloadMenu: (event: React.MouseEvent) => void;
  processingSignature: boolean;
};

type Props = OwnProps & WithStyles<typeof styles>;

const Envelope: React.FC<Props> = ({
  classes,
  downloadDocument,
  downloadingDocumentIds,
  downloadMenuAnchorEl,
  envelope: { assigneeTypeName, completedDocuments, createdBy, documents, ownerTypeName, status, updatedDateUtc },
  isClientOrg,
  signDocument,
  closeDownloadMenu,
  openDownloadMenu,
  processingSignature
}: Props) => {
  const { t } = useTranslation();

  const documentName = documents[0] ? documents[0].fileName : t('eSignature.common.na', 'N/A');

  const handleDocumentDownload = (document: IEnvelopeDocument) => (
    _event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    downloadDocument(document);
  };

  const handleDownloadClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (completedDocuments.length > 1) {
      openDownloadMenu(event);
    } else if (completedDocuments.length === 1) {
      downloadDocument(completedDocuments[0]);
    }
  };

  const impliedEnvelopeStatus = getImpliedEnvelopeStatus(isClientOrg, status) as EnvelopeStatus;

  const waitingOnOthers =
    (isClientOrg && (status === Pending || status === AssigneeAssigned)) || (!isClientOrg && status === OwnerAssigned);

  const renderSignButton = () => {
    return (
      <LoadingButton
        isSubmitting={downloadingDocumentIds.length > 0}
        disabled={downloadingDocumentIds.length > 0 || waitingOnOthers || processingSignature}
        color="secondary"
        variant="contained"
        onClick={status === Completed ? handleDownloadClick : signDocument}
        fullWidth
      >
        {status === Completed ? (
          downloadingDocumentIds.length > 0 ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            t('eSignature.envelope.view.download', 'Download')
          )
        ) : (
          t('eSignature.envelope.view.viewAndSign', 'View and Sign')
        )}
      </LoadingButton>
    );
  };

  return (
    <Paper>
      <GridContainer className={classes.container}>
        <Grid item xs={6} md={4} lg={3}>
          <GridContainer>
            <Grid item xs={12}>
              <EnvelopeItem
                label={t('eSignature.common.documentName', 'Document Name')}
                value={<Typography>{documentName}</Typography>}
              />
            </Grid>
            {isClientOrg ? (
              <Grid item xs={12}>
                <EnvelopeItem
                  label={t('eSignature.common.contractorName', 'Contractor Name')}
                  value={<Typography>{assigneeTypeName}</Typography>}
                />
              </Grid>
            ) : (
              <Grid item xs={12}>
                <EnvelopeItem
                  label={t('eSignature.common.clientOrgName', 'Client Org Name')}
                  value={<Typography>{ownerTypeName}</Typography>}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <EnvelopeItem
                label={t('eSignature.common.documentStatus', 'Document Status')}
                value={
                  <GridContainer spacing={0} alignItems="center">
                    <Grid item xs={2}>
                      <EnvelopeStatusIcon status={impliedEnvelopeStatus} />
                    </Grid>
                    <Grid item>
                      <Typography>{localizeEnvelopeStatusDescription(impliedEnvelopeStatus, t)}</Typography>
                    </Grid>
                  </GridContainer>
                }
              />
            </Grid>
          </GridContainer>
        </Grid>
        <Grid item xs={6} md={3}>
          <GridContainer>
            <Grid item xs={12}>
              <EnvelopeItem
                label={t('eSignature.common.dateLastUpdated', 'Date Last Updated')}
                value={<Typography>{localizeDate(updatedDateUtc, t)}</Typography>}
              />
            </Grid>
            <Grid item xs={12}>
              <EnvelopeItem
                label={t('eSignature.common.sender', 'Sender')}
                value={<Typography>{createdBy}</Typography>}
              />
            </Grid>
          </GridContainer>
        </Grid>
        <Grid item xs={12}>
          <GridContainer alignItems="center">
            <Grid item xs={6} sm={4} md={2}>
              {renderSignButton()}
            </Grid>
            {processingSignature && (
              <Grid>
                <CircularProgress size={16} />
                <Typography variant="body2" className={classes.signNotificationText}>
                  {t('eSignature.envelope.view.processingSignature', 'Processing signature')}
                </Typography>
              </Grid>
            )}

            {waitingOnOthers && (
              <Grid>
                <Typography variant="body2" className={classes.signNotificationText} color="error">
                  {t('eSignature.envelope.view.waitingForOtherSignatures', 'Waiting for other signatures')}
                </Typography>
              </Grid>
            )}
          </GridContainer>
        </Grid>
        <Menu
          id="download-menu"
          anchorEl={downloadMenuAnchorEl}
          open={Boolean(downloadMenuAnchorEl)}
          onClose={closeDownloadMenu}
        >
          {[...completedDocuments]
            .sort((a: ICompletedEnvelopeDocument, b: ICompletedEnvelopeDocument) =>
              a.documentOrder.localeCompare(b.documentOrder)
            )
            .map(document => (
              <MenuItem
                key={document.id}
                onClick={handleDocumentDownload(document)}
                disabled={downloadingDocumentIds.includes(document.id)}
              >
                <ListItemIcon>
                  {downloadingDocumentIds.includes(document.id) ? (
                    <CircularProgress color="secondary" size={20} />
                  ) : (
                    <DownloadIcon color="secondary" fontSize="small" />
                  )}
                </ListItemIcon>
                {document.fileName}
              </MenuItem>
            ))}
        </Menu>
      </GridContainer>
    </Paper>
  );
};

export const EnvelopeComponent = withStyles(styles)(Envelope);
