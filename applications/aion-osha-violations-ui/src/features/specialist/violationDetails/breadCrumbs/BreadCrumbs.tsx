import * as React from 'react';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Typography from '@material-ui/core/Typography';
import { clearUrl } from 'helpers/clearUrl';
import { CurrentStatus } from 'interfaces/oshaViolations';
import { Link } from '@pec/aion-ui-components/components/Link';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) => ({
  breadCrumbsIcon: { color: theme.palette.common.black },
  breadCrumbsFonts: { color: theme.palette.common.black, fontFamily: 'roboto', textDecoration: 'none' }
}));

type props = {
  status: CurrentStatus;
  companyName: string;
};
export const ViolationsBreadcrumbs: React.FC<props> = ({ status, companyName }) => {
  const classes = useStyles();
  const history = useHistory();
  const { t } = useTranslation();

  const handleBreadCrumbsClick = () => {
    const {
      location: { search }
    } = history;

    history.push({
      pathname: `/osha-violations/${status ?? 'pending'}`,
      search: clearUrl(search, true)
    });
  };

  return (
    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" className={classes.breadCrumbsIcon} />}>
      <Link
        color="inherit"
        onClick={handleBreadCrumbsClick}
        className={classes.breadCrumbsFonts}
        style={{ fontWeight: 400, cursor: 'pointer' }}
      >
        {t('oshaViolations.common.oshaViolationVerification', 'OSHA Violation Verification')}
      </Link>
      <Link color="inherit" className={classes.breadCrumbsFonts}>
        <Typography style={{ fontWeight: 500 }}>{companyName}</Typography>
      </Link>
    </Breadcrumbs>
  );
};
