import Paper from '@material-ui/core/Paper';
import React, { PropsWithChildren } from 'react';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Error } from '@pec/aion-ui-components/components/Error';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { SerializedError } from '@reduxjs/toolkit';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    popupFooter: {
      borderTop: `1px solid ${theme.palette.divider}`,
      // Matches hard-coded values of popup list items
      padding: '6px 16px'
    }
  })
);

type Props<T> = {
  isFetching: boolean;
  error: SerializedError | null;
  options: T[];
  total: number;
  inputValue?: string;
  searchTerm?: string;
};

export function AutocompletePaper<T>({
  children,
  isFetching,
  error,
  options,
  total,
  inputValue,
  searchTerm,
  ...props
}: PropsWithChildren<Props<T>>) {
  const classes = useStyles();

  return (
    <Paper {...props}>
      {isFetching ? (
        <Loading />
      ) : error ? (
        <Error />
      ) : (
        <React.Fragment>
          {children}
          {options && total > 0 && options.length < total && (
            <Typography align="right" color="textSecondary" variant="body2" className={classes.popupFooter}>
              Top {options.length.toLocaleString()} results of {total.toLocaleString()} total
            </Typography>
          )}
        </React.Fragment>
      )}
    </Paper>
  );
}
