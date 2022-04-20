import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Typography from '@material-ui/core/Typography';
import { ConfirmRemoveButton } from 'components/ConfirmRemoveButton';
import { InfoCardContent } from './InfoCardContent';
import { InfoCardIcon } from './InfoCardIcon';
import { Link } from '@pec/aion-ui-components/components/Link';
import { LocationDescriptor } from 'history';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';

export const styles = (theme: Theme) => ({
  card: {
    width: '100%',
    height: 90,
    margin: 12,
    [theme.breakpoints.down('sm')]: {
      maxWidth: 'none'
    },
    [theme.breakpoints.up('md')]: {
      maxWidth: 350
    }
  },
  cardWithSubtitle: {
    width: '100%',
    height: 115,
    margin: 12,
    [theme.breakpoints.down('sm')]: {
      maxWidth: 'none'
    },
    [theme.breakpoints.up('md')]: {
      maxWidth: 350
    }
  },
  cardWithSecondaryTitle: {
    width: '100%',
    height: 130,
    margin: 12,
    [theme.breakpoints.down('sm')]: {
      maxWidth: 'none'
    },
    [theme.breakpoints.up('md')]: {
      maxWidth: 350
    }
  },
  title: {
    fontSize: 14,
    marginLeft: theme.spacing(0.5)
  },
  cardHeader: {
    display: 'flex',
    paddingTop: 16,
    paddingLeft: 22,
    paddingBottom: 0
  },
  iconBtn: {
    padding: 3
  },
  iconContainer: {
    display: 'flex',
    fontSize: 16
  }
});

type OwnProps = {
  cardType: string;
  name: string;
  secondaryTitle?: string;
  subtitle?: string | JSX.Element;
  to?: LocationDescriptor;
  withMenu?: boolean;
  handleDelete?: () => Promise<void>;
  variant?: 'contractor' | 'workGroup' | 'customTraining' | 'standardTraining' | 'jobType' | 'employee';
};

type Props = OwnProps & WithStyles<typeof styles> & I18nextProps;

type State = {
  anchorEl: HTMLButtonElement | null;
};

class InfoCardComponent extends React.PureComponent<Props, State> {
  state: State = {
    anchorEl: null
  };

  openMenu = (event: React.MouseEvent<HTMLButtonElement>) => this.setState({ anchorEl: event.currentTarget });

  closeMenu = () => this.setState({ anchorEl: null });

  render() {
    const { classes, cardType, name, subtitle, withMenu, handleDelete, variant, to, secondaryTitle, t } = this.props;
    const { anchorEl } = this.state;

    return (
      <React.Fragment>
        <Card
          className={
            secondaryTitle ? classes.cardWithSecondaryTitle : subtitle ? classes.cardWithSubtitle : classes.card
          }
        >
          {withMenu && (
            <CardHeader
              className={classes.cardHeader}
              title={
                <div className={classes.iconContainer}>
                  <InfoCardIcon variant={variant} />
                  <Typography variant="body2" className={classes.title} color="textSecondary" gutterBottom noWrap>
                    {cardType}
                  </Typography>
                </div>
              }
              action={
                <IconButton
                  className={classes.iconBtn}
                  aria-owns={anchorEl ? 'menu-list' : undefined}
                  aria-haspopup="true"
                  onClick={this.openMenu}
                >
                  <MoreVertIcon />
                </IconButton>
              }
            />
          )}
          {to ? (
            <CardActionArea component={Link} to={to} title={name}>
              <InfoCardContent
                cardType={cardType}
                name={name}
                secondaryTitle={secondaryTitle}
                subtitle={subtitle}
                withMenu={withMenu}
                variant={variant}
              />
            </CardActionArea>
          ) : (
            <InfoCardContent
              cardType={cardType}
              secondaryTitle={secondaryTitle}
              name={name}
              subtitle={subtitle}
              withMenu={withMenu}
              variant={variant}
            />
          )}
        </Card>
        {withMenu && handleDelete && (
          <Menu id="menu-list" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={this.closeMenu}>
            <MenuItem>
              <ConfirmRemoveButton
                title={t('trainingCompliance.components.unassign', 'Unassign')}
                message={t('trainingCompliance.common.unassignItemConfirmation', {
                  name,
                  defaultValue: "Are you sure you'd like to unassign {{name}}?"
                })}
                handleDelete={handleDelete}
                defaultButtonStyle
              />
            </MenuItem>
          </Menu>
        )}
      </React.Fragment>
    );
  }
}

export const InfoCard = withStyles(styles)(withTranslation()(InfoCardComponent));
