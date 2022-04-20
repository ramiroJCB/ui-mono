import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { EnvelopesTableComponent } from '../components/EnvelopesTable';
import { EnvelopeStatus, IEnvelope } from '@pec/aion-ui-core/interfaces/envelope';
import { EnvelopeStatusIcon } from 'components/EnvelopeStatusIcon';
import { getImpliedEnvelopeStatus } from 'helpers/status';
import { IEnvelopesTableOption } from 'interfaces/envelopesTableOption';
import { ITableHeader } from '@pec/aion-ui-components/interfaces/tableHeader';
import { TableFilterType } from '@pec/aion-ui-components/interfaces/tableFilter';
import { withEnhancedRouter, WithEnhancedRouterProps } from '@pec/aion-ui-core/hocs/withEnhancedRouter';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';
import { localizeDate } from '@pec/aion-ui-i18next/helpers/localize';

const { AssigneeAssigned, Completed, OwnerAssigned } = EnvelopeStatus;
const { DateFilter, SelectFilter, TextFilter } = TableFilterType;

type OwnProps = {
  envelopes: IEnvelope[];
  isClientOrg: boolean;
  isFetching: boolean;
  totalEnvelopesCount: number;
  handleEnvelopeSelect: (envelopeId: string) => void;
};

type Props = OwnProps & WithEnhancedRouterProps & I18nextProps;

export const defaultPageSize: number = 10;
export const defaultPage: number = 1;
export const defaultOrder: 'asc' | 'desc' = 'desc';
export const defaultOrderBy: string = 'updatedDateUtc';

class EnvelopesTableContainer extends React.Component<Props> {
  selectEnvelope = ({ id: envelopeId }: IEnvelopesTableOption) => this.props.handleEnvelopeSelect(envelopeId);

  mapEnvelopes = (clientTasks: IEnvelope[]) =>
    clientTasks.map(({ assigneeTypeName, createdBy, documents, ownerTypeName, status, updatedDateUtc, id }) => {
      const { isClientOrg, t } = this.props;

      return {
        id,
        assigneeTypeName,
        status: (
          <EnvelopeStatusIcon
            status={getImpliedEnvelopeStatus(isClientOrg, status) as EnvelopeStatus}
            tooltipPlacement="right"
          ></EnvelopeStatusIcon>
        ),
        documentFileName: (
          <Typography variant="body2" noWrap>
            {documents[0] ? documents[0].fileName : t('eSignature.common.na', 'N/A')}
          </Typography>
        ),
        ownerTypeName,
        createdBy,
        updatedDateUtc: localizeDate(updatedDateUtc, t)
      };
    });

  getHeaders = (): ITableHeader[] => {
    const { isClientOrg, t } = this.props;

    const headers = [
      {
        id: 'status',
        label: t('eSignature.common.documentStatus', 'Document Status'),
        isSortable: true
      },
      {
        id: 'documentFileName',
        label: t('eSignature.common.documentName', 'Document Name')
      },
      {
        id: 'createdBy',
        label: t('eSignature.common.sender', 'Sender'),
        isSortable: true
      },
      {
        id: 'updatedDateUtc',
        label: t('eSignature.common.dateLastUpdated', 'Date Last Updated'),
        isSortable: true
      }
    ];

    isClientOrg
      ? headers.splice(1, 0, {
          id: 'assigneeTypeName',
          label: t('eSignature.common.contractorName', 'Contractor Name'),
          isSortable: true
        })
      : headers.splice(2, 0, {
          id: 'ownerTypeName',
          label: t('eSignature.common.clientOrgName', 'Client Org Name'),
          isSortable: true
        });

    return headers;
  };

  getFilterOptions = () => {
    const { isClientOrg, t } = this.props;

    return isClientOrg
      ? [
          {
            id: OwnerAssigned,
            label: t('eSignature.common.notSigned', 'Not Signed')
          },
          {
            id: AssigneeAssigned,
            label: t('eSignature.common.waitingForOthers', 'Waiting For Others')
          },
          {
            id: Completed,
            label: t('eSignature.common.completed', 'Completed')
          }
        ]
      : [
          {
            id: AssigneeAssigned,
            label: t('eSignature.common.notSigned', 'Not Signed')
          },
          {
            id: OwnerAssigned,
            label: t('eSignature.common.waitingForOthers', 'Waiting For Others')
          },
          {
            id: Completed,
            label: t('eSignature.common.completed', 'Completed')
          }
        ];
  };

  render() {
    const {
      envelopes,
      isFetching,
      totalEnvelopesCount,
      handlePageChange,
      handleQueryParamChange,
      handleSortChange,
      search: {
        assigneeTypeName,
        createdBy,
        documentFileName,
        order,
        orderBy,
        ownerTypeName,
        page,
        pageSize,
        status,
        updatedDateUtc
      }
    } = this.props;

    return (
      <EnvelopesTableComponent
        headers={this.getHeaders()}
        options={this.mapEnvelopes(envelopes)}
        handlePageChange={handlePageChange}
        handleRowSelect={this.selectEnvelope}
        order={(order as 'asc' | 'desc') || defaultOrder}
        orderBy={(orderBy as string) || defaultOrderBy}
        page={page ? Number(page) : defaultPage}
        pageSize={pageSize ? Number(pageSize) : defaultPageSize}
        isFetchingData={isFetching}
        totalOptionsCount={totalEnvelopesCount}
        handleFilterChange={handleQueryParamChange}
        handleSortChange={handleSortChange}
        filters={[
          {
            id: 'status',
            initialValue: (status as string) || '',
            type: SelectFilter,
            options: this.getFilterOptions()
          },
          {
            id: 'documentFileName',
            initialValue: (documentFileName as string) || '',
            type: TextFilter
          },
          {
            id: 'assigneeTypeName',
            initialValue: (assigneeTypeName as string) || '',
            type: TextFilter
          },
          {
            id: 'ownerTypeName',
            initialValue: (ownerTypeName as string) || '',
            type: TextFilter
          },
          {
            id: 'createdBy',
            initialValue: (createdBy as string) || '',
            type: TextFilter
          },
          {
            id: 'updatedDateUtc',
            initialValue: (updatedDateUtc as string) || '',
            type: DateFilter
          }
        ]}
      />
    );
  }
}

export const EnvelopesTable = withEnhancedRouter(withTranslation()(EnvelopesTableContainer));
