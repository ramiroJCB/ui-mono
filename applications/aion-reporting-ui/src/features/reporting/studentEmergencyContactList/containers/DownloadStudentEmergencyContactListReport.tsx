import * as React from 'react';
import { connect } from 'react-redux';
import { downloadStudentEmergencyContactListReport } from '../actions';
import { DownloadStudentEmergencyContactListReportComponent } from '../components/DownloadStudentEmergencyContactListReport';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  reportId: string;
};

const mapStateToProps = (state: RootState) => state.studentEmergencyContactListReportDownload;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { reportId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  downloadStudentEmergencyContactListReport: () => dispatch(downloadStudentEmergencyContactListReport(reportId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class DownloadStudentEmergencyContactListReport extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.downloadStudentEmergencyContactListReport();
  }

  render() {
    const { isFetching, error, downloadStudentEmergencyContactListReport } = this.props;

    return (
      <DownloadStudentEmergencyContactListReportComponent
        isFetching={isFetching}
        error={error}
        downloadStudentEmergencyContactListReport={downloadStudentEmergencyContactListReport}
      />
    );
  }
}

export const DownloadStudentEmergencyContactListReportContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DownloadStudentEmergencyContactListReport);
