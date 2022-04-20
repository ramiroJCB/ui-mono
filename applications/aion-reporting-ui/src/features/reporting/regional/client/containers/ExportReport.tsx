import * as React from 'react';
import { connect } from 'react-redux';
import DownloadIcon from '@material-ui/icons/GetApp';
import { ExportButton } from '@pec/aion-ui-components/components/ExportButton';
import { fetchReport, Params } from '@pec/aion-ui-core/slices/downloadReport';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { parse, toArray } from '@pec/aion-ui-core/helpers/querystring';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';
import { localizeDate, localizeTime } from '@pec/aion-ui-i18next/helpers/localize';
import { formats } from '@pec/aion-ui-i18next/constants';

type OwnProps = {
  hasTableContents: boolean;
};

type RouteParams = {
  organizationId: string;
  periodId: string;
};

const mapStateToProps = (state: RootState) => state.downloadReport;

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, RootActions>) => ({
  downloadReport: (params: Params) => dispatch(fetchReport(params))
});

type Props = OwnProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  I18nextProps;

class ExportReport extends React.Component<Props> {
  downloadReport = () => {
    const { t } = this.props;

    return new Promise<void>((resolve, reject) => {
      try {
        const {
          match: {
            params: { organizationId, periodId }
          },
          location: { search },
          downloadReport
        } = this.props;
        const date = new Date();
        const { contractorIds } = parse(search);
        const { Equals, In } = OdataComparator;
        const params = new QueryBuilder()
          .filter(({ filterBy }) => {
            let baseFilter = filterBy('periodId', Equals, periodId);
            if (contractorIds) {
              baseFilter.filterBy('contractorId', In, toArray(contractorIds));
            }
            return baseFilter;
          })
          .select(
            'contractorName,regionName,metricName,metricValue,periodId,submittedStatus,submittedDate,periodStartDate,periodEndDate'
          )
          .toQueryParam();

        downloadReport({
          url: `/api/v3.01/organizations(${organizationId})/flextrackReport`,
          fileName: `flextrack-${localizeDate(date, t)}-${localizeTime(date, t, formats.timeMedium)}.csv`,
          params
        });
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };

  render() {
    const { isFetching, hasTableContents, t } = this.props;
    return (
      <ExportButton
        handleClick={this.downloadReport}
        title={t('reporting.regional.client.exportReport', 'Export Report')}
        isFetching={isFetching}
        startIcon={<DownloadIcon />}
        hasReportContents={hasTableContents}
      />
    );
  }
}

export const ExportReportContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ExportReport))
);
