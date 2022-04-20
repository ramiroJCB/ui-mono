import { merge, parse } from '@pec/aion-ui-core/helpers/querystring';
import { useHistory, useLocation } from 'react-router-dom';

export function useTable(defaultPageSize: number = 10, defaultPage: number = 1) {
  const history = useHistory();
  const { search } = useLocation();
  const { order, orderBy, page, pageSize } = parse(search);

  const handlePageChange = (page: number) => {
    const {
      location: { search }
    } = history;

    history.push({
      search: merge(search, {
        page: (page + 1).toString()
      })
    });
  };

  const handleRowsPerPage = (row: string) => {
    const {
      location: { search }
    } = history;

    history.push({
      search: merge(search, {
        pageSize: row
      })
    });
  };

  const handleSortChange = (property: string, value: string) => {
    history.push({
      search: merge(search, {
        orderBy: property,
        order: value
      })
    });
  };
  return {
    handlePageChange,
    handleSortChange,
    handleRowsPerPage,
    order: (order as 'asc' | 'desc') || 'asc',
    orderBy: (orderBy as string) || '',
    currentPage: page ? parseInt(page.toString()) : defaultPage,
    pageSize: pageSize ? Number(pageSize) : defaultPageSize
  };
}
