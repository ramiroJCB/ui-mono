import React, { useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { fetchForms, formsSelectors } from './slice';
import { FormsList } from './FormsList';
import { GetStarted } from './GetStarted';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { useAppDispatch, useTypedSelector } from 'app/reducer';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: 0,
      marginTop: theme.spacing(2)
    },
    container: {
      flexGrow: 1,
      alignContent: 'center'
    }
  })
);

export const ViewForms: React.FC = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const { organizationId } = useParams<{ organizationId: string }>();
  const { isFetching, error } = useTypedSelector(state => state.forms);
  const forms = useTypedSelector(formsSelectors.selectAll);

  useEffect(() => {
    dispatch(fetchForms({ organizationId }));
  }, [dispatch, organizationId]);

  return (
    <Paper hasError={!!error} isLoading={isFetching} className={classes.paper}>
      {!isFetching && !error && (forms.length > 0 ? <FormsList /> : <GetStarted />)}
    </Paper>
  );
};
