import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import { AssignRemoveGlobalOrganizationFeature } from './AssignRemoveGlobalOrganizationFeature';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'utility-types';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IOrganizationFeature } from '@pec/aion-ui-core/interfaces/organization';
import { IOrganizationFeatureForm } from '../interfaces/organizationFeatureForm';
import { Message } from '@pec/aion-ui-components/components/Message';
import { useTranslation } from 'react-i18next';

const styles = () =>
  createStyles({
    container: {
      alignItems: 'center',
      justifyContent: 'flex-start'
    }
  });

type OwnProps = {
  organizationFeatures: DeepReadonly<IOrganizationFeature[]>;
  addGlobalOrganizationFeature: (orgType: IOrganizationFeatureForm) => Promise<void>;
  deleteGlobalOrganizationFeature: (orgFeature: IOrganizationFeatureForm) => Promise<void>;
};

type Props = OwnProps & WithStyles<typeof styles>;

const ManageGlobalOrganizationFeatures: React.FC<Props> = ({
  classes,
  organizationFeatures,
  addGlobalOrganizationFeature,
  deleteGlobalOrganizationFeature
}) => {
  const { t } = useTranslation();

  return (
    <GridContainer>
      <Grid item xs={12}>
        <Typography variant="h5">
          {t('backoffice.manageGlobal.manageGlobalFeatures', 'Manage Global Features')}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Message>
          <Typography variant="subtitle1">
            {t(
              'backoffice.manageGlobal.globallyAssign',
              'Globally assign a feature to, or it remove from, ALL organizations.'
            )}
          </Typography>
        </Message>
        <List dense>
          {organizationFeatures
            .filter(feature => feature.isLegacyFeature === false)
            .map(feature => (
              <ListItem key={feature.name}>
                <Grid container className={classes.container}>
                  <Grid item xs={8} sm={6} md={4} lg={3}>
                    <Typography variant="body1">{feature.friendlyName}</Typography>
                  </Grid>
                  <Grid item>
                    <AssignRemoveGlobalOrganizationFeature
                      form={`assignRemoveGlobalOrganizationFeatureForm-${feature.name}`}
                      feature={feature}
                      mode="assign"
                      onSubmit={addGlobalOrganizationFeature}
                      initialValues={{ feature, organizationType: null }}
                    />
                  </Grid>
                  <Grid item>
                    <AssignRemoveGlobalOrganizationFeature
                      form={`assignRemoveGlobalOrganizationFeatureForm-${feature.name}`}
                      feature={feature}
                      mode="remove"
                      onSubmit={deleteGlobalOrganizationFeature}
                      initialValues={{ feature, organizationType: null }}
                    />
                  </Grid>
                </Grid>
              </ListItem>
            ))}
        </List>
      </Grid>
    </GridContainer>
  );
};

export const ManageGlobalOrganizationFeaturesComponent = withStyles(styles)(ManageGlobalOrganizationFeatures);
