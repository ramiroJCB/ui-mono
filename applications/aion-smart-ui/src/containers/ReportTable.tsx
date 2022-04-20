import * as React from 'react';
import { connect } from 'react-redux';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchReport } from 'actions/report';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { merge, parse } from '@pec/aion-ui-core/helpers/querystring';
import { ReportTableComponent } from 'components/ReportTable';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
};

type OwnProps = {
  submitting: boolean;
};

const mapStateToProps = (
  { report: { report, isFetching, error, totalCount } }: RootState,
  { submitting }: OwnProps
) => ({
  report,
  isFetching: isFetching || submitting,
  error,
  totalCount
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId }
    },
    location: { search }
  }: RouteComponentProps<RouteParams> & OwnProps
) => ({
  fetchReport: () => search && dispatch(fetchReport(organizationId, parse(search)))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  OwnProps;

class ReportTable extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchReport();
  }

  componentDidUpdate({ location: { search: prevSearch } }: Props) {
    const {
      location: { search }
    } = this.props;
    if (prevSearch !== search) {
      this.props.fetchReport();
    }
  }

  handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
    const {
      history,
      location: { search }
    } = this.props;
    history.push({
      search: merge(search, {
        page: (page + 1).toString() // MUI is zero-indexed; API is one-indexed
      })
    });
  };

  render() {
    const {
      report,
      isFetching,
      error,
      totalCount,
      location: { search }
    } = this.props;
    const { page } = parse(search);
    return report && !isFetching ? (
      <ReportTableComponent
        report={report}
        handleChangePage={this.handleChangePage}
        page={page ? parseInt(page.toString(), 10) - 1 : 0} // MUI is zero-indexed; API is one-indexed
        totalCount={totalCount}
      />
    ) : error ? (
      <Error />
    ) : (
      <Loading />
    );
  }
}

export const ReportTableContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(ReportTable));
