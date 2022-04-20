import * as React from 'react';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import { debounce } from 'lodash';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';

type State = {
  searchTerm: string | string[];
};

type OwnProps = {
  handleSearch: (searchText: string | string[]) => void;
  searchValue: string | string[];
};

type Props = OwnProps & I18nextProps;

class Component extends React.PureComponent<Props, State> {
  readonly state: State = {
    searchTerm: this.props.searchValue ? this.props.searchValue : ''
  };

  handleSearchChange = debounce(() => {
    const { handleSearch } = this.props;
    handleSearch(this.state.searchTerm);
  }, 500);

  onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchTerm: event.target.value }, () => {
      this.handleSearchChange();
    });
  };

  render() {
    return (
      <Input
        value={this.state.searchTerm}
        onChange={this.onSearchChange}
        fullWidth
        placeholder={this.props.t('trainingCompliance.components.search', 'Search')}
        type="search"
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        }
      />
    );
  }
}

export const Search = withTranslation()(Component);
