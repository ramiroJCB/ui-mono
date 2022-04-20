import * as React from 'react';
import { connect } from 'react-redux';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchBasicProgramsIfNeeded } from 'features/programs/actions/fetchBasicPrograms';
import { fetchFilters } from '../actions';
import { fetchPrograms } from 'features/programs/actions/fetchPrograms';
import { fetchProviders } from 'features/providers/actions';
import { FiltersComponent } from '../components/Filters';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { merge, parse } from '@pec/aion-ui-core/helpers/querystring';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type OwnProps = {
  open: boolean;
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps &
  OwnProps;

const mapStateToProps = ({ filters: { filters, isFetching, error }, programs, providers }: RootState) => ({
  filters,
  isFetching,
  error,
  programs,
  providers
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  { location: { search } }: RouteComponentProps
) => ({
  fetchFilters: () => {
    const { programs = '', providers = '' } = parse(search);
    dispatch(fetchFilters(programs.toString(), providers.toString()));
  },
  fetchBasicProgramsIfNeeded: () => dispatch(fetchBasicProgramsIfNeeded()),
  fetchPrograms: (searchTerm: string) => dispatch(fetchPrograms(searchTerm)),
  fetchProviders: (searchTerm: string) => dispatch(fetchProviders(searchTerm))
});

class Component extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchFilters();
    props.fetchBasicProgramsIfNeeded();
  }

  handleDateFilter = (property: string, value: string) => {
    const {
      history,
      location: { search }
    } = this.props;

    history.push({
      search: merge(search, {
        [property]: value
      })
    });
  };

  handleSelect = (param: string) => (ids: string) => {
    const {
      history,
      location: { search }
    } = this.props;

    history.push({
      search: merge(search, {
        [param]: ids,
        page: '1'
      })
    });
  };

  handleSelectBasicPrograms = (value: string) => {
    const {
      history,
      location: { search },
      programs: { basicPrograms }
    } = this.props;

    const { programs } = parse(search);
    const previouslySelectedProgramIds = programs ? programs.toString().split(',') : [];
    const basicProgramIds = basicPrograms ? basicPrograms.map(b => b.id) : [];

    let programIds: string = '';

    if (value === 'true') {
      const combinedProgramIds = previouslySelectedProgramIds.concat(basicProgramIds);
      programIds = Array.from(new Set(combinedProgramIds)).join();
    } else {
      programIds = previouslySelectedProgramIds.filter(id => !basicProgramIds.includes(id)).join();
    }

    history.push({
      search: merge(search, {
        includeAllBasicCourses: value,
        programs: programIds,
        page: '1'
      })
    });
  };

  handleSearch = (param: string) => (searchTerm: string) => {
    const { fetchPrograms, fetchProviders } = this.props;

    switch (param) {
      case 'programs':
        return fetchPrograms(searchTerm);
      case 'providers':
        return fetchProviders(searchTerm);
      default:
        return;
    }
  };

  render() {
    const {
      open,
      filters,
      isFetching,
      error,
      programs,
      providers,
      location: { search }
    } = this.props;
    const { startDate = '', supportedLanguages = '', includeAllBasicCourses = '' } = parse(search);

    return !isFetching && filters && programs.basicPrograms ? (
      <FiltersComponent
        open={open}
        filters={filters}
        programs={programs}
        providers={providers}
        startDate={startDate.toString()}
        supportedLanguages={supportedLanguages.toString()}
        handleDateFilter={this.handleDateFilter}
        handleSelect={this.handleSelect}
        handleSelectBasicPrograms={this.handleSelectBasicPrograms}
        handleSearch={this.handleSearch}
        includeAllBasicCourses={includeAllBasicCourses.toString()}
      />
    ) : error ? (
      <Error />
    ) : (
      <Loading />
    );
  }
}

export const FiltersContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(Component));
