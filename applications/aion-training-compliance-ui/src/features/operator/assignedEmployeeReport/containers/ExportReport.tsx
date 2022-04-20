import * as React from 'react';
import { connect } from 'react-redux';
import DownloadIcon from '@material-ui/icons/GetApp';
import { ExportButton } from '@pec/aion-ui-components/components/ExportButton';
import { fetchReport, Params } from '@pec/aion-ui-core/slices/downloadReport';
import { filterAssignedEmployeeReport } from '../slice';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { localizeDate, localizeTime } from '@pec/aion-ui-i18next/helpers/localize';
import { withTranslation } from 'react-i18next';

type OwnProps = {
  hasReportContents: boolean;
};

type RouteParams = {
  organizationId: string;
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

        const params = filterAssignedEmployeeReport({ organizationId, urlQuery: parse(search) })
          .select(
            'employeeName,contractorName,workGroupName,jobTypeName,trainingRequirementName,isCompliant,completionDateUtc,expirationDateUtc,validatingCompany,hasDocument'
          )
          .toQueryParam();
        const date = new Date();

        downloadReport({
          url: `/api/trainingCompliance/v3.01/workGroupJobTypeEmployeeJobTypeTrainingRequirements`,
          fileName: `assigned-employee-training-${localizeDate(date, t)}-${localizeTime(date, t)}.csv`,
          params
        });
        resolve();
      } catch (error) {
        reject(error);
      }
    });

  render() {
    const { isFetching, hasReportContents, t } = this.props;

    return (
      <ExportButton
        handleClick={this.downloadReport}
        title={t('trainingCompliance.operator.assignedEmployeeReport.exportReport', 'Export Report')}
        isFetching={isFetching}
        startIcon={<DownloadIcon />}
        hasReportContents={hasReportContents}
      />
    );
  }
}

export const ExportReportContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ExportReport))
);
