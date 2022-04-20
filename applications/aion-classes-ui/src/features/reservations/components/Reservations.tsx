import * as React from 'react';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { DeepReadonly } from 'utility-types';
import { IReservation, ReservationStatus } from '@pec/aion-ui-core/interfaces/reservation';
import { Link } from '@pec/aion-ui-components/components/Link';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { localizeDate } from '@pec/aion-ui-i18next/helpers/localize';
import { useTranslation } from 'react-i18next';

const { Active, Cancelled } = ReservationStatus;

const styles = (theme: Theme) => ({
  emptyRow: {
    backgroundColor: theme.palette.grey[200],
    height: 200
  },
  active: {
    color: theme.palette.success.main
  },
  cancelled: {
    color: theme.palette.grey[300]
  },
  reservationRow: {
    verticalAlign: 'top'
  }
});

type OwnProps = {
  classId: string;
  reservations: DeepReadonly<IReservation[]>;
};

type Props = WithStyles<typeof styles> & OwnProps;

const Component: React.FC<Props> = ({ classes, classId, reservations }) => {
  const { t } = useTranslation();

  return (
    <Table>
      <colgroup>
        <col style={{ width: '10%' }} />
        <col style={{ width: '20%' }} />
        <col style={{ width: '20%' }} />
        <col style={{ width: '10%' }} />
        <col style={{ width: '20%' }} />
        <col style={{ width: '20%' }} />
      </colgroup>
      <TableHead>
        <TableRow>
          <TableCell>{t('classes.reservations.seatsReserved', 'Seats Reserved')}</TableCell>
          <TableCell>{t('classes.common.organization', 'Organization')}</TableCell>
          <TableCell>{t('classes.reservations.contact', 'Contact')}</TableCell>
          <TableCell>{t('classes.reservations.created', 'Created')}</TableCell>
          <TableCell>{t('classes.reservations.associate', 'Associate')}</TableCell>
          <TableCell>{t('classes.reservations.comments', 'Comments')}</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {reservations.length > 0 ? (
          reservations.map(
            ({
              id,
              contact,
              organizationName,
              reservedSeatsCount,
              comment,
              createdBy,
              createdDateUtc,
              updatedBy,
              updatedDateUtc,
              status
            }) => (
              <TableRow key={id} hover className={classes.reservationRow}>
                <TableCell>
                  <Typography variant="body2" color={status === Cancelled ? 'textSecondary' : 'initial'}>
                    <span
                      className={status === Active ? classes.active : classes.cancelled}
                      style={{ marginRight: 8 }}
                      title={status}
                    >
                      ⬤
                    </span>
                    {reservedSeatsCount}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{organizationName}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" gutterBottom>
                    {contact.firstName} {contact.lastName}
                  </Typography>
                  <Typography variant="caption" display="block" color="textSecondary">
                    {contact.emailAddress}
                  </Typography>
                  <Typography variant="caption" display="block" color="textSecondary">
                    <a href={`tel:${contact.phoneNumber}`}>{contact.phoneNumber}</a>
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{localizeDate(createdDateUtc, t)}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" gutterBottom>
                    {createdBy.fullName}
                  </Typography>
                  {updatedBy && updatedDateUtc && (
                    <Typography variant="caption" display="block" color="textSecondary">
                      {t('classes.reservations.updatedBy', {
                        date: localizeDate(updatedDateUtc, t),
                        fullName: updatedBy.fullName,
                        defaultValue: 'Updated {{date}} by {{fullName}}'
                      })}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{comment}</Typography>
                </TableCell>
                <TableCell>
                  <Link
                    to={`${classId}/reservations/${id}/edit`}
                    title={t('classes.common.editReservation', 'Edit Reservation')}
                  >
                    <IconButton size="medium" aria-label={t('classes.common.editReservation', 'Edit Reservation')}>
                      <EditIcon />
                    </IconButton>
                  </Link>
                </TableCell>
              </TableRow>
            )
          )
        ) : (
          <TableRow className={classes.emptyRow}>
            <TableCell align="center" colSpan={6}>
              {t('classes.reservations.addFirstReservation', 'Add the first reservation for this class.')}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export const Reservations = withStyles(styles)(Component);
