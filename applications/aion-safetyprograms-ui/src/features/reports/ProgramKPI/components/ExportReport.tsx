import * as React from 'react';
import { connect } from 'react-redux';
import DownloadIcon from '@material-ui/icons/GetApp';
import { ExportButton } from '@pec/aion-ui-components/components/ExportButton';
import { fetchReport, Params } from '@pec/aion-ui-core/slices/downloadReport';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { ThunkDispatch } from 'redux-thunk';
import { FormApi } from 'final-form';
import { IProgramKpiForm } from 'interfaces/programKpiForm';
import moment from 'moment';

const mapStateToProps = (state: RootState) => state.downloadReport;

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, RootActions>) => ({
  downloadReport: (params: Params) => dispatch(fetchReport(params))
});

type OwnProps = {
  form: FormApi<IProgramKpiForm>;
  onSubmit: (values: IProgramKpiForm, form: FormApi<IProgramKpiForm>) => void;
};
type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & OwnProps;

class ExportReport extends React.Component<Props> {
  downloadReport = () =>
    new Promise<void>((resolve, reject) => {
      try {
        const { downloadReport, form } = this.props;
        const { beginDateUtc, endDateUtc, timezone } = form.getState().values;

        const date = new Date();

        downloadReport({
          url: `/api/v3.01/safetyPrograms/reports/kpi?beginDateUtc=${moment(new Date(beginDateUtc))
            .startOf('day')
            .utc()
            .format()}&endDateUtc=${moment(new Date(endDateUtc))
            .endOf('day')
            .utc()
            .format()}&timezone=${timezone}`,
          fileName: `programKpi-${date.toLocaleDateString()}.csv`
        });

        resolve();
      } catch (error) {
        reject(error);
      }
    });

  handleSubmit = async () => {
    this.props.onSubmit(this.props.form.getState().values, this.props.form);
    await this.downloadReport();
  };

  render() {
    const { isFetching, form } = this.props;

    return (
      <ExportButton
        variant="outlined"
        color={undefined}
        handleClick={this.handleSubmit}
        title="Generate Report"
        isFetching={isFetching}
        startIcon={<DownloadIcon />}
        disabled={!form.getState().valid}
      />
    );
  }
}

export const ExportProgramKpiReportContainer = connect(mapStateToProps, mapDispatchToProps)(ExportReport);
