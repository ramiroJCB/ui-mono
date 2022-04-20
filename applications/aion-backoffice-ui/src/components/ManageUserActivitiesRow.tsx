import * as React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

const styles = (theme: Theme) =>
  createStyles({
    cell: {
      fontSize: 14
    },
    actionCell: {
      width: theme.spacing(8),
      boxSizing: 'content-box'
    },
    disabled: {
      background: theme.palette.grey[100]
    }
  });

type OwnProps = {
  resourceName: string;
  isLegacyResource: boolean;
  isOverride: boolean;
  actionName: string;
  handleLevelChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  level: number;
  handleAuditClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleOverrideClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  canAudit: boolean;
};

type Props = WithStyles<typeof styles> & OwnProps;

const ManageUserActivitiesRow: React.FC<Props> = ({
  resourceName,
  isLegacyResource,
  isOverride,
  actionName,
  handleLevelChange,
  level,
  handleAuditClick,
  handleOverrideClick,
  canAudit,
  classes
}) => {
  const { t } = useTranslation();

  return (
    <TableRow key={resourceName} className={isLegacyResource ? classes.disabled : undefined}>
      <TableCell className={classes.cell} align="right">
        {resourceName}
      </TableCell>
      <TableCell className={`${classes.cell} ${classes.actionCell}`} align="center">
        {actionName}
      </TableCell>
      <TableCell colSpan={4} style={{ borderLeft: 'none' }}>
        <input
          type="range"
          min="0"
          max="3"
          disabled={isLegacyResource && !isOverride}
          style={{ width: '88%', marginLeft: '2%' }}
          onInput={handleLevelChange}
          defaultValue={level.toString()}
        />
      </TableCell>
      <TableCell className={classes.cell} align="center">
        <FormControlLabel
          control={<Checkbox checked={canAudit} onClick={handleAuditClick} disabled={isLegacyResource} />}
          label={t('backoffice.manageUserActivitiesRow.audit', 'Audit')}
        />
      </TableCell>
      <TableCell className={classes.cell} align="center">
        <FormControlLabel
          control={<Checkbox checked={isOverride} onClick={handleOverrideClick} disabled={!isLegacyResource} />}
          label={t('backoffice.manageUserActivitiesRow.override', 'Override')}
        />
      </TableCell>
    </TableRow>
  );
};

export default withStyles(styles)(ManageUserActivitiesRow);
