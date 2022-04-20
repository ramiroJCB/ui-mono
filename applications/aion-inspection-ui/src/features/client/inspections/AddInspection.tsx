import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import React from 'react';
import { addInspection } from '../../inspections/slice';
import { BackTitleHeader } from 'common/components/BackTitleHeader';
import { IInspectionForm } from 'interfaces/inspection';
import { InspectionForm } from './InspectionForm';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch } from 'app/reducer';
import { useHistory, useParams } from 'react-router-dom';

const today = moment().utc();
const useStyles = makeStyles((theme: Theme) => ({
  item: {
    padding: theme.spacing(2)
  },
  secondaryAction: {
    right: 8
  }
}));

export const AddInspection: React.FC = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const { organizationId } = useParams<{ organizationId: string }>();
  const history = useHistory();

  const initialValues: IInspectionForm = {
    organizationId,
    contractorId: '',
    formId: '',
    businessUnitId: '',
    dateOfInspectionUtc: today
  };

  const onSubmit = (values: IInspectionForm) =>
    new Promise<void>(async (resolve, reject) => {
      try {
        const payload = await dispatch(
          addInspection({ ...values, businessUnitId: values.businessUnitId === 'none' ? null : values.businessUnitId })
        );

        const { id } = unwrapResult(payload);

        history.push(`/${organizationId}/reviews/${id}`);
        resolve();
      } catch (error) {
        reject(error);
      }
    });

  return (
    <React.Fragment>
      <Grid container item classes={{ root: classes.item }}>
        <BackTitleHeader linkTitle="Back To Reviews" to={`/${organizationId}/reviews`}>
          New Review
        </BackTitleHeader>
      </Grid>
      <Divider />
      <Grid container>
        <Grid item xs={12} md={6} classes={{ root: classes.item }}>
          <InspectionForm initialValues={initialValues} onSubmit={onSubmit} />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
