import * as React from 'react';
import { connect } from 'react-redux';
import { ContractorFilterComponent } from '../components/ContractorFilter';
import { fetchContractors } from 'features/contractors/actions/fetchContractors';
import { fetchFilters } from 'features/filters/actions/fetchFilters';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps &
  I18nextProps;

const mapStateToProps = ({ filters: { filters, isFetching }, contractors }: RootState) => ({
  filters,
  isFetching,
  contractors
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  { location: { search } }: RouteComponentProps
) => ({
  fetchContractors: (searchTerm: string) => dispatch(fetchContractors(0, searchTerm)),
  fetchFilters: () => dispatch(fetchFilters('', parse(search)?.contractor?.toString() || '', '', ''))
});

class Component extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchFilters();
  }

  handleSelect = (contractorId: string) =>
    this.props.history.push({ search: contractorId && `?contractor=${contractorId}` });

  handleSearch = (searchTerm: string) => this.props.fetchContractors(searchTerm);

  render() {
    const { filters, isFetching, contractors, t } = this.props;
    const contractor = filters?.contractors[0];

    return !isFetching && filters ? (
      <ContractorFilterComponent
        options={contractors.contractors?.map(({ id, name, companyNumber }) => ({
          value: id,
          label: name + (companyNumber ? ` (${companyNumber})` : '')
        }))}
        defaultValue={contractor && { value: contractor.id, label: contractor.name }}
        label={t('safetyPrograms.documents.filterByContractor', 'Filter by Contractor')}
        loading={contractors.isFetching}
        hasError={Boolean(contractors.error)}
        total={contractors.total || 0}
        handleSelect={this.handleSelect}
        handleSearch={this.handleSearch}
      />
    ) : null;
  }
}

export const ContractorFilterContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Component))
);
