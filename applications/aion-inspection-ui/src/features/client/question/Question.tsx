import Grid from '@material-ui/core/Grid';
import React, { useEffect } from 'react';
import { fetchAnswers } from '../answers/slice';
import { fetchQuestions } from 'features/questions/slice';
import { MobileQuestion } from './MobileQuestion';
import { useAppDispatch } from 'app/reducer';
import { useParams } from 'react-router-dom';
import { useScreenSize } from '@pec/aion-ui-components/hooks/useScreenSize';

export const Question: React.FC = () => {
  const { isLargeUp } = useScreenSize();
  const dispatch = useAppDispatch();
  const { organizationId, inspectionId, sectionId } = useParams<{
    organizationId: string;
    inspectionId: string;
    sectionId: string;
  }>();

  useEffect(() => {
    dispatch(fetchQuestions({ organizationId, sectionId }));
    dispatch(fetchAnswers({ organizationId, sectionId }));
  }, [dispatch, organizationId, sectionId, inspectionId]);

  return (
    <Grid container>
      <Grid item xs={12}>
        {isLargeUp ? <p>In another story</p> : <MobileQuestion />}
      </Grid>
    </Grid>
  );
};
