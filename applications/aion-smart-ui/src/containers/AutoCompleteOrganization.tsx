import * as React from 'react';
import { AutoCompleteOrganizationsComponent } from 'components/AutoComplete';
import { change } from 'redux-form';
import { connect } from 'react-redux';
import { ControllerStateAndHelpers } from 'downshift';
import { debounce } from 'lodash';
import { fetchOrganizations } from 'actions/organizations';
import { IAutocompleteOption } from '@pec/aion-ui-core/interfaces/autocompleteOption';
import { IOrganization } from '@pec/aion-ui-core/interfaces/organization';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { ThunkDispatch } from 'redux-thunk';

type OwnProps = {
  formName: string;
};

const mapStateToProps = (state: RootState) => state.autocompleteOrganizations;

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, RootActions>, ownProps: OwnProps) => ({
  changeOrganization: (item: IAutocompleteOption) => dispatch(change(ownProps.formName, 'organization', item)),
  fetchOrganizationsIfNeeded: (inputValue?: string) => dispatch(fetchOrganizations(inputValue))
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & OwnProps;

class AutoCompleteOrganization extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchOrganizationsIfNeeded();
  }

  handleKeyUp = ({ inputValue }: ControllerStateAndHelpers<IOrganization>) => {
    if (inputValue) {
      this.props.fetchOrganizationsIfNeeded(inputValue);
    }
  };

  render() {
    const { organizations } = this.props;
    return (
      <AutoCompleteOrganizationsComponent
        options={organizations || []}
        handleKeyUp={debounce(this.handleKeyUp, 500)}
        handleChange={this.props.changeOrganization}
      />
    );
  }
}

export const AutoCompleteOrganizationsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AutoCompleteOrganization);
