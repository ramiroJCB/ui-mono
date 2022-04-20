import * as React from 'react';
import DownloadIcon from '@material-ui/icons/GetApp';
import { connect } from 'react-redux';
import { ExportButton } from '@pec/aion-ui-components/components/ExportButton';
import { fetchReport, Params } from '@pec/aion-ui-core/slices/downloadReport';
import { filterFormatters } from 'actions/report';
import { makeFilterParam } from '@pec/aion-ui-odata/helpers/formatters';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { withTranslation } from 'react-i18next';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { localizeDate, localizeTime } from '@pec/aion-ui-i18next/helpers/localize';

type RouteParams = {
  organizationId: string;
};

const mapStateToProps = (state: RootState) => state.downloadReport;

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, RootActions>) => ({
  downloadReport: (params: Params) => dispatch(fetchReport(params))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  I18nextProps;

class ExportReport extends React.Component<Props> {
  downloadReport = () =>
    new Promise<void>((resolve, reject) => {
      try {
        const {
          match: {
            params: { organizationId }
          },
          location: { search },
          downloadReport,
          t
        } = this.props;
        const { start, end, ...query } = parse(search);
        const $filter = makeFilterParam(filterFormatters, `dateTimeIn ge ${start} and dateTimeOut le ${end}`, query);
        const $select =
          'firstname,lastname,pecIdentifier,company,companystatus,siteName,exposureDuration,injuredonlocation,datetimeIn,datetimeout,complianttraining';
        const date = new Date();

        downloadReport({
          url: `/api/v3.01/organizations(${organizationId})/workerDetails`,
          fileName: `worker-details-${localizeDate(date, t)}-${localizeTime(date, t)}.csv`,
          params: { $filter, $select }
        });
        resolve();
      } catch (error) {
        reject(error);
      }
    });

  render() {
    const { isFetching, t } = this.props;
    return (
      <ExportButton
        handleClick={this.downloadReport}
        title={t('smart.titles.exportReport', 'Export Report')}
        isFetching={isFetching}
        startIcon={<DownloadIcon />}
      />
    );
  }
}

export const ExportReportContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ExportReport))
);
