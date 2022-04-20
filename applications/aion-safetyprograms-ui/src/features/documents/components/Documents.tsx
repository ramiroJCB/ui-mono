import * as React from 'react';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { DocumentsTableContainer } from '../containers/DocumentsTable';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { Paper } from 'components/Paper';

type Props = {
  isContractor: boolean;
  organizationId?: string;
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | null;
};

export const DocumentsComponent: React.FC<Props> = ({ isContractor, organizationId, isFetching, error }) => (
  <Paper hasError={!!error} isLoading={isFetching}>
    <GridContainer justify="flex-end" spacing={0}>
      <DocumentsTableContainer
        isContractor={isContractor}
        organizationId={organizationId}
        basepath={
          organizationId
            ? `/organizations/${organizationId}/safety-program-requirements/documents`
            : '/safety-program-requirements/documents'
        }
      />
    </GridContainer>
  </Paper>
);
