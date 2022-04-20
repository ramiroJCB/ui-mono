import * as React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { arrayIsEqual } from 'helpers/form';
import { CheckboxField } from '@pec/aion-ui-form/components/CheckboxField';
import { DeepReadonly } from 'ts-essentials';
import { Field } from 'react-final-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IBusinessUnit } from 'interfaces/businessUnit';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

type OwnProps = {
  businessUnits: DeepReadonly<IBusinessUnit[]>;
};

const styles = (theme: Theme) => ({
  container: {
    paddingLeft: theme.spacing(4)
  }
});

type Props = WithStyles<typeof styles> & OwnProps;

const Component: React.FC<Props> = ({ businessUnits, classes }) => {
  const { t } = useTranslation();

  return (
    <GridContainer spacing={0} className={classes.container}>
      {businessUnits.length > 0 ? (
        businessUnits.map(({ id, description }) => (
          <Grid key={id} item xs={6}>
            <FormControlLabel
              control={
                <Field<string>
                  type="checkbox"
                  name="businessUnitIds"
                  component={CheckboxField}
                  value={id}
                  isEqual={arrayIsEqual}
                />
              }
              label={description}
            />
          </Grid>
        ))
      ) : (
        <Grid item xs={12}>
          <Typography color="textSecondary">
            {t(
              'safetyPrograms.businessUnits.organizationHasNoBusinessUnits',
              'This organization has no business units. Please select another option.'
            )}
          </Typography>
        </Grid>
      )}
    </GridContainer>
  );
};

export const BusinessUnitsComponent = withStyles(styles)(Component);
