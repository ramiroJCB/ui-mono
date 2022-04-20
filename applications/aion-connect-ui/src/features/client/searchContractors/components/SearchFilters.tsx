import * as React from 'react';
import amber from '@material-ui/core/colors/amber';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { ConnectionStatus, ISearchContractorsForm } from 'interfaces/searchContractorsForm';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'utility-types';
import { Field } from 'react-final-form';
import { FormApi } from 'final-form';
import { FormSpy } from 'react-final-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { ISearchFilters } from 'interfaces/searchFilters';
import { SelectField } from '@pec/aion-ui-form/components/Autocomplete/SelectField';

export const employeeCounts = [
  { value: '9', label: '<10' },
  { value: '49', label: '<50' },
  { value: '99', label: '<100' },
  { value: '499', label: '<500' },
  { value: '500', label: '>500' }
];

const { Connected, NotConnected, Pending } = ConnectionStatus;

export const connectionStatuses = [
  { value: Connected, label: 'Connected' },
  { value: NotConnected, label: 'Not Connected' },
  { value: Pending, label: 'Pending' }
];

const styles = (theme: Theme) =>
  createStyles({
    button: {
      padding: theme.spacing(2)
    },
    footer: {
      position: 'absolute',
      width: '100%',
      bottom: 0
    }
  });

type OwnProps = {
  onSubmit: (values: ISearchContractorsForm, form: FormApi<ISearchContractorsForm>) => Promise<void>;
  searchFilters: DeepReadonly<ISearchFilters> | null;
};

type Props = OwnProps & WithStyles<typeof styles>;

class SearchFilters extends React.Component<Props> {
  apply = (values: ISearchContractorsForm, form: FormApi<ISearchContractorsForm>) => () =>
    this.props.onSubmit(values, form);

  clear = (form: FormApi<ISearchContractorsForm>) => () => {
    const filters = form.getState().values.filters;
    filters && Object.keys(filters).map(filter => form.change(`filters.${filter}`, ''));
  };

  handleBusinessUnitChange = (form: FormApi<ISearchContractorsForm>) => (businessUnit: {
    value: string;
    label: string;
  }) => {
    if (businessUnit?.value) {
      form.change('filters.connectionStatus', { value: Connected, label: 'Connected' });
    } else {
      form.change('filters.connectionStatus', '');
    }
  };

  handleConnectionStatusChange = (form: FormApi<ISearchContractorsForm>) => (connectionStatus: {
    value: string;
    label: string;
  }) => {
    if (connectionStatus?.value === NotConnected) {
      form.change('filters.businessUnit', '');
    }
  };

  render() {
    const { classes, searchFilters } = this.props;
    return (
      <FormSpy<ISearchContractorsForm>>
        {({ form }) => {
          const { values, invalid, pristine } = form.getState();

          return (
            searchFilters && (
              <GridContainer>
                <Grid item xs={12}>
                  <Field name="filters.businessUnit">
                    {props => (
                      <SelectField
                        id="businessUnit"
                        label="Business Unit"
                        menuPosition="fixed"
                        maxMenuHeight={200}
                        isClearable
                        variant="filled"
                        options={searchFilters.businessUnits.map(bu => ({ value: bu, label: bu }))}
                        isDisabled={values.filters?.connectionStatus?.value === NotConnected}
                        customOnChange={this.handleBusinessUnitChange(form)}
                        {...props}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid item xs={12}>
                  <Field name="filters.connectionStatus">
                    {props => (
                      <SelectField
                        id="connectionStatus"
                        label="Connection Status"
                        menuPosition="fixed"
                        maxMenuHeight={200}
                        isClearable
                        variant="filled"
                        options={connectionStatuses}
                        isDisabled={Boolean(values.filters?.businessUnit?.value)}
                        customOnChange={this.handleConnectionStatusChange(form)}
                        {...props}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid item xs={12}>
                  <Field name="filters.employeeCount">
                    {props => (
                      <SelectField
                        id="employeeCount"
                        label="Employee Count"
                        menuPosition="fixed"
                        maxMenuHeight={200}
                        isClearable
                        variant="filled"
                        options={employeeCounts}
                        {...props}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid item xs={12}>
                  <Field name="filters.naicsCode">
                    {props => (
                      <SelectField
                        id="naicsCode"
                        label="Industry Classification"
                        menuPosition="fixed"
                        maxMenuHeight={200}
                        isClearable
                        variant="filled"
                        options={searchFilters.naicsCodes.map(nc => ({ value: nc, label: nc }))}
                        {...props}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid item xs={12}>
                  <Field name="filters.predictiveRanking">
                    {props => (
                      <SelectField
                        id="predictiveRanking"
                        label="Predictive Ranking"
                        menuPosition="fixed"
                        maxMenuHeight={200}
                        isClearable
                        variant="filled"
                        options={searchFilters.predictiveRankings.map(pr =>
                          pr ? { value: pr, label: pr } : { value: 'No Ranking', label: 'No Ranking' }
                        )}
                        {...props}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid item xs={12}>
                  <Field name="filters.tag">
                    {props => (
                      <SelectField
                        id="tag"
                        label="Tags"
                        menuPosition="fixed"
                        maxMenuHeight={200}
                        isClearable
                        variant="filled"
                        options={searchFilters.tags.map(tag => ({ value: tag, label: tag }))}
                        {...props}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid item xs={12} className={classes.footer} style={{ padding: 0 }}>
                  <GridContainer>
                    <Grid item xs={12} sm={6}>
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        onClick={this.apply(values, form)}
                        disabled={invalid || pristine}
                        fullWidth
                      >
                        Apply
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Button
                        style={{ color: amber[900] }}
                        className={classes.button}
                        onClick={this.clear(form)}
                        fullWidth
                      >
                        Clear
                      </Button>
                    </Grid>
                  </GridContainer>
                </Grid>
              </GridContainer>
            )
          );
        }}
      </FormSpy>
    );
  }
}

export const SearchFiltersComponent = withStyles(styles)(SearchFilters);
