import * as React from 'react';
import {
  Actions,
  fetchAutocompleteContractors,
  fetchAutocompleteOperationalContractors,
  fetchAutocompleteRegionalContractors
} from '../actions';
import { Autocomplete, OwnProps as FieldArrayCustomProps } from '@pec/aion-ui-deprecated/components/Autocomplete';
import { connect } from 'react-redux';
import { ControllerStateAndHelpers } from 'downshift';
import { debounce } from 'lodash';
import { FieldArray, GenericFieldArray } from 'redux-form';
import { IAutocompleteOption } from '@pec/aion-ui-core/interfaces/autocompleteOption';
import { IContractor } from 'interfaces/contractor';
import { IMetricContractor } from 'interfaces/metricContractor';
import { OrganizationFeature } from '@pec/aion-ui-core/interfaces/organization';
import { ReportType } from 'features/redirect/enums/reportType';
import { RootState } from 'combineReducers';
import { TextFieldProps } from '@material-ui/core/TextField';
import { ThunkDispatch } from 'redux-thunk';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';

type OwnProps = {
  organizationId: string;
  reportType: ReportType;
  periodId?: string;
};

const mapStateToProps = (state: RootState) => state.autocompleteContractors;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, Actions>,
  { organizationId, periodId, reportType }: OwnProps
) => ({
  fetchAutocompleteContractors: (inputValue?: string) =>
    reportType === ReportType.Regional && periodId
      ? dispatch(fetchAutocompleteRegionalContractors(organizationId, periodId, inputValue))
      : reportType === ReportType.Operations && periodId
      ? dispatch(fetchAutocompleteOperationalContractors(organizationId, periodId, inputValue))
      : dispatch(fetchAutocompleteContractors(organizationId, OrganizationFeature.IncidentReports, inputValue))
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & OwnProps & I18nextProps;

class AutocompleteContractors extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchAutocompleteContractors();
  }

  handleKeyUp = ({ inputValue }: ControllerStateAndHelpers<IContractor | IMetricContractor>) => {
    this.props.fetchAutocompleteContractors(inputValue || '');
  };

  render() {
    const { contractors, isFetching, error, total, t } = this.props;
    const FieldArrayCustom = FieldArray as new () => GenericFieldArray<
      IAutocompleteOption,
      FieldArrayCustomProps & Omit<TextFieldProps, 'error' | 'component' | 'classes'>
    >;

    return (
      <FieldArrayCustom
        name="contractors"
        props={{
          autoFocus: true,
          label: t('reporting.autocompleteContractors.contractors', 'Contractors'),
          options: contractors || [],
          placeholder: t('reporting.autocompleteContractors.searchByContractorName', 'Search by Contractor Name…'),
          handleKeyUp: debounce(this.handleKeyUp, 500),
          isFetching,
          error,
          total
        }}
        component={Autocomplete}
      />
    );
  }
}

export const AutocompleteContractorsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(AutocompleteContractors));
