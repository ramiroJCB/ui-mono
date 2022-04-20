import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IOrganization } from '@pec/aion-ui-core/interfaces/organization';
import { Link } from '@pec/aion-ui-components/components/Link';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

const styles = (theme: Theme) => ({
  linkText: {
    color: theme.palette.secondary.main
  }
});

type OwnProps = {
  organizations: IOrganization[] | null;
  uri: string;
  emptyMessage: string;
};

type Props = WithStyles<typeof styles> & OwnProps;

const Results: React.FC<Props> = ({ organizations, uri, emptyMessage, classes }) => {
  const { t } = useTranslation();

  return (
    <GridContainer style={{ marginTop: 20 }} direction="column" spacing={0}>
      <Grid item xs={12}>
        <Typography variant="h6" align="center">
          {t('registration.results.searchResults', 'Search results')}
        </Typography>
        {organizations && organizations.length ? (
          organizations.map(organization => {
            const { id, name } = organization;
            return (
              <ListItem key={id} button>
                <Typography className={classes.linkText} variant="body1" component={Link} to={uri.replace('%s', id)}>
                  {name}
                </Typography>
              </ListItem>
            );
          })
        ) : (
          <Typography variant="body1" style={{ marginTop: '0.5em', color: 'red' }}>
            {emptyMessage}
          </Typography>
        )}
      </Grid>
    </GridContainer>
  );
};

export default withStyles(styles)(Results);
