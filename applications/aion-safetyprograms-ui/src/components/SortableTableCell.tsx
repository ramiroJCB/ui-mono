import * as React from 'react';
import Link from '@material-ui/core/Link';
import TableCell, { TableCellProps } from '@material-ui/core/TableCell';

type OwnProps = {
  handleClick: (orderby: string) => () => void;
  orderby: string;
  property: string;
  borderless?: boolean;
};

type Props = OwnProps & TableCellProps;

export const SortableTableCell: React.FC<Props> = ({
  handleClick,
  orderby,
  property,
  children,
  align,
  borderless,
  ...props
}) => {
  const [orderbyProperty, orderbyDirection] = orderby.split(' ');
  const arrow = orderbyProperty === property && (orderbyDirection === 'desc' ? '▼' : '▲');
  const nextDirection = orderbyProperty === property && orderbyDirection !== 'desc' ? ' desc' : '';

  return (
    <TableCell
      sortDirection={orderbyDirection === 'desc' ? 'desc' : 'asc'}
      style={
        borderless
          ? { whiteSpace: 'nowrap', fontSize: 16, borderBottom: 'none' }
          : { whiteSpace: 'nowrap', fontSize: 16 }
      }
      align={align}
      {...props}
    >
      <Link
        style={{ cursor: 'pointer' }}
        underline={borderless ? 'none' : 'always'}
        onClick={handleClick(`${property}${nextDirection}`)}
      >
        {children}
        {arrow}
      </Link>
    </TableCell>
  );
};
