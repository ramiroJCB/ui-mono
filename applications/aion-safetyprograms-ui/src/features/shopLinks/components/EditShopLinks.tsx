import * as React from 'react';
import { FormSpy } from 'react-final-form';
import { DeepReadonly } from 'utility-types';
import { IEditShopLinksForm, ISafetyProgram } from 'interfaces/safetyProgram';
import { ShopLinksList } from './ShopLinksList';

type Props = {
  handleHeaderClick: (orderby: string) => () => void;
  orderby: string;
  safetyPrograms: DeepReadonly<ISafetyProgram[]>;
};

type State = {
  filteredSafetyPrograms: DeepReadonly<ISafetyProgram[]>;
  filterTerm: string;
  selectedIds: string[] | null;
};

export class EditShopLinksComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      filteredSafetyPrograms: props.safetyPrograms,
      filterTerm: '',
      selectedIds: this.props.safetyPrograms.filter(program => program.showShopLink === true).map(x => x.id)
    };
  }

  filterSafetyPrograms = (filterTerm: string) => {
    const { safetyPrograms } = this.props;

    this.setState({
      filteredSafetyPrograms: filterTerm
        ? safetyPrograms.filter(({ title }) => title.toLowerCase().includes(filterTerm.toLowerCase()))
        : safetyPrograms,
      filterTerm
    });
  };

  handleChangeFilter = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => this.filterSafetyPrograms(value);

  handleResetFilter = () => this.filterSafetyPrograms('');

  updateUnfilteredIds = (ids: string[]) => {
    this.setState({
      selectedIds: ids
    });
  };

  render() {
    const { orderby, handleHeaderClick } = this.props;
    const { filteredSafetyPrograms, filterTerm } = this.state;
    const filteredSafetyProgramIds = filteredSafetyPrograms.map(({ id }) => id);
    const unfilteredIds = this.state.selectedIds || [];

    return (
      <FormSpy<IEditShopLinksForm>>
        {({ form, values: { safetyProgramIds } }) => (
          <ShopLinksList
            handleHeaderClick={handleHeaderClick}
            orderby={orderby}
            form={form}
            safetyPrograms={filteredSafetyPrograms}
            selectedSafetyProgramIds={
              unfilteredIds.length > 0
                ? (safetyProgramIds || []).filter(id => filteredSafetyProgramIds.includes(id))
                : Array.from(new Set(safetyProgramIds.concat(unfilteredIds)))
            }
            unfilteredSafetyProgramIds={unfilteredIds}
            handleChangeFilter={this.handleChangeFilter}
            handleResetFilter={this.handleResetFilter}
            filterTerm={filterTerm}
            updateUnfilteredIds={this.updateUnfilteredIds}
          />
        )}
      </FormSpy>
    );
  }
}
