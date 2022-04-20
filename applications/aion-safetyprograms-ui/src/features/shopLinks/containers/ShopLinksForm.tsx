import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { Breadcrumbs } from 'components/Breadcrumbs';
import { DeepReadonly } from 'ts-essentials';
import { FormApi } from 'final-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { IEditShopLinksForm, ISafetyProgram } from 'interfaces/safetyProgram';
import { ShopLinksForm } from '../components/ShopLinksForm';
import { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';

type Props = {
  handleHeaderClick: (orderby: string) => () => void;
  orderby: string;
  isFetching: boolean;
  safetyPrograms: DeepReadonly<ISafetyProgram[]> | null;
  onSubmit: (values: IEditShopLinksForm, form: FormApi<IEditShopLinksForm>) => Promise<void>;
  error: DeepReadonly<AxiosError> | null;
};

export const ShopLinksFormContainer: React.FC<Props> = ({
  isFetching,
  error,
  safetyPrograms,
  onSubmit,
  orderby,
  handleHeaderClick
}) => {
  const { t } = useTranslation();
  return (
    <GridContainer>
      <Grid item xs={12}>
        <Breadcrumbs
          links={[
            {
              to: '/safety-programs',
              children: t('safetyPrograms.common.programEditor', 'Program Editor')
            },
            {
              to: `/safety-programs/edit-shop-links`,
              children: t('safetyPrograms.common.editShopLinks', 'Edit Shop Links')
            }
          ]}
        />
      </Grid>
      <Grid item xs={12}>
        <Paper hasError={!!error} isLoading={isFetching}>
          <GridContainer style={{ padding: 0 }}>
            <Grid item xs={12}>
              {!isFetching && safetyPrograms && (
                <ShopLinksForm
                  handleHeaderClick={handleHeaderClick}
                  orderby={orderby}
                  onSubmit={onSubmit}
                  safetyPrograms={safetyPrograms}
                  initialValues={{
                    safetyProgramIds: safetyPrograms.filter(x => x.showShopLink).map(x => x.id)
                  }}
                  submitButtonText={t('safetyPrograms.shopLinks.saveChanges', 'Save Changes')}
                />
              )}
            </Grid>
          </GridContainer>
        </Paper>
      </Grid>
    </GridContainer>
  );
};
