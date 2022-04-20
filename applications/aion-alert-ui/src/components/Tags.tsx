import * as React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import { ITag } from 'interfaces/tag';
import { Tag } from './Tag';
import { TagPopover } from './TagPopover';

const styles = createStyles({
  list: {
    maxHeight: 500,
    paddingTop: 0
  },
  listItem: {
    display: 'block',
    paddingBottom: 0
  }
});

type OwnProps = {
  tags: ITag[];
  maxVisibleTags?: number;
};

type Props = OwnProps & WithStyles<typeof styles>;

const TagsComponent: React.FC<Props> = ({ tags, classes, maxVisibleTags = 99 }) => {
  const renderPopoverContent = () => {
    const tagsNotVisible = tags.slice(maxVisibleTags, tags.length);
    const numberOfColumns = Math.ceil(tagsNotVisible.length / 10);

    return (
      <List className={classes.list} style={{ columnCount: numberOfColumns }}>
        {tagsNotVisible.map((tag, index) => (
          <ListItem className={classes.listItem} key={index}>
            <Typography>{tag.name}</Typography>
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <React.Fragment>
      {tags.map((tag, index) => {
        if (index <= maxVisibleTags) {
          if (index === maxVisibleTags && maxVisibleTags < tags.length) {
            return (
              <TagPopover
                key={index}
                label={`+${tags.length - maxVisibleTags}`}
                popoverContent={renderPopoverContent()}
              />
            );
          } else {
            return <Tag key={index} label={tag.name} />;
          }
        } else {
          return null;
        }
      })}
    </React.Fragment>
  );
};

export const Tags = withStyles(styles)(TagsComponent);
