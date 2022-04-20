import * as React from 'react';
import { $top, fetchSafetyPrograms } from '../actions/fetchSafetyPrograms';
import { connect } from 'react-redux';
import { merge, parse } from '@pec/aion-ui-core/helpers/querystring';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { SafetyProgramsComponent } from '../components/SafetyPrograms';
import { ThunkDispatch } from 'redux-thunk';
import { updateGracePeriodPrompted } from 'features/safetyProgram/actions/updateGracePeriodPrompted';

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & RouteComponentProps;

const mapStateToProps = (state: RootState) => state.safetyPrograms;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  { location: { search } }: RouteComponentProps
) => ({
  fetchSafetyPrograms: () => {
    const { page = '0', searchTerm = '' } = parse(search);
    dispatch(fetchSafetyPrograms(parseInt(page.toString()), searchTerm.toString()));
  },
  updateGracePeriodPrompt: (value: boolean) => dispatch(updateGracePeriodPrompted(value))
});

class Component extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchSafetyPrograms();
    props.updateGracePeriodPrompt(false);
  }

  componentDidUpdate({ location: { search: prevSearch } }: Props) {
    const {
      fetchSafetyPrograms,
      location: { search }
    } = this.props;

    if (search !== prevSearch) {
      fetchSafetyPrograms();
    }
  }

  handleSearch = (searchTerm: string) => {
    const {
      history,
      location: { search }
    } = this.props;

    history.push({
      search: merge(search, {
        searchTerm,
        page: '0'
      })
    });
  };

  handlePageChange = (_event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => {
    const {
      history,
      location: { search }
    } = this.props;

    history.push({
      search: merge(search, {
        page: page.toString()
      })
    });
  };

  render() {
    const {
      safetyPrograms,
      total,
      isFetching,
      error,
      location: { search }
    } = this.props;
    const { page = '0', searchTerm = '' } = parse(search);

    return (
      <SafetyProgramsComponent
        safetyPrograms={safetyPrograms}
        total={total}
        isFetching={isFetching}
        error={error}
        searchTerm={searchTerm.toString()}
        handleSearch={this.handleSearch}
        page={parseInt(page.toString())}
        rowsPerPage={$top}
        onChangePage={this.handlePageChange}
      />
    );
  }
}

export const SafetyProgramsContainer = connect(mapStateToProps, mapDispatchToProps)(Component);
