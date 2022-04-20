import * as React from 'react';
import { DeepReadonly } from 'ts-essentials';
import { FormSpy } from 'react-final-form';
import { IMandateForm } from 'interfaces/mandate';
import { IRegionalService } from 'interfaces/regionalService';
import { RegionalServicesList } from './RegionalServicesList';

type Props = {
  serviceRegionId: string;
  regionalServices: DeepReadonly<IRegionalService[]>;
};

type State = {
  filteredRegionalServices: DeepReadonly<IRegionalService[]>;
  filterTerm: string;
};

export class RegionalServicesComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      filteredRegionalServices: props.regionalServices,
      filterTerm: ''
    };
  }

  filterRegionalServices = (filterTerm: string) => {
    const { regionalServices } = this.props;

    this.setState({
      filteredRegionalServices: filterTerm
        ? regionalServices.filter(({ serviceName }) => serviceName.toLowerCase().includes(filterTerm.toLowerCase()))
        : regionalServices,
      filterTerm
    });
  };

  handleChangeFilter = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) =>
    this.filterRegionalServices(value);

  handleResetFilter = () => this.filterRegionalServices('');

  render() {
    const { serviceRegionId } = this.props;
    const { filteredRegionalServices, filterTerm } = this.state;
    const filteredRegionalServiceIds = filteredRegionalServices.map(({ id }) => id);

    return (
      <FormSpy<IMandateForm>>
        {({
          form: {
            mutators: { selectRegionalServices, deselectRegionalServices }
          },
          values: { regionalServiceIdsByRegion }
        }) => (
          <RegionalServicesList
            serviceRegionId={serviceRegionId}
            regionalServices={filteredRegionalServices}
            selectedRegionalServiceIds={(regionalServiceIdsByRegion[serviceRegionId] || []).filter(id =>
              filteredRegionalServiceIds.includes(id)
            )}
            selectRegionalServices={selectRegionalServices}
            deselectRegionalServices={deselectRegionalServices}
            handleChangeFilter={this.handleChangeFilter}
            handleResetFilter={this.handleResetFilter}
            filterTerm={filterTerm}
          />
        )}
      </FormSpy>
    );
  }
}
