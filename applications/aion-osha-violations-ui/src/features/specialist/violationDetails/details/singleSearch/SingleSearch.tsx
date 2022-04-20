import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import Radio from '@material-ui/core/Radio';
import SearchIcon from '@material-ui/icons/Search';
import Typography from '@material-ui/core/Typography';
import { DetailsGrid } from '../../detailsGrid/DetailsGrid';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchOrganizationViolation } from 'features/specialist/violationDetails/organizationViolation/slice';
import { Field, Form } from 'react-final-form';
import { IOrganizationViolation } from 'interfaces/organizationViolations';
import { ITableHeader } from '@pec/aion-ui-components/interfaces/tableHeader';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { merge, parse } from '@pec/aion-ui-core/helpers/querystring';
import { SerializedError } from '@reduxjs/toolkit';
import { TextField } from '@pec/aion-ui-form/components/TextField';
import { useAppDispatch } from 'app/reducer';
import { useHistory } from 'react-router';
import { useTheme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

type props = {
  violation: IOrganizationViolation[] | null;
  isFetching: boolean;
  error: SerializedError | null;
};

const useStyles = makeStyles((theme: Theme) => ({
  gridBody: {
    margin: '10px 0'
  },
  adornment: {
    color: theme.palette.grey[500]
  },
  fonts: { color: theme.palette.text.primary, fontSize: 16, fontWeight: 500 }
}));

export const SingleSearch: React.FC<props> = ({ violation, isFetching, error }) => {
  const classes = useStyles();
  const theme = useTheme();

  const dispatch = useAppDispatch();

  const history = useHistory();

  const { t } = useTranslation();

  const {
    location: { search }
  } = history;

  const { ssqid, organizationId } = parse(search) as { ssqid: string; organizationId: string };
  const getHeaders = (): ITableHeader[] => [
    {
      id: 'name',
      label: t('oshaViolations.common.veriforceCompanyName', 'Veriforce Company Name'),
      columnWidth: '33%'
    },
    { id: 'formattedAddress', label: t('oshaViolations.common.address', 'Address'), columnWidth: '33%' },
    { id: 'companyNumber', label: t('oshaViolations.common.ssqid', 'SSQID'), columnWidth: '34%' }
  ];

  const onSubmit = (value: any) => {
    const { SSQID } = value;
    const {
      location: { search }
    } = history;

    history.push({
      search: merge(search, { ssqid: SSQID, organizationId: '' })
    });

    dispatch(fetchOrganizationViolation(SSQID.trim()));
  };

  const onSelected = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const {
      location: { search }
    } = history;

    history.push({
      search: merge(search, { organizationId: (event.target as HTMLButtonElement).value, organizationViolationsId: '' })
    });
  };

  return (
    <Grid container direction="column" spacing={2} className={classes.gridBody}>
      <Grid container alignItems="center">
        <Radio
          checked={organizationId && violation?.length ? organizationId === violation[0].id : false}
          color="primary"
          onClick={onSelected}
          value={violation ? violation[0].id : ''}
          name="radio-button"
        />
        <Typography
          variant="subtitle1"
          className={classes.fonts}
          style={
            organizationId && violation?.length && organizationId === violation[0].id
              ? { color: theme.palette.primary.main }
              : undefined
          }
        >
          Other
        </Typography>
      </Grid>
      <Grid item style={{ marginLeft: 40 }}>
        <Form
          onSubmit={onSubmit}
          initialValues={{ SSQID: ssqid }}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Grid item xs={12} md={3}>
                <Field<string>
                  name="SSQID"
                  size="small"
                  component={TextField}
                  variant="filled"
                  required
                  placeholder={t('oshaViolations.common.ssqid', 'SSQID')}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon className={classes.adornment} />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
            </form>
          )}
        />
      </Grid>
      {error ? (
        <Error message={t('oshaViolations.common.thereWasAnError', 'There was an error processing your request.')} />
      ) : isFetching ? (
        <Loading />
      ) : violation ? (
        <Grid item>
          <DetailsGrid
            tableTitle="VeriforceInformation"
            option={violation[0]}
            headers={getHeaders()}
            currentSelected={organizationId}
          />
        </Grid>
      ) : null}
    </Grid>
  );
};
