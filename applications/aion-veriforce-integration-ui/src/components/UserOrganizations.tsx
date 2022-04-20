import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { DeepReadonly } from 'utility-types';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IUserOrganization } from '@pec/aion-ui-core/interfaces/userOrganization';
import { Link } from '@pec/aion-ui-components/components/Link';
import { useTranslation } from 'react-i18next';

type Props = {
  userOrganizations: DeepReadonly<IUserOrganization[]>;
};

export const UserOrganizationsComponent: React.FC<Props> = ({ userOrganizations }) => {
  const { t } = useTranslation();

  return (
    <GridContainer>
      <Grid item xs={12}>
        <Typography variant="h6">
          {t('veriforceIntegration.userOrganizations.selectPecOrganization', 'Select a PEC organization')}
        </Typography>
        <List component="nav">
          {userOrganizations.map(({ id, name }) => (
            <ListItem key={id} disableGutters>
              <ListItemText>
                <Link to={`/${id}`}>{name}</Link>
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </Grid>
    </GridContainer>
  );
};
