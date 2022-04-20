import * as React from 'react';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Typography from '@material-ui/core/Typography';
import { NavLink, Props as NavLinkProps } from './NavLink';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';

type OwnProps = {
  links: NavLinkProps[];
};

const styles = (theme: Theme) => ({
  icon: {
    verticalAlign: 'middle'
  },
  link: {
    color: theme.palette.text.primary,
    '&.active': {
      fontWeight: 500,
      color: theme.palette.text.primary
    },
    '& svg': {
      verticalAlign: 'top'
    }
  }
});

type Props = WithStyles<typeof styles> & OwnProps;

const Component: React.FC<Props> = ({ links, classes }) => (
  <Typography display="inline">
    {links.map((props, i) => (
      <React.Fragment key={props.to.toString()}>
        {i > 0 && <ChevronRightIcon className={classes.icon} />}
        <NavLink exact {...props} className={classes.link} />
      </React.Fragment>
    ))}
  </Typography>
);

export const Breadcrumbs = withStyles(styles)(Component);
