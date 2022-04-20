import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { DetailsGrid } from '../../detailsGrid/DetailsGrid';
import { IOrganizationViolations } from 'interfaces/organizationViolations';
import { ITableHeader } from '@pec/aion-ui-components/interfaces/tableHeader';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

type props = {
  organization: IOrganizationViolations | null;
  selected: (id: string) => void;
  currentSelected: string;
};

const useStyles = makeStyles(() => ({
  gridBody: {
    margin: '10px 0'
  }
}));

export const OrganizationBody: React.FC<props> = ({ organization, selected, currentSelected }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const getHeaders = (): ITableHeader[] => [
    {
      id: 'companyName',
      label: t('oshaViolations.common.veriforceCompanyName', 'Veriforce Company Name'),
      columnWidth: '33%'
    },
    { id: 'companyFormattedAddress', label: t('oshaViolations.common.address', 'Address'), columnWidth: '33%' },
    { id: 'companyNumber', label: t('oshaViolations.common.ssqid', 'SSQID'), columnWidth: '34%' }
  ];

  return (
    <Grid className={classes.gridBody}>
      {organization && (
        <DetailsGrid
          tableTitle="VeriforceOrganizationInformation"
          option={organization}
          headers={getHeaders()}
          selected={selected}
          currentSelected={currentSelected}
        />
      )}
    </Grid>
  );
};
