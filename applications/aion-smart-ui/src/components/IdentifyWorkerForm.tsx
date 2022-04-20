import * as React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { Field, Form, GenericField, InjectedFormProps, reduxForm } from 'redux-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IdentifyWorkerIcon } from './IdentifyWorkerIcon';
import { InputAdornment } from '@material-ui/core';
import { normalizePecId } from '@pec/aion-ui-core/normalizers';
import { TextFieldProps } from '@material-ui/core/TextField';
import { TextField } from '@pec/aion-ui-deprecated/components/TextField';
import { validatePecId } from '@pec/aion-ui-core/validators';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type OwnProps = {
  inputRef: React.RefObject<HTMLInputElement>;
  workerId?: string;
};

const styles = (theme: Theme) =>
  createStyles({
    title: {
      backgroundColor: theme.palette.primary.main,
      textAlign: 'center',
      paddingBottom: 24
    },
    icon: {
      color: 'white',
      fontSize: 100
    },
    button: {
      marginTop: 12
    }
  });

const helperText = validatePecId('no bueno');

type Props = InjectedFormProps<{ pecIdentifier: string }, OwnProps> & WithStyles<typeof styles> & OwnProps;

const IdentifyWorkerFormComponent: React.FC<Props> = ({
  handleSubmit,
  submitting,
  pristine,
  invalid,
  error,
  classes,
  inputRef,
  workerId
}) => {
  const FieldCustom = Field as new () => GenericField<TextFieldProps>;
  const [data, setData] = useState(workerId ? workerId.substring(3, 12) : '');

  const onChange = (element: React.RefObject<HTMLInputElement>) => {
    element && element.current && setData(element.current.value.substring(0, 9));
  };

  const { t } = useTranslation();
  return (
    <Form onSubmit={handleSubmit}>
      <GridContainer alignItems="flex-start">
        <Hidden mdUp>
          <Grid item xs={12} className={classes.title}>
            <IdentifyWorkerIcon className={classes.icon} />
          </Grid>
        </Hidden>
        <Grid item xs={12} sm={8}>
          <FieldCustom
            variant="filled"
            inputRef={inputRef}
            fullWidth
            required
            name="pecIdentifier"
            component={TextField}
            label={t('smart.identifyWorker.workerPEC', 'Worker’s PEC ID')}
            autoFocus
            onChange={() => onChange(inputRef)}
            InputProps={{
              startAdornment: <InputAdornment position="start">{t('smart.identifyWorker.PEC', 'PEC')}</InputAdornment>,
              type: 'text',
              value: data
            }}
            disabled={submitting}
            helperText={error || helperText}
            normalize={normalizePecId}
            validate={validatePecId}
            placeholder="#########"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            disabled={Boolean(data.length && validatePecId(data)) || submitting || pristine || invalid}
            className={classes.button}
          >
            {t('smart.identifyWorker.identify', 'Identify')}
          </Button>
        </Grid>
      </GridContainer>
    </Form>
  );
};

export const IdentifyWorkerForm = reduxForm<{ pecIdentifier: string }, OwnProps>({ form: 'identifyWorkerForm' })(
  withStyles(styles)(IdentifyWorkerFormComponent)
);
