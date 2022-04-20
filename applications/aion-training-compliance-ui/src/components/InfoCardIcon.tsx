import * as React from 'react';
import BookIcon from '@material-ui/icons/Book';
import MapIcon from '@material-ui/icons/Map';
import PeopleIcon from '@material-ui/icons/People';
import PersonIcon from '@material-ui/icons/Person';
import WorkIcon from '@material-ui/icons/Work';
import TurnedInIcon from '@material-ui/icons/TurnedIn';

type Props = {
  variant?: 'contractor' | 'workGroup' | 'customTraining' | 'standardTraining' | 'jobType' | 'employee';
};

export const InfoCardIcon: React.FC<Props> = ({ variant = 'contractor' }) => {
  const icons = {
    contractor: PeopleIcon,
    workGroup: MapIcon,
    customTraining: BookIcon,
    standardTraining: TurnedInIcon,
    jobType: WorkIcon,
    employee: PersonIcon
  };
  const Icon = icons[variant];

  return <Icon fontSize="inherit" />;
};
