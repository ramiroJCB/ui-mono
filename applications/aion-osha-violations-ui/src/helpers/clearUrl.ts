import { merge, parse } from '@pec/aion-ui-core/helpers/querystring';

const ignoredParams = ['page', 'name', 'id', 'selected', 'ssqid', 'organizationId', 'organizationViolationsId'];

export const clearUrl = (search: string, withPage?: boolean) => {
  let cleanSearch = {};

  Object.keys(parse(search)).forEach(key =>
    !ignoredParams.includes(key) || (withPage && key === 'page') ? (cleanSearch[key] = parse(search)[key]) : null
  );

  return merge('', cleanSearch);
};
