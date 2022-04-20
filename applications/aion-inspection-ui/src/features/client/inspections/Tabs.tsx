import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { ScreenSize } from '@pec/aion-ui-components/types/screenSize';
import { TabLink } from '@pec/aion-ui-components/components/TabLink';
import { useParams } from 'react-router-dom';
import { useScreenSize } from '@pec/aion-ui-components/hooks/useScreenSize';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: ({ smallDown }: ScreenSize) => ({
      padding: theme.spacing(0, 4),
      [smallDown]: {
        padding: theme.spacing(1.5, 0, 0),
        borderBottom: `1px solid ${theme.palette.divider}`,
        position: 'sticky',
        backgroundColor: theme.palette.common.white,
        'z-index': 1,
        top: 56
      }
    }),
    tabLink: ({ smallDown }: ScreenSize) => ({
      padding: theme.spacing(2, 8),
      margin: 'none',
      color: theme.palette.grey[600],
      textDecoration: 'none',
      [smallDown]: {
        flexGrow: 1,
        textAlign: 'center',
        padding: theme.spacing(1, 2)
      }
    })
  })
);

export const Tabs: React.FC = () => {
  const { smallDown } = useScreenSize();
  const classes = useStyles({ smallDown });
  const { organizationId } = useParams<{ organizationId: string }>();

  return (
    <Toolbar className={classes.root}>
      <TabLink label="My Reviews" to={`/${organizationId}/my-reviews`} className={classes.tabLink} />
      <TabLink label="All Reviews" to={`/${organizationId}/reviews`} className={classes.tabLink} />
    </Toolbar>
  );
};
