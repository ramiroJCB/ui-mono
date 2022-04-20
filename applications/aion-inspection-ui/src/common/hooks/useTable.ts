import { ITableOption } from '@pec/aion-ui-components/interfaces/tableOption';
import { merge, parse } from '@pec/aion-ui-core/helpers/querystring';
import { useHistory, useLocation, useParams } from 'react-router-dom';

export function useTable(defaultPageSize: number = 10, defaultPage: number = 1) {
  const history = useHistory();
  const { search } = useLocation();
  const { organizationId } = useParams<{ organizationId: string }>();
  const { order, orderBy, page, pageSize } = parse(search);

  const handleRowSelect = ({ id }: ITableOption) => history.push(`/${organizationId}/reviews/${id}`);

  const handlePageChange = (page: number) => {
    history.push({
      search: merge(search, {
        page: (page + 1).toString()
      })
    });
  };

  const handleSort = (property: string, value: string) => {
    const { orderBy, order, page } = parse(search);

    history.push({
      search: merge(search, {
        orderBy: property,
        order: value,
        page: orderBy !== property || order !== value ? '1' : page
      })
    });
  };

  return {
    handleRowSelect,
    handlePageChange,
    handleSort,
    order: (order as 'asc' | 'desc') || 'asc',
    orderBy: (orderBy as string) || '',
    currentPage: (page ? Number(page) : defaultPage) - 1,
    pageSize: pageSize ? Number(pageSize) : defaultPageSize
  };
}
