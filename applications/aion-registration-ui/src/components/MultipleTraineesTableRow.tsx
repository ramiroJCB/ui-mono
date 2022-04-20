import * as React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import UserIcon from '@material-ui/icons/AccountBox';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { History } from 'history';
import { ITrainee } from '../interfaces/trainee';
import { localizeDate } from '@pec/aion-ui-i18next/helpers/localize';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';

type OwnProps = {
  trainee: ITrainee;
  history: History;
  handleRowClick: (trainee: ITrainee) => () => Promise<ITrainee>;
};

const styles = (theme: Theme) =>
  createStyles({
    tableRow: {
      cursor: 'pointer'
    },
    imgCell: {
      textAlign: 'center',
      padding: theme.spacing(2)
    },
    cell: {
      padding: theme.spacing(1)
    },
    updatedCell: {
      textAlign: 'right',
      paddingRight: theme.spacing(1)
    },
    img: {
      width: 42,
      height: 42,
      borderRadius: 10,
      display: 'inline-block',
      textAlign: 'center',
      lineHeight: '42px'
    },
    pic: {
      fontStyle: 'italic',
      color: '#BA423A',
      whiteSpace: 'nowrap'
    },
    avatar: {
      color: theme.palette.common.white,
      backgroundColor: '#ddd',
      fontSize: 26,
      position: 'relative',
      display: 'inline-flex',
      justifyConent: 'center',
      alignItems: 'center'
    },
    userIcon: {
      marginRight: 0
    }
  });

type Props = WithStyles<typeof styles> & OwnProps & I18nextProps;

type State = {
  hasImgError: boolean;
};

class MultipleTraineesTableRow extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasImgError: false
    };
  }

  handleImgError = () => {
    this.setState({ hasImgError: true });
  };

  render() {
    const { trainee, handleRowClick, classes, t } = this.props;
    const { firstName, lastName, organizationName, photoUrl, createdDate, updatedDate } = trainee;
    return (
      <TableRow hover onClick={handleRowClick(trainee)} className={classes.tableRow}>
        <TableCell className={classes.imgCell}>
          {photoUrl && !this.state.hasImgError ? (
            <img
              src={photoUrl}
              alt={`${firstName} ${lastName}`}
              className={`${classes.img} ${classes.pic}`}
              onError={this.handleImgError}
            />
          ) : (
            <span className={`${classes.img} ${classes.avatar}`}>
              <UserIcon className={classes.userIcon} />
            </span>
          )}
        </TableCell>
        <TableCell className={classes.cell}>
          {lastName && firstName ? `${lastName}, ${firstName}` : lastName || firstName}
        </TableCell>
        <TableCell className={classes.cell}>{organizationName}</TableCell>
        <TableCell className={classes.updatedCell}>
          {localizeDate(updatedDate ? updatedDate : createdDate, t)}
        </TableCell>
      </TableRow>
    );
  }
}

export default withStyles(styles)(withTranslation()(MultipleTraineesTableRow));
