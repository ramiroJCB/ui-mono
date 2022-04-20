import * as React from 'react';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Autocomplete, OwnProps as FieldArrayCustomProps } from '@pec/aion-ui-deprecated/components/Autocomplete';
import { ControllerStateAndHelpers } from 'downshift';
import { DeepReadonly } from 'utility-types';
import { Dialog } from '@pec/aion-ui-components/components/Dialog';
import {
  Field,
  FieldArray,
  FieldArrayFieldsProps,
  Form,
  GenericField,
  GenericFieldArray,
  InjectedFormProps,
  reduxForm,
  WrappedFieldProps
} from 'redux-form';
import { filterByName } from '@pec/aion-ui-core/helpers/autocomplete';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IAutocompleteOption } from '@pec/aion-ui-core/interfaces/autocompleteOption';
import { ISiteForm, SiteStatus } from '../interfaces/site';
import { ISiteTag } from 'interfaces/siteTag';
import { millisToHoursString } from 'helpers/timeCalc';
import { OwnProps as SwitchFieldOwnProps, SwitchField } from '@pec/aion-ui-deprecated/components/SwitchField';
import { required } from '@pec/aion-ui-core/validators';
import { TextFieldProps } from '@material-ui/core/TextField';
import { SwitchProps } from '@material-ui/core/Switch';
import { TextField } from '@pec/aion-ui-deprecated/components/TextField';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { v4 as uuid } from 'uuid';
import { IWorkGroup } from '@pec/aion-ui-core/interfaces/workGroup';
import { FormLabel, FormControlLabel, Checkbox } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const { Active, Inactive } = SiteStatus;

type OwnProps = {
  onDeleteConfirm?: () => Promise<void>;
  siteTags: DeepReadonly<ISiteTag[]>;
  workGroups: DeepReadonly<IWorkGroup[]> | null;
  organizationId?: string;
};

const styles = (theme: Theme) => ({
  confirmDelete: {
    color: theme.palette.error.main
  },
  cancelButton: {
    margin: '0 5px 0 10px'
  }
});

const normalizeStatus = (value: boolean) => (value ? Active : Inactive);
const hoursEndAdornment = <InputAdornment position="end">hours</InputAdornment>;
const parseHoursToMillis = (value: number | null) => (value === 0.0 || value == null ? null : value * 3600 * 1000);

const handleEnterKeyUp = (
  { clearSelection, inputValue }: ControllerStateAndHelpers<IAutocompleteOption>,
  fields: FieldArrayFieldsProps<IAutocompleteOption>
) => {
  if (
    inputValue &&
    !fields
      .getAll()
      .map((f: any) => f.name)
      .includes(inputValue)
  ) {
    fields.push({
      id: uuid(),
      name: inputValue
    });
  }
  clearSelection();
};

type Props = InjectedFormProps<ISiteForm, OwnProps> & WithStyles<typeof styles> & OwnProps;

