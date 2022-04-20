import * as React from 'react';
import Paper, { PaperProps } from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Error } from '@pec/aion-ui-components/components/Error';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { Option } from '@pec/aion-ui-form/types/autocompleteOption';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { localizeNumber } from '@pec/aion-ui-i18next/helpers/localize';

const styles = (theme: Theme) => ({
  popupFooter: {
    borderTop: `1px solid ${theme.palette.divider}`,
    // Matches hard-coded values of popup list items
    padding: '6px 16px'
  }
});

type OwnProps = {
  inputValue: string;
  searchTerm: string;
  loading: boolean;
  hasError: boolean;
  options?: Option[];
  total: number;
};

type Props = WithStyles<typeof styles> & PaperProps & OwnProps;

const Component: React.FC<Props> = ({
  inputValue,
  searchTerm,
  loading,
  hasError,
  options,
  total,
  classes,
  children,
  ...props
}) => {
  const { t } = useTranslation();

  return (
    <Paper {...props}>
      {loading ? (
        <Loading />
      ) : hasError ? (
        <Error />
      ) : (
        <React.Fragment>
          {children}
          {options && total > 0 && options.length < total && inputValue === searchTerm && (
            <Typography align="right" color="textSecondary" variant="body2" className={classes.popupFooter}>
              {t('safetyPrograms.filters.topResults', {
                options: localizeNumber(options.length, t),
                total: localizeNumber(total, t),
                defaultValue: 'Top {{options}} results of {{total}} total'
              })}
            </Typography>
          )}
        </React.Fragment>
      )}
    </Paper>
  );
};

export const AutocompletePopup = withStyles(styles)(Component);
