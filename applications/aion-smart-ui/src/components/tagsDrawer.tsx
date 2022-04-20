import * as React from 'react';
import {
  Drawer,
  Typography,
  Checkbox,
  FormControlLabel,
  withStyles,
  WithStyles,
  createStyles,
  Grid,
  Button,
  Badge
} from '@material-ui/core';
import { ISiteTag } from 'interfaces/siteTag';
import { DeepReadonly } from 'utility-types';
import amber from '@material-ui/core/colors/amber';
import { useTranslation } from 'react-i18next';

type OwnProps = {
  siteTags: DeepReadonly<ISiteTag[]> | null;
  isDrawerOpen: boolean;
  handleDrawerClose: () => void;
  handleTagClick: (tagName: string) => () => void;
  selectedTags: DeepReadonly<string[]>;
  handleTagClearClick: () => void;
};

type Props = OwnProps & WithStyles;

const styles = createStyles({
  container: {
    margin: 5,
    marginLeft: 20,
    maxWidth: 400,
    minWidth: 250,
    paddingRight: 20
  }
});

const TagsDrawerComponent: React.FC<Props> = ({
  siteTags,
  isDrawerOpen,
  handleDrawerClose,
  classes,
  handleTagClick,
  selectedTags,
  handleTagClearClick
}) => {
  const { t } = useTranslation();
  return (
    <Drawer open={isDrawerOpen} anchor="right" onClose={handleDrawerClose}>
      <Grid container direction="column" className={classes.container}>
        <Grid container item justify="space-between" direction="row">
          <Grid item>
            <Typography variant="h6">
              <Badge variant="dot" color="error" invisible={selectedTags.length === 0}>
                {t('smart.common.tags', 'Tags')}
              </Badge>
            </Typography>
          </Grid>
          <Grid item>
            <Button onClick={handleTagClearClick} style={{ color: amber[900] }}>
              {t('smart.common.clear', 'Clear')}
            </Button>
            <Button onClick={handleDrawerClose}>{t('smart.common.close', 'Close')}</Button>
          </Grid>
        </Grid>
        {siteTags?.map(({ name }) => (
          <FormControlLabel
            key={name}
            control={<Checkbox checked={selectedTags.includes(name)} onChange={handleTagClick(name)} />}
            label={name}
          />
        ))}
      </Grid>
    </Drawer>
  );
};

export const TagsDrawer = withStyles(styles)(TagsDrawerComponent);
