import AddIcon from '@material-ui/icons/Add';
import React from 'react';
import { CircularProgress } from '@material-ui/core';
import { ElementsMenu } from './ElementsMenu';
import { LoadingButton } from '@pec/aion-ui-components/components/LoadingButton';
import { useTypedSelector } from 'app/reducer';

export const AddElement: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isSubmitting = useTypedSelector(state => state.elements.isSubmitting);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <LoadingButton
        variant="contained"
        color="primary"
        aria-controls="add-elements-menu"
        aria-haspopup="true"
        startIcon={!isSubmitting ? <AddIcon /> : undefined}
        onClick={handleClick}
        isSubmitting={isSubmitting}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span style={{ width: 110, height: 22 }}>
            <CircularProgress size={20} color="inherit" />
          </span>
        ) : (
          'Add Element'
        )}
      </LoadingButton>
      <ElementsMenu onClose={handleClose} anchorEl={anchorEl} />
    </>
  );
};