const SiteDetails: React.FC<Props> = ({
  submitting,
  handleSubmit,
  organizationId,
  invalid,
  initialValues: { id, standardShiftDuration },
  onDeleteConfirm,
  siteTags,
  classes,
  workGroups
}) => {
  const FieldCustom = Field as new () => GenericField<TextFieldProps>;
  const FieldArrayCustom = FieldArray as new () => GenericFieldArray<IAutocompleteOption, FieldArrayCustomProps | any>; // TODO: Replace 'any' with correct type
  const SwitchCustom = Field as new () => GenericField<
    Pick<SwitchProps, Exclude<keyof SwitchProps, 'component'>> & SwitchFieldOwnProps
  >;
  const { t } = useTranslation();

  return (
    <Form onSubmit={handleSubmit}>
      <GridContainer>
        <Grid item xs={12}>
          <FieldCustom
            variant="filled"
            fullWidth
            required
            name="name"
            component={TextField}
            label="Name"
            validate={required}
          />
        </Grid>
        {/* TODO: Remove undefined check when we have back-end support */}
        {standardShiftDuration !== undefined && (
          <Grid item xs={12}>
            <FieldCustom
              variant="filled"
              name="standardShiftDuration"
              label={t('smart.siteDetailsForm.standardShiftDuration', 'Standard Shift Duration')}
              component={TextField}
              fullWidth
              type="number"
              InputProps={{
                endAdornment: hoursEndAdornment,
                inputProps: { min: 0.0, max: 24, step: 0.5 }
              }}
              helperText={t('smart.siteDetailsForm.enterForNone', 'Enter 0.0 for none')}
              format={millisToHoursString}
              parse={parseHoursToMillis}
            />
          </Grid>
        )}
        {id && (
          <Grid item xs={12}>
            <SwitchCustom
              name="status"
              label="Status"
              component={SwitchField}
              checkedValue={SiteStatus.Active}
              normalize={normalizeStatus}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <FieldCustom
            variant="filled"
            fullWidth
            multiline
            rowsMax="4"
            name="description"
            label={t('smart.common.description', 'Description')}
            component={TextField}
          />
        </Grid>
        <Grid item xs={12}>
          <FieldArrayCustom
            name="tags"
            variant="filled"
            props={{
              label: t('smart.common.tags', 'Tags'),
              options: siteTags,
              placeholder: t('smart.siteDetailsForm.enterNewTag', 'Enter a new or existing tag…'),
              filter: filterByName,
              handleEnterKeyUp,
              startClosed: true
            }}
            component={Autocomplete}
          />
        </Grid>
        {workGroups && !!workGroups.length && (
          <Grid item>
            <FormLabel component="label">{t('smart.siteDetailsForm.workgroups', 'Workgroups')}</FormLabel>
            <Grid container>
              {workGroups.map((wg: IWorkGroup) => {
                return (
                  <Grid item key={wg.id} xs={12} sm={4} md={4}>
                    <Field
                      name={`itemsWorkgroups[${wg.id}]`}
                      component={({ input: { value: _value, ...input } }: WrappedFieldProps) => (
                        <FormControlLabel control={<Checkbox {...input} />} label={wg.name} />
                      )}
                      type="checkbox"
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        )}
        <Grid item xs={onDeleteConfirm ? 6 : 12}>
          <Button
            color="default"
            className={classes.cancelButton}
            component={Link}
            to={{ pathname: `/${organizationId}/sites` }}
          >
            {t('smart.common.cancel', 'Cancel')}
          </Button>
          <Button variant="contained" color="secondary" onClick={handleSubmit} disabled={submitting || invalid}>
            {t('smart.common.save', 'Save')}
          </Button>
        </Grid>
        {onDeleteConfirm && (
          <Grid item xs={6}>
            <Dialog
              renderTriggerButton={props => (
                <Button fullWidth className={classes.confirmDelete} {...props}>
                  {t('smart.common.delete', 'Delete')}
                </Button>
              )}
              onConfirm={onDeleteConfirm}
            >
              {({ handleClose, handleConfirm }) => (
                <React.Fragment>
                  <DialogContent>
                    <DialogContentText>
                      {t('smart.siteDetailsForm.areYouSure', 'Are you sure you want to delete this site?')}
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button color="primary" onClick={handleClose}>
                      {t('smart.common.cancel', 'Cancel')}
                    </Button>
                    <Button onClick={handleConfirm} className={classes.confirmDelete}>
                      {t('smart.siteDetailsForm.yesDeleteIt', 'Yes, delete it')}
                    </Button>
                  </DialogActions>
                </React.Fragment>
              )}
            </Dialog>
          </Grid>
        )}
      </GridContainer>
    </Form>
  );
};

export const SiteDetailsForm = reduxForm<{}, OwnProps>({
  form: 'siteForm',
  destroyOnUnmount: false,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  updateUnregisteredFields: true
})(withStyles(styles)(SiteDetails));
