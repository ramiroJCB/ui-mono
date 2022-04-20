import * as React from 'react';
import { connect } from 'react-redux';
import DownloadIcon from '@material-ui/icons/GetApp';
import { ExportButton } from '@pec/aion-ui-components/components/ExportButton';
import { fetchReport, Params } from '@pec/aion-ui-core/slices/downloadReport';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { ParsedUrlQuery } from 'querystring';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { TaskStatus } from '@pec/aion-ui-core/interfaces/taskGroup';
import { FilterOptionValueType } from '@pec/aion-ui-odata/types/odataFilterOption';
import { ExportParams } from 'types/exportParams';

type RouteParams = {
  organizationId: string;
};

const mapStateToProps = (state: RootState) => state.downloadReport;

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, RootActions>) => ({
  downloadReport: (params: Params) => dispatch(fetchReport(params))
});

const { Contains, Equals, In } = OdataComparator;
const { AssigneeReplied, AwaitingAction, Complete, Incomplete, OwnerReplied, Submitted } = TaskStatus;

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class ExportReport extends React.Component<Props> {
  downloadReport = () =>
    new Promise<void>((resolve, reject) => {
      try {
        const {
          match: {
            params: { organizationId }
          },
          location: { search },
          downloadReport
        } = this.props;
        const date = new Date();
        const {
          contractorName,
          dueDateUtc,
          order,
          orderBy,
          page,
          taskGroupSubject,
          taskNumber
        }: ParsedUrlQuery = parse(search);
        let { status }: ParsedUrlQuery = parse(search);
        const sortOrder = orderBy && order ? `${orderBy} ${order}` : undefined;

        if (status === AwaitingAction) {
          status = organizationId ? [AssigneeReplied, Submitted] : [OwnerReplied];
        } else if (status === Incomplete) {
          status = organizationId ? [Incomplete, OwnerReplied] : [Incomplete];
        } else {
          status = status && [status as TaskStatus];
        }

        const odataParams = new QueryBuilder()
          .orderBy(sortOrder)
          .skipByPage(page, 0)
          .filter(f =>
            f
              .filterBy('clientId', Equals, organizationId)
              .filterBy('status', In, status, {
                valueType: FilterOptionValueType.EnumType
              })
              .filterBy('contractorName', Contains, contractorName)
              .filterBy('taskGroupSubject', Contains, taskGroupSubject)
              .filterBy('taskNumber', Contains, taskNumber)
              .filterBy('dueDateUtc', Equals, dueDateUtc)
          )
          .toQueryParam();

        const statusOrder = !sortOrder
          ? `${AssigneeReplied},${Submitted},${OwnerReplied},${Incomplete},${Complete}`
          : undefined;

        downloadReport({
          url: `/api/v3.01/contractorTasksReport`,
          fileName: `alltasks-${date.toLocaleDateString()}.csv`,
          params: {
            ...odataParams,
            statusOrder
          } as ExportParams
        });

        resolve();
      } catch (error) {
        reject(error);
      }
    });

  render() {
    const { isFetching } = this.props;

    return (
      <ExportButton
        variant="outlined"
        color={undefined}
        handleClick={this.downloadReport}
        title="Export Data"
        isFetching={isFetching}
        startIcon={<DownloadIcon />}
      />
    );
  }
}

export const ExportReportContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(ExportReport));
