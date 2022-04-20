import React, { useState } from 'react';
import { addSection } from '../formSections/slice';
import { Box, CircularProgress } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { ISection } from 'interfaces/section';
import { List, Typography } from '@material-ui/core';
import { SectionsListItem } from './SectionsListItem';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useTypedSelector } from 'app/reducer';
import { useHistory, useParams } from 'react-router-dom';
import { LoadingButton } from '@pec/aion-ui-components/components/LoadingButton';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    sectionCount: {
      marginLeft: theme.spacing(2),
      marginTop: theme.spacing(2)
    },
    root: {
      '&:disabled': {
        backgroundColor: 'inherit'
      }
    }
  })
);

type Props = {
  formId: string;
  organizationId: string;
  sections: ISection[];
};

export const SectionsList: React.FC<Props> = ({ sections, formId, organizationId }) => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { sectionId } = useParams<{ sectionId: string }>();
  const [selectedIndex, setSelectedIndex] = useState(sectionId);
  const isSubmitting = useTypedSelector(state => state.sections.isSubmitting);

  const handleListItemClick = (sectionId: string) => () => {
    setSelectedIndex(sectionId);
    history.push(`/${organizationId}/forms/${formId}/sections/${sectionId}`);
  };

  const handleAddSection = async () => {
    const section = {
      formId: formId,
      name: `Section ${sections.length + 1}`,
      sortOrder: sections.length + 1,
      description: null,
      embeddedMediaMetadata: []
    };
    const result = await dispatch(addSection(section));
    const { id } = unwrapResult(result);
    setSelectedIndex(id);
    history.push(`/${organizationId}/forms/${formId}/sections/${id}`);
  };

  return (
    <>
      <Typography component="div" variant="overline" className={classes.sectionCount}>
        {sections.length} Sections
      </Typography>
      <List component="nav" aria-label="form sections">
        {sections.map((section, i) => (
          <SectionsListItem
            key={i}
            section={section}
            selected={selectedIndex === section.id}
            handleListItemClick={handleListItemClick(section.id)}
          />
        ))}
      </List>
      <Box display="flex" mt={2} mb={4} justifyContent="center">
        <LoadingButton
          type="submit"
          variant="outlined"
          color="primary"
          size="small"
          onClick={handleAddSection}
          startIcon={!isSubmitting ? <AddIcon /> : undefined}
          isSubmitting={isSubmitting}
          disabled={isSubmitting}
          classes={{ root: classes.root }}
        >
          {isSubmitting ? (
            <span style={{ width: 110, height: 22 }}>
              <CircularProgress size={20} color="primary" />
            </span>
          ) : (
            'Add Section'
          )}
        </LoadingButton>
      </Box>
    </>
  );
};
