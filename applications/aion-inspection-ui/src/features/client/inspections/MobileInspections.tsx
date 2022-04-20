import AddIcon from '@material-ui/icons/Add';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { AutoSizer, List, ListRowProps, WindowScroller } from 'react-virtualized';
import { CurrentStatus } from 'interfaces/inspection';
import { Error } from '@pec/aion-ui-components/components/Error';
import { FloatingActionButton } from '@pec/aion-ui-components/components/FloatingActionButton';
import { inspectionsSelectors } from '../../inspections/slice';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Tabs } from './Tabs';
import { useParams } from 'react-router-dom';
import { usePermission } from 'common/hooks/usePermission';
import { useTheme } from '@material-ui/core/styles';
import { useTypedSelector } from 'app/reducer';
import { WrappingLink } from '@pec/aion-ui-components/components/WrappingLink';

export const maxCount = 100;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2)
  },
  item: {
    paddingTop: theme.spacing(2)
  },
  greyText: {
    color: theme.palette.grey[700]
  },
  noReviews: {
    padding: theme.spacing(0, 1)
  }
}));

export const MobileInspections: React.FC = () => {
  const { hasContractorReviewsManagePermission } = usePermission();
  const classes = useStyles();
  const theme = useTheme();
  const { organizationId } = useParams<{ organizationId: string }>();
  const { isFetching, error } = useTypedSelector(state => state.inspections);
  const inspections = useTypedSelector(inspectionsSelectors.selectAll);

  const rowRenderer = () => ({ key, index, style }: ListRowProps) => {
    const dateOfInspection = new Date(inspections[index].dateOfInspectionUtc);

    return index < maxCount ? (
      <div key={key} style={style}>
        <WrappingLink to={`/${organizationId}/reviews/${inspections[index].id}`}>
          <Grid container classes={{ root: classes.root }}>
            <Grid item xs={3}>
              <Typography variant="body2" className={classes.greyText}>
                {inspections[index].displayId}
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography variant="body2" align="right" className={classes.greyText}>
                {`${dateOfInspection.toLocaleDateString()} •`}{' '}
                <span
                  style={{
                    color:
                      inspections[index].status === CurrentStatus.InProgress
                        ? theme.palette.error.dark
                        : theme.palette.secondary.main
                  }}
                >
                  {inspections[index].status === CurrentStatus.InProgress ? 'In Progress' : 'Submitted'}
                </span>
              </Typography>
            </Grid>
            <Grid item xs={12} classes={{ root: classes.item }}>
              <Typography variant="body1">{inspections[index].formName}</Typography>
              <Typography variant="body1" noWrap title={inspections[index].contractorName}>
                {inspections[index].contractorName}
              </Typography>
            </Grid>
          </Grid>
        </WrappingLink>
        <Divider />
      </div>
    ) : (
      <Grid item xs={12} key={key} style={style}>
        <Typography variant="body1">Refine search criteria to see more results</Typography>
      </Grid>
    );
  };

  return (
    <React.Fragment>
      <Tabs />
      {!isFetching && inspections.length ? (
        <Grid container>
          <Grid item xs={12}>
            <AutoSizer style={{ height: 'auto' }}>
              {({ width }) => (
                <WindowScroller>
                  {({ height, isScrolling, onChildScroll, scrollTop }) => (
                    <List
                      style={{ outline: 'none' }}
                      height={height}
                      autoHeight
                      width={width}
                      isScrolling={isScrolling}
                      onScroll={onChildScroll}
                      scrollTop={scrollTop}
                      rowHeight={117}
                      rowCount={inspections.length}
                      rowRenderer={rowRenderer()}
                    />
                  )}
                </WindowScroller>
              )}
            </AutoSizer>
          </Grid>
        </Grid>
      ) : !isFetching && inspections.length === 0 ? (
        <Typography variant="subtitle1" align="center" className={classes.noReviews}>
          No reviews found. <br /> Use the button in the bottom right to start creating reviews.
        </Typography>
      ) : error ? (
        <Error message="There was an error processing your request." />
      ) : (
        <Loading />
      )}
      {hasContractorReviewsManagePermission && (
        <FloatingActionButton to={`/${organizationId}/reviews/add`} icon={<AddIcon />} label="Create a Review" />
      )}
    </React.Fragment>
  );
};
