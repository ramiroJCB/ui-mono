import Paper from '@material-ui/core/Paper';
import React from 'react';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { Grid, Typography, withStyles, WithStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

type OwnProps = {
  organizationId: string;
  path: string;
};

const styles = {
  container: {
    margin: '0px -8px 8px -8px'
  },
  title: {
    margin: '20px 15px 15px 15px'
  }
};

type Props = OwnProps & WithStyles;

const Header: React.FC<Props> = ({ organizationId, path, classes }) => {
  const { t } = useTranslation();
  return (
    <Paper square className={classes.container}>
      <Grid container>
        <Grid item xs={12} md={12} className={classes.title}>
          <Typography variant="h6">{t('employee.header.employeeManagement', 'Employee Management')}</Typography>
        </Grid>
        <Tabs value={path === '/:organizationId/employees' ? 0 : 1} indicatorColor="primary" textColor="primary">
          <Tab
            label={t('employee.header.allLinkedEmployees', 'All linked employees')}
            component={Link}
            to={`/${organizationId}/employees`}
          />
          <Tab
            label={t('employee.header.linkEmployees', 'Link employees')}
            component={Link}
            to={`/${organizationId}/employees/link`}
          />
        </Tabs>
      </Grid>
    </Paper>
  );
};

export default withStyles(styles)(Header);
