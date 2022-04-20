import AddIcon from '@material-ui/icons/Add';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import React from 'react';
import Switch from '@material-ui/core/Switch';
import { addElementOption, elementOptionsSelectors } from '../formElementOptions/slice';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography
} from '@material-ui/core';
import { ComponentType, ComponentTypeDescription, IElement, IElementOption } from '../../interfaces/element';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { ElementIcon } from './ElementIcon';
import { ElementOptionsList } from '../formElementOptions/ElementOptionsList';
import { updateElement } from '../formElements/slice';
import { Field, Form } from 'react-final-form';
import { FormApi } from 'final-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { isEqual } from 'lodash';
import { required } from '@pec/aion-ui-core/validators';
import { TextField } from '@pec/aion-ui-form/components/TextField';
import { useAppDispatch, useTypedSelector } from 'app/reducer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      border: `1px solid ${theme.palette.divider}`,
      borderLeft: '5px solid #002E41',
      borderBottom: 'none',
      marginBottom: theme.spacing()
    },
    paper: {
      minWidth: 200
    },
    label: {
      fontSize: 12
    },
    addOptionButton: {
      padding: 0,
      fontWeight: 500,
      textTransform: 'none'
    }
  })
);

type Props = {
  element: IElement;
};

const { Checkbox, Radio, Select, FileUpload } = ComponentType;

export const ElementCard: React.FC<Props> = ({ element }) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const { component, description, isRequired, id } = element;

  const elementOptions: IElementOption[] = useTypedSelector(state =>
    elementOptionsSelectors.selectAll(state).filter(option => option.elementId === id)
  );

  const [expanded, setExpanded] = React.useState(description !== null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleExpandClick = () => {
    setExpanded(!expanded);
    handleClose();
  };

  const TextDivider = (
    <Box component="span" mx={2}>
      |
    </Box>
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddOption = async () => {
    if (elementOptions && id) {
      const option = {
        label: `Option ${elementOptions.length + 1}`,
        elementId: id
      };
      await dispatch(addElementOption(option));
    }
  };

  const handleIsRequired = async () => await dispatch(updateElement({ ...element, isRequired: !isRequired }));

  const handleFormBlur = (form: FormApi<IElement>) => async (_event: React.FocusEvent<HTMLFormElement>) => {
    const formState = form.getState();
    const isValid = formState.valid;
    const currentValues = formState.values;
    const hasNewValues = !isEqual(formState.initialValues, currentValues);

    if (hasNewValues && isValid) {
      await dispatch(updateElement(currentValues));
    }
  };

  const handleSubmit = (_values: IElement) => {};

  return (
    <Card className={classes.card}>
      <CardContent>
        <GridContainer alignItems="center" spacing={2} style={{ padding: 0 }}>
          <Grid item xs={12}>
            <Box display="flex" flexDirection="row" alignItems="center" fontSize={18}>
              <ElementIcon variant={component} />
              <Box ml={2} fontSize={12}>
                {ComponentTypeDescription.get(component)}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Form initialValues={element} onSubmit={handleSubmit}>
              {({ handleSubmit, form }) => (
                <form onSubmit={handleSubmit} noValidate onBlur={handleFormBlur(form)}>
                  <Grid container direction="column" spacing={2}>
                    <Grid item xs={12}>
                      <Field<string>
                        name="title"
                        component={TextField}
                        variant="filled"
                        fullWidth
                        required
                        validate={required}
                        size="small"
                        placeholder="Element or Question"
                        InputProps={{ inputProps: { 'aria-label': 'Element or Question' } }}
                        hiddenLabel
                      />
                    </Grid>
                    {expanded && (
                      <Grid item xs={12}>
                        <Collapse in={expanded} timeout="auto">
                          <Field<string>
                            name="description"
                            component={TextField}
                            fullWidth
                            placeholder="Description"
                            InputProps={{ inputProps: { 'aria-label': 'Description' } }}
                            size="small"
                            hiddenLabel
                          />
                        </Collapse>
                      </Grid>
                    )}
                    {FileUpload === component && (
                      <Grid item xs={12}>
                        <Box fontStyle="italic" fontSize={14} mx={1.5}>
                          Accepted files: .pdf, .jpg, .jpeg, .png, .gif, .doc and .docx {TextDivider} Max size: 15MB{' '}
                          {TextDivider} User may upload multiple files
                        </Box>
                      </Grid>
                    )}
                    {[Checkbox, Radio, Select].includes(component) &&
                      elementOptions !== null &&
                      elementOptions.length > 0 && (
                        <Grid item xs={12} style={{ paddingTop: 0 }}>
                          <ElementOptionsList elementId={id} options={elementOptions} componentType={component} />
                          <Button
                            startIcon={<AddIcon />}
                            color="primary"
                            size="small"
                            classes={{ root: classes.addOptionButton }}
                            onClick={handleAddOption}
                          >
                            Add Option
                          </Button>
                        </Grid>
                      )}
                  </Grid>
                </form>
              )}
            </Form>
          </Grid>
        </GridContainer>
      </CardContent>
      <CardActions>
        <GridContainer spacing={2}>
          <Grid item xs={12} style={{ paddingBottom: 0, paddingTop: 0 }}>
            <Box display="flex" justifyContent="flex-end" borderTop={1} pt={0.5} borderColor="divider">
              <Box display="inline-flex" justifyContent="center" pr={2}>
                <FormControlLabel
                  control={<Switch checked={isRequired} name="required" size="small" />}
                  label="Required"
                  labelPlacement="start"
                  onClick={handleIsRequired}
                  classes={{ label: classes.label }}
                />
              </Box>
              <Box my={0.5}>
                <Divider orientation="vertical" />
              </Box>
              <IconButton
                aria-label="add-description"
                onClick={handleClick}
                aria-controls="context-menu"
                aria-haspopup="true"
                size="small"
                edge="end"
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="context-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                getContentAnchorEl={null}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 115 }}
                classes={{ paper: classes.paper }}
              >
                <MenuItem onClick={handleExpandClick} aria-expanded={expanded}>
                  <Typography variant="body2" style={{ fontWeight: 500 }}>
                    Add Description
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Grid>
        </GridContainer>
      </CardActions>
    </Card>
  );
};
