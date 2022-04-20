import * as React from 'react';
import { ClassesListComponent } from '../components/ClassesList';
import { connect } from 'react-redux';
import { fetchTrainingClassesIfNeeded, top } from '../actions';
import { History } from 'history';
import { ISearchClassesForm } from 'interfaces/searchClassesForm';
import { merge, parse, stringify } from '@pec/aion-ui-core/helpers/querystring';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { USAStates } from '@pec/aion-ui-core/constants/USAStates';
import { localizeDistance } from '@pec/aion-ui-i18next/helpers/localize';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';
import { IDistance } from 'interfaces/distance';

type OwnProps = {
  history: History;
};

const mapStateToProps = (state: RootState) => {
  const { totalCount, trainingClasses, isFetching, error } = state.trainingClasses;
  const { gmapsIsLoaded } = state.serverTokens;
  return {
    error,
    isFetching,
    gmapsIsLoaded,
    totalCount,
    trainingClasses
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  { location: { search } }: RouteComponentProps
) => ({
  fetchTrainingClassesIfNeeded: () => dispatch(fetchTrainingClassesIfNeeded(parse(search)))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps &
  OwnProps &
  I18nextProps;

class ClassesList extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    if (props.gmapsIsLoaded) {
      props.fetchTrainingClassesIfNeeded();
    }

    if (!props.location.search) {
      this.setInitialParams();
    }
  }

  componentDidUpdate({ location: { search: prevSearch }, gmapsIsLoaded: prevGmapsIsLoaded }: Props) {
    const {
      fetchTrainingClassesIfNeeded,
      gmapsIsLoaded,
      location: { search }
    } = this.props;

    if (search !== prevSearch || (gmapsIsLoaded && !prevGmapsIsLoaded)) {
      fetchTrainingClassesIfNeeded();
    }
  }

  handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
    const {
      history,
      location: { search, state }
    } = this.props;

    history.push({
      search: merge(search, {
        page: (page + 1).toString() // MUI is zero-indexed; API is one-indexed
      }),
      state
    });
  };

  handleChangeSortOrder = (sortOrder: 'asc' | 'desc') => {
    const {
      history,
      location: { search }
    } = this.props;

    history.push({
      search: merge(search, {
        sortOrder
      })
    });
  };

  onSubmit = (values: ISearchClassesForm) => {
    const {
      history,
      location: { search, state }
    } = this.props;

    history.push({
      search: merge(search, {
        city: values.city,
        state: values.state?.value || '',
        distance: values.distance?.value ? values.distance.value.toString() : '>500'
      }),
      state
    });
  };

  setInitialParams() {
    const {
      history,
      location: { state }
    } = this.props;

    history.replace({
      search: stringify({
        page: '1',
        sortOrder: 'asc'
      }),
      state
    });
  }

  getDistances = (): IDistance[] => {
    const { t } = this.props;
    const distances: number[] = [10, 20, 50, 100, 500];

    return [
      ...distances.map(value => ({ value, label: localizeDistance(value, t) })),
      { value: '', label: `> ${localizeDistance(500, t)}` }
    ];
  };

  render() {
    const {
      error,
      isFetching,
      totalCount,
      trainingClasses,
      location: { search }
    } = this.props;
    const { city, state, distance, page, sortOrder, startDate, supportedLanguages, programs, providers } = parse(
      search
    );

    const distances = this.getDistances();

    const searchClassesFormValues: ISearchClassesForm = {
      city: city?.toString() ?? '',
      state: USAStates.find(({ value }) => value === state),
      distance: distance
        ? distances.find(({ value }) => (distance === '>500' ? value === '' : value === parseInt(distance.toString())))
        : undefined
    };
    return (
      <ClassesListComponent
        distances={distances}
        trainingClasses={trainingClasses}
        search={search}
        error={error}
        isFetching={isFetching}
        total={totalCount}
        onChangePage={this.handleChangePage}
        page={page ? parseInt(page.toString(), 10) - 1 : 0} // MUI is zero-indexed; API is one-indexed
        rowsPerPage={top}
        sortOrder={sortOrder as 'asc' | 'desc'}
        handleChangeSortOrder={this.handleChangeSortOrder}
        isFiltered={Boolean(startDate || supportedLanguages || programs || providers)}
        searchClassesFormValues={searchClassesFormValues}
        submitSearchClassesForm={this.onSubmit}
      />
    );
  }
}

export const ClassesListContainer = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ClassesList));
