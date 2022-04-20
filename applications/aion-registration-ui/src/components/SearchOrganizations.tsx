import * as React from 'react';
import AddCompanyContainer from '../containers/AddCompany';
import Grid from '@material-ui/core/Grid';
import Search from './Search';
import Typography from '@material-ui/core/Typography';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { History } from 'history';
import { Page } from './Page';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

const styles = (theme: Theme) => ({
  search: {
    [theme.breakpoints.up('md')]: {
      borderRight: `1px solid ${theme.palette.divider}`
    },
    [theme.breakpoints.down('sm')]: {
      borderBottom: `1px solid ${theme.palette.divider}`
    }
  }
});

type OwnProps = {
  searchTerm?: string;
  history: History;
};

type Props = WithStyles<typeof styles> & OwnProps;

const SearchOrganizations: React.FC<Props> = ({ classes, searchTerm, history, children }) => {
  const { t } = useTranslation();

  return (
    <Page title={t('registration.searchOrganizations.employmentInformation', 'Employment Information')}>
      <GridContainer>
        <Grid item xs={12} md={6} className={classes.search}>
          <Typography variant="h6" align="center">
            {t('registration.searchOrganizations.findYourEmployer', 'Find your Employer')}
          </Typography>
          <Search
            searchTerm={searchTerm ? searchTerm : ''}
            label={t('registration.searchOrganizations.companyName', 'Company Name')}
            uri="/companies/search/%s"
            history={history}
          >
            {children}
          </Search>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" align="center">
            {t('registration.searchOrganizations.cantFindEmployer', "Can't find your Employer?")}
          </Typography>
          <AddCompanyContainer history={history} />
        </Grid>
      </GridContainer>
    </Page>
  );
};

export default withStyles(styles)(SearchOrganizations);
