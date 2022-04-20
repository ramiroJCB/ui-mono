import * as React from 'react';
import { AxiosError } from 'axios';
import { ContractorWorkGroupJobTypeEmployeeHeaderContainer } from '../containers/ContractorWorkGroupJobTypeEmployeeHeader';
import { DeepReadonly } from 'ts-essentials';
import { EmployeeInfoComponent } from './EmployeeInfo';
import { Error } from '@pec/aion-ui-components/components/Error';
import { Grid } from '@material-ui/core';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IWorkGroupJobTypeEmployee } from 'interfaces/workGroupJobTypeEmployee';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { useTranslation } from 'react-i18next';

type Props = {
  workGroupJobTypeEmployee: DeepReadonly<IWorkGroupJobTypeEmployee> | null;
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | null;
};

export const WorkGroupJobTypeEmployeeGeneralInfoComponent: React.FC<Props> = ({
  isFetching,
  workGroupJobTypeEmployee,
  error
}) => {
  const { t } = useTranslation();

  return !isFetching && workGroupJobTypeEmployee ? (
    <React.Fragment>
      <ContractorWorkGroupJobTypeEmployeeHeaderContainer />
      <GridContainer>
        <Grid item xs={12}>
          {workGroupJobTypeEmployee.employee && (
            <Paper>
              <EmployeeInfoComponent employee={workGroupJobTypeEmployee.employee} />
            </Paper>
          )}
        </Grid>
      </GridContainer>
    </React.Fragment>
  ) : error ? (
    <Error
      message={t('trainingCompliance.common.processingRequestError', 'There was an error processing your request.')}
    />
  ) : (
    <Loading />
  );
};
