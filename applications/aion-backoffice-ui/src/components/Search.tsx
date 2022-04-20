import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { DeepReadonly } from 'utility-types';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { History } from 'history';

type Props = {
  searchTerm?: string;
  history: History;
  uri: string;
  header: string;
  label: string;
  placeholder: string;
};

type State = DeepReadonly<{
  searchTerm: string;
}>;

class Search extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { searchTerm } = props;
    this.state = { searchTerm: searchTerm ? decodeURIComponent(searchTerm) : '' };
  }

  handleSearchFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const { uri: searchUri, history } = this.props;
    const { searchTerm } = this.state;

    if (searchTerm) {
      const uri = searchUri.replace('%s', encodeURIComponent(searchTerm));
      history.push(uri);
    }
  };

  handleSearchInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) =>
    this.setState({ searchTerm: event.target.value });

  render() {
    const { header, label, placeholder, children } = this.props;
    const { searchTerm } = this.state;

    return (
      <GridContainer>
        <Grid item xs={12}>
          <Typography variant="h5">{header}</Typography>
        </Grid>
        <Grid item xs={12}>
          <form onSubmit={this.handleSearchFormSubmit}>
            <Typography variant="subtitle1">{label}</Typography>
            <TextField
              variant="standard"
              placeholder={placeholder}
              onChange={this.handleSearchInputChange}
              autoFocus
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
              value={searchTerm}
            />
          </form>
        </Grid>
        {children}
      </GridContainer>
    );
  }
}

export default Search;
