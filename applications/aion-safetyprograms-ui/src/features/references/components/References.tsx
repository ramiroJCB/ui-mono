import * as React from 'react';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IReference } from 'interfaces/reference';
import { Link } from 'react-router-dom';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { WrappingLink } from '@pec/aion-ui-components/components/WrappingLink';
import { useTranslation } from 'react-i18next';

const styles = (theme: Theme) => ({
  reference: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    cursor: 'pointer',
    '&:hover': {
      background: theme.palette.action.hover
    }
  }
});

type OwnProps = {
  references: DeepReadonly<IReference[]> | null;
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | null;
  organizationId: string;
  safetyProgramRequirementId: string;
  questionAnswerId: string;
  isReadOnly: boolean;
};

type Props = WithStyles<typeof styles> & OwnProps;

const Component: React.FC<Props> = ({
  references,
  isFetching,
  error,
  organizationId,
  safetyProgramRequirementId,
  questionAnswerId,
  isReadOnly,
  classes
}) => {
  const { t } = useTranslation();

  return (
    <Paper hasError={!!error} isLoading={isFetching} variant="outlined" style={{ padding: 0 }}>
      <GridContainer>
        <Grid item xs={12}>
          <Typography variant="subtitle2">{t('safetyPrograms.references.documentation', 'Documentation')}</Typography>
        </Grid>
        {references &&
          (references.length > 0 ? (
            <Grid item xs={12} style={{ padding: 0 }}>
              {references.map(({ id, pageNumber, documentMetadata: { fileName } }) => (
                <WrappingLink
                  key={id}
                  to={
                    organizationId
                      ? `/organizations/${organizationId}/safety-program-requirements/${safetyProgramRequirementId}/answers/${questionAnswerId}/references/${id}`
                      : `/safety-program-requirements/${safetyProgramRequirementId}/answers/${questionAnswerId}/references/${id}`
                  }
                >
                  <GridContainer className={classes.reference} wrap="nowrap">
                    <Grid item zeroMinWidth xs={9}>
                      <Typography noWrap title={fileName}>
                        {fileName}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography>
                        {t('safetyPrograms.references.page', {
                          pageNumber,
                          defaultValue: 'p. {{pageNumber}}'
                        })}
                      </Typography>
                    </Grid>
                  </GridContainer>
                </WrappingLink>
              ))}
            </Grid>
          ) : (
            isReadOnly && (
              <Grid item xs={12}>
                <Typography color="textSecondary">
                  {t('safetyPrograms.references.noDocumentationProvided', 'No documentation has been provided.')}
                </Typography>
              </Grid>
            )
          ))}
        {!isReadOnly && (
          <Grid item xs={12}>
            <Button
              component={Link}
              to={`/organizations/${organizationId}/safety-program-requirements/${safetyProgramRequirementId}/answers/${questionAnswerId}/references/add`}
            >
              <AddIcon />
              {t('safetyPrograms.common.addDocumentation', 'Add Documentation')}
            </Button>
          </Grid>
        )}
      </GridContainer>
    </Paper>
  );
};

export const ReferencesComponent = withStyles(styles)(Component);
