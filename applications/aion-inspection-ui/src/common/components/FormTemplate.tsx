import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import useFormApi from '@data-driven-forms/react-form-renderer/dist/cjs/use-form-api';
import { FormTemplateRenderProps } from '@data-driven-forms/react-form-renderer';
import { Link } from 'react-router-dom';
import { LoadingButton } from '@pec/aion-ui-components/components/LoadingButton';
import { LocationDescriptor } from 'history';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Moment } from 'moment';

const useStyles = makeStyles((theme: Theme) => ({
  item: {
    paddingTop: theme.spacing(2)
  }
}));

type OwnProps = {
  toPrevious?: LocationDescriptor;
  toNext?: LocationDescriptor;
  onSubmit: (values: { [key: string]: Moment | string | string[] }, pristine?: boolean) => Promise<void>;
  isSubmitting: boolean;
};

type Props = OwnProps & FormTemplateRenderProps;

export const FormTemplate: React.FC<Props> = ({ formFields, toPrevious, onSubmit, isSubmitting }) => {
  const classes = useStyles();
  const { getState, reset } = useFormApi();
  const { pristine } = getState();

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { values, pristine } = getState();
    onSubmit(values, pristine);
  };

  return (
    <Grid item xs={12}>
      <form noValidate onSubmit={handleSubmit}>
        <Grid container>
          <Grid item xs={12}>
            {formFields}
          </Grid>
        </Grid>
        <Grid
          container
          justify={toPrevious && !isSubmitting ? 'space-between' : 'flex-end'}
          classes={{ root: classes.item }}
        >
          {toPrevious && pristine && !isSubmitting && (
            <Grid item xs={5}>
              <Button fullWidth variant="contained" color="primary" component={Link} to={toPrevious}>
                Previous
              </Button>
            </Grid>
          )}
          {!pristine && (
            <Grid item xs={5}>
              <Button fullWidth variant="contained" onClick={reset} startIcon={<RotateLeftIcon />}>
                Reset
              </Button>
            </Grid>
          )}
          <Grid item xs={5}>
            <LoadingButton
              type="submit"
              variant="contained"
              color={!pristine ? 'secondary' : 'primary'}
              isSubmitting={isSubmitting}
              disabled={isSubmitting}
              fullWidth
              endIcon={!pristine && <SaveOutlinedIcon />}
            >
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : !pristine ? 'Save' : 'Next'}
            </LoadingButton>
          </Grid>
        </Grid>
      </form>
    </Grid>
  );
};
