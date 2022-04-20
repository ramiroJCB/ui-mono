import ArrowDropDownCircleIcon from '@material-ui/icons/ArrowDropDownCircle';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import EventIcon from '@material-ui/icons/Event';
import PublishIcon from '@material-ui/icons/Publish';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import React from 'react';
import ScheduleIcon from '@material-ui/icons/Schedule';
import ShortTextIcon from '@material-ui/icons/ShortText';
import SubjectIcon from '@material-ui/icons/Subject';
import { ComponentType } from 'interfaces/element';

type Props = {
  variant: ComponentType;
  fontSize?: 'inherit' | 'default' | 'small' | 'large';
};

export const ElementIcon: React.FC<Props> = ({ variant, fontSize = 'inherit' }) => {
  const icons = {
    TextField: ShortTextIcon,
    TextArea: SubjectIcon,
    DatePicker: EventIcon,
    TimePicker: ScheduleIcon,
    Select: ArrowDropDownCircleIcon,
    Checkbox: CheckBoxIcon,
    Radio: RadioButtonCheckedIcon,
    FileUpload: PublishIcon
  };
  const Icon = icons[variant];

  return <Icon fontSize={fontSize} />;
};
