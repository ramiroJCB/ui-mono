import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { ActivityAction, ActivityResourceName } from '@pec/aion-ui-core/interfaces/activities';
import { Error } from '@pec/aion-ui-components/components/Error';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { hasPermission, fetchUserInfoIfNeeded } from '@pec/aion-ui-core/actions/userInfo';
import { ILinkResult } from 'interfaces/linkResult';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { resetCurrentOrganization } from '@pec/aion-ui-core/helpers/resetCurrentOrganization';
import { resolveAuthorizedOptions } from 'helpers/resolveAuthorizedOptions';
import { useParams } from 'react-router-dom';
import { UserInfoActivitiesType } from '@pec/aion-ui-core/interfaces/userInfo';
import { useTypedSelector } from '../reducer';
import { useTranslation } from 'react-i18next';
import { v4 } from 'uuid';

const { Organization, User } = UserInfoActivitiesType;

type Category = {
  name: string;
  results: ILinkResult[];
};

export const LinksSearch: React.FC = () => {
  const { organizationId } = useParams<{ organizationId: string }>();
  const { isFetching, error, userInfo } = useTypedSelector(state => state.userInfo);
  const [categories, setCategories] = React.useState([
    { name: '', results: [{ isAuthorized: false, title: '', href: '' }] }
  ]);
  const [value, setValue] = React.useState('');
  const { t, i18n } = useTranslation();

  const doesHavePermission = (action: ActivityAction, resourceName: ActivityResourceName) => {
    const scopes = [];
    if (organizationId) {
      scopes.push({ type: Organization, id: organizationId });
    }
    if (userInfo) {
      scopes.push({ type: User, id: userInfo.userId });
    }
    return hasPermission(userInfo, action, resourceName, scopes);
  };

  const authorizedOptions: Category[] = resolveAuthorizedOptions(doesHavePermission, t);

  const resetComponent = () => {
    setCategories(authorizedOptions);
    setValue(value);
  };

  const handleFormSubmit = () => {
    if (categories.length === 1 && categories[0].results.length === 1) {
      window.location.assign(categories[0].results[0].href);
    }
  };

  useEffect(() => {
    resetComponent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo, i18n.language]);

  useEffect(() => {
    if (!organizationId) {
      resetCurrentOrganization();
    }
    fetchUserInfoIfNeeded();
  }, [organizationId]);

  const handleSearchChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    setValue(value);

    if (value.length < 1) {
      return resetComponent();
    }

    const regex = new RegExp(value, 'i');
    setCategories(
      authorizedOptions
        .map((category: Category) => ({
          ...category,
          results: category.results.filter(({ title }: ILinkResult) => regex.test(title))
        }))
        .filter(({ results }) => results.length > 0)
    );
  };

  return !isFetching && userInfo ? (
    <GridContainer>
      <Grid item xs={12}>
        <Paper>
          <GridContainer>
            <Grid item xs={12}>
              <form onSubmit={handleFormSubmit}>
                <TextField
                  placeholder={t('links.search.searchFieldPlaceholder', 'Search for an Option')}
                  onChange={handleSearchChange}
                  autoFocus
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon />
                      </InputAdornment>
                    )
                  }}
                />
              </form>
            </Grid>
            <Grid item xs={12}>
              {categories.length > 0 ? (
                categories.map(({ name, results }) => (
                  <List
                    key={v4()}
                    component="nav"
                    subheader={
                      <ListSubheader disableSticky component="div">
                        {name}
                      </ListSubheader>
                    }
                  >
                    {results.map(({ title, href }) => (
                      <ListItem component="a" key={v4()} href={href} button>
                        <ListItemText>{title}</ListItemText>
                      </ListItem>
                    ))}
                  </List>
                ))
              ) : (
                <Typography>{t('links.search.noOptions', 'No options were found.')}</Typography>
              )}
            </Grid>
          </GridContainer>
        </Paper>
      </Grid>
    </GridContainer>
  ) : error ? (
    <Error message={t('links.search.errorMessage', 'There was an error processing your request.')} />
  ) : (
    <Loading />
  );
};
