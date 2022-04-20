import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { capitalizeFirstLetter } from '@pec/aion-ui-core/helpers/string';
import { DetailsGrid } from '../detailsGrid/DetailsGrid';
import { Error } from '@pec/aion-ui-components/components/Error';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { ITableHeader } from '@pec/aion-ui-components/interfaces/tableHeader';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { OrganizationBody } from './organizationBody/OrganizationBody';
import { SingleSearch } from './singleSearch/SingleSearch';
import { useTypedSelector } from 'app/reducer';
import { merge, parse } from '@pec/aion-ui-core/helpers/querystring';
import { useHistory } from 'react-router';
import { useTheme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

type props = {
  status: string;
};

export const Details: React.FC<props> = ({ status }) => {
  const history = useHistory();
  const theme = useTheme();
  const { t } = useTranslation();

  const {
    location: { search }
  } = history;
  const { organizationViolationsId } = parse(search) as { organizationViolationsId: string };

  const { violation: oshaViolation, isFetching: isFetchingOsha, error: oshaError } = useTypedSelector(
    state => state.oshaViolation
  );
  const {
    violation: organizationViolations,
    isFetching: isFetchingOrganizationViolations,
    error: organizationViolationsError
  } = useTypedSelector(state => state.organizationViolations);
  const {
    violation: organizationViolation,
    isFetching: isFetchingOrganizationViolation,
    error: organizationViolationError
  } = useTypedSelector(state => state.organizationViolation);

  const isFetching = isFetchingOsha || isFetchingOrganizationViolations;

  const error = oshaError || organizationViolationsError;

  const headers: ITableHeader[] = [
    {
      id: 'oshaCompanyName',
      label: t('oshaViolations.details.oshaCompanyName', 'OSHA Company Name'),
      columnWidth: '33%'
    },
    { id: 'formattedAddress', label: t('oshaViolations.common.address', 'Address'), columnWidth: '66%' }
  ];

  const handleSelected = (id: string) => {
    const {
      location: { search }
    } = history;

    history.push({
      search: merge(search, { organizationViolationsId: id, organizationId: '' })
    });
  };

  React.useEffect(() => {
    if (
      status === 'associated' &&
      !organizationViolationsId &&
      organizationViolations?.length &&
      oshaViolation?.length
    ) {
      history.replace({
        search: merge(search, {
          organizationViolationsId: oshaViolation[0].associatedOrganizationViolationId as string
        })
      });
    }
  }, [history, organizationViolations, organizationViolationsId, oshaViolation, search, status]);

  return (
    <GridContainer style={{ borderBottom: `1px solid ${theme.palette.grey[300]}` }}>
      <Grid xs={12}>
        <Typography variant="h4" gutterBottom>
          {t('oshaViolations.details.review', {
            defaultValue: 'Review {{capStatus}} {{otherStatus}}',
            capStatus: capitalizeFirstLetter(status),
            otherStatus:
              status === 'other'
                ? t('oshaViolations.common.violation', 'Violation')
                : t('oshaViolations.common.match', 'Match')
          })}
        </Typography>
        {!isFetching ? (
          <>
            <Grid xs={12}>
              {oshaViolation && (
                <DetailsGrid tableTitle="OshaInformation" option={oshaViolation[0]} headers={headers} />
              )}
            </Grid>

            {status !== 'other' &&
              organizationViolations?.map((organization, index) => (
                <Grid xs={12} key={index}>
                  <OrganizationBody
                    organization={organization}
                    selected={handleSelected}
                    currentSelected={organizationViolationsId}
                  />
                </Grid>
              ))}
            {status !== 'associated' && (
              <Grid xs={12}>
                <SingleSearch
                  violation={organizationViolation}
                  isFetching={isFetchingOrganizationViolation}
                  error={organizationViolationError}
                />
              </Grid>
            )}
          </>
        ) : error ? (
          <Grid item xs={12}>
            {error ? (
              <Error
                message={t('oshaViolations.common.thereWasAnError', 'There was an error processing your request.')}
              />
            ) : (
              <Loading />
            )}
          </Grid>
        ) : (
          <Loading />
        )}
      </Grid>
    </GridContainer>
  );
};
