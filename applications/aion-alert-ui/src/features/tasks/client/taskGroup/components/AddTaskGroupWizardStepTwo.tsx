import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import MaterialUITable from '@material-ui/core/Table';
import MaterialUITableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { AutocompleteTagsContainer } from '../tags/containers/AutocompleteTags';
import { CheckboxField } from '@pec/aion-ui-form/components/CheckboxField';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import { Field, FormSpy } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { FormApi } from 'final-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IAddTaskGroupForm, IAssignedContractor } from 'interfaces/taskGroupForm';
import { LoadingOverlay } from 'components/LoadingOverlay';
import { TablePagination } from '@pec/aion-ui-components/components/Table/TablePagination';
import { Tags } from 'components/Tags';

const styles = () =>
  createStyles({
    root: {
      width: '100%',
      position: 'relative'
    },
    table: {
      minWidth: 500
    },
    tableWrapper: {
      overflowX: 'auto'
    }
  });

type OwnProps = {
  isLoading: boolean;
  page: number;
  totalCount: number;
  handleChangePage: (
    form: FormApi<IAddTaskGroupForm>
  ) => (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
};

type Props = OwnProps & WithStyles<typeof styles>;

class AddTaskGroupWizardStepTwoComponent extends React.Component<Props> {
  handleChangeIgnoredAssigneeGroups = (form: FormApi<IAddTaskGroupForm>, contractorId: string) => (
    _event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    const { ignoredAssigneeGroups: previousPagesSelected } = form.getState().values;

    if (!checked && previousPagesSelected && !previousPagesSelected.includes(contractorId)) {
      form.change('ignoredAssigneeGroups', [...previousPagesSelected, contractorId]);
    } else {
      form.change('ignoredAssigneeGroups', [...previousPagesSelected.filter(id => id !== contractorId)]);
    }
  };

  render() {
    const { classes, isLoading, page, totalCount, handleChangePage } = this.props;

    return (
      <FormSpy<IAddTaskGroupForm>>
        {({ form }) => (
          <GridContainer justify="center">
            <Grid item xs={12} md={6}>
              <AutocompleteTagsContainer />
            </Grid>
            {form.getState().values.tags.length > 0 && (
              <React.Fragment>
                <Grid item xs={12}>
                  <Typography variant="h6">Assign Contractors</Typography>
                  <LoadingOverlay isLoading={isLoading}>
                    <div className={classes.root}>
                      <div className={classes.tableWrapper}>
                        <MaterialUITable className={classes.table}>
                          <colgroup>
                            <col style={{ width: '5%' }} />
                            <col style={{ width: '70%' }} />
                            <col style={{ width: '25%' }} />
                          </colgroup>
                          <TableHead>
                            <TableRow>
                              <TableCell padding="checkbox" />
                              <TableCell>Contractor</TableCell>
                              <TableCell>Tags</TableCell>
                            </TableRow>
                          </TableHead>
                          <MaterialUITableBody>
                            <FieldArray<IAssignedContractor> name="confirmContractorsByTags">
                              {({ fields }) =>
                                fields.map((contractor, index) => {
                                  if (fields.value) {
                                    const { id, name, tags } = fields.value[index];

                                    return (
                                      <TableRow key={contractor}>
                                        <TableCell>
                                          <Field
                                            type="checkbox"
                                            name={`${contractor}.ignore`}
                                            component={CheckboxField}
                                            customOnChange={this.handleChangeIgnoredAssigneeGroups(form, id)}
                                          />
                                        </TableCell>
                                        <TableCell>{name}</TableCell>
                                        <TableCell>{tags && <Tags tags={tags} maxVisibleTags={2} />}</TableCell>
                                      </TableRow>
                                    );
                                  } else {
                                    return null;
                                  }
                                })
                              }
                            </FieldArray>
                          </MaterialUITableBody>
                        </MaterialUITable>
                      </div>
                      <TablePagination
                        component="div"
                        page={page}
                        totalCount={totalCount}
                        handleChangePage={handleChangePage(form)}
                        rowsPerPage={10}
                      />
                    </div>
                  </LoadingOverlay>
                </Grid>
              </React.Fragment>
            )}
          </GridContainer>
        )}
      </FormSpy>
    );
  }
}

export const AddTaskGroupWizardStepTwo = withStyles(styles)(AddTaskGroupWizardStepTwoComponent);
