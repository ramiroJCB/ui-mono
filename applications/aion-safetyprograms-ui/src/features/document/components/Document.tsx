import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { AxiosError } from 'axios';
import { Breadcrumbs } from 'components/Breadcrumbs';
import { DeepReadonly } from 'utility-types';
import { DocumentViewer } from './Viewer';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IDocument } from 'interfaces/document';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { useTranslation } from 'react-i18next';

type Props = {
  document: DeepReadonly<IDocument> | null;
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | null;
  accessToken?: string;
  organizationId?: string;
  documentMetadataId: string;
};

export const DocumentComponent: React.FC<Props> = ({
  document,
  isFetching,
  error,
  accessToken,
  organizationId,
  documentMetadataId
}) => {
  const { t } = useTranslation();

  return (
    <GridContainer>
      <Grid item xs={12}>
        <Breadcrumbs
          links={[
            {
              to: organizationId
                ? `/organizations/${organizationId}/safety-program-requirements/documents`
                : '/safety-program-requirements/documents',
              children: t('safetyPrograms.common.allDocuments', 'All Documents')
            },
            {
              to: organizationId
                ? `/organizations/${organizationId}/safety-program-requirements/documents/${documentMetadataId}`
                : `/safety-program-requirements/documents/${documentMetadataId}`,
              children:
                !isFetching && document ? (
                  organizationId === document.organizationId ? (
                    document.fileName
                  ) : (
                    <React.Fragment>
                      {document.organizationName}
                      {document.organizationCompanyNumber ? ` (${document.organizationCompanyNumber})` : ''}:{' '}
                      {document.fileName}
                    </React.Fragment>
                  )
                ) : (
                  '⋯'
                )
            }
          ]}
        />
      </Grid>
      <Grid item xs={12}>
        <Paper isLoading={isFetching} hasError={!!error}>
          {document && document.id === documentMetadataId && accessToken && (
            <DocumentViewer
              fileName={document.fileName}
              file={{
                url: `/files/v1/safetyProgramDocuments(${document.id})?useConvertedPdfs=true`,
                httpHeaders: {
                  Authorization: `Bearer ${accessToken}`,
                  'X-Aion-OrganizationId': organizationId
                }
              }}
            />
          )}
        </Paper>
      </Grid>
    </GridContainer>
  );
};
