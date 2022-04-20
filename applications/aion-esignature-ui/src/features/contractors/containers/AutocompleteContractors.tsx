import * as React from 'react';
import { AssigneeGroupType } from '@pec/aion-ui-core/interfaces/assigneeGroup';
import { AsyncResult } from 'react-select-async-paginate';
import { AsyncSelectField } from '@pec/aion-ui-form/components/Autocomplete/AsyncSelectField';
import { connect } from 'react-redux';
import { fetchContractors } from '../actions/fetchContractors';
import { Field, FormSpy } from 'react-final-form';
import { IAddEnvelopeForm } from 'interfaces/envelopeForm';
import { IOrganization } from '@pec/aion-ui-core/interfaces/organization';
import { OptionType } from '@pec/aion-ui-form/types/option';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { SelectAdditional } from '@pec/aion-ui-form/types/selectAdditional';
import { ThunkDispatch } from 'redux-thunk';
import { i18n, TFunction } from 'i18next';
import { withTranslation } from 'react-i18next';

const { AllReleasedContractors } = AssigneeGroupType;

type OwnProps = {
  includeAllContractorsOption?: boolean;
};

type I18nextProps = {
  i18n: i18n;
  t: TFunction;
};

const mapStateToProps = (state: RootState) => state.contractors;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  { includeAllContractorsOption }: OwnProps
) => ({
  fetchContractors: (page: number = 1, top: number = 10, inputValue?: string) =>
    dispatch(fetchContractors(inputValue, includeAllContractorsOption, page, top))
});

type State = {
  fieldKey: string;
};

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & OwnProps & I18nextProps;

class AutocompleteContractors extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      fieldKey: `assignee-groups-${props.i18n.language}`
    };
  }

  loadOptions = async (
    inputValue: string,
    _prevOptions: OptionType[],
    { page }: SelectAdditional
  ): Promise<AsyncResult<OptionType, SelectAdditional>> =>
    inputValue
      ? await this.props.fetchContractors(page, 100, inputValue)
      : await this.props.fetchContractors(page, 100);

  componentDidUpdate(prevProps: Readonly<Props>) {
    const {
      t,
      i18n: { language }
    } = this.props;

    if (prevProps.t !== t) {
      this.setState({
        fieldKey: `assignee-groups-${language}`
      });
    }
  }

  render() {
    const { t } = this.props;
    const validate = (_values: IOrganization[], allValues: IAddEnvelopeForm) =>
      allValues.assigneeGroups.length === 0
        ? t('eSignature.contractors.atLeastOneContractorRequired', 'At least one contractor is required')
        : undefined;

    return (
      <FormSpy<IAddEnvelopeForm>>
        {({ form }) => (
          <Field
            name="assigneeGroups"
            label={t('eSignature.contractors.contractors', 'Contractors')}
            validate={validate}
            key={this.state.fieldKey}
          >
            {props => (
              <AsyncSelectField<OptionType>
                loadOptions={(inputValue, prevOptions, pagination) =>
                  this.loadOptions(inputValue, prevOptions, pagination)
                }
                closeMenuOnSelect={false}
                placeholder={t('eSignature.contractors.selectContractors', 'Select Contractors')}
                getOptionLabel={({ name }) => name}
                getOptionValue={({ id }) => id}
                isOptionDisabled={() =>
                  form.getState().values.assigneeGroups.some(option => option.id === AllReleasedContractors)
                }
                {...props}
              />
            )}
          </Field>
        )}
      </FormSpy>
    );
  }
}

export const AutocompleteContractorsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(AutocompleteContractors));
