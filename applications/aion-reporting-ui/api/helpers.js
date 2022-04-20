String.prototype.isBoolean = function() {
  switch (this.trim()) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      return this.valueOf();
  }
};

/**
 * Takes in an odata filter query string and splits it into a key value pair.
 * If more than one value is found per key an array of values will be returned.
 * Otherwise, just the value itself will be returned.
 *
 * @param {string} $filter
 * @returns {Object}
 */
const odataFilterParser = $filter => {
  const filters = {};

  if ($filter) {
    if ($filter.match(/\([^)]*?\)/g)) {
      const propertyKeys = [];

      $filter.match(/\([^)]*?\)/g).map(filter => {
        const splitFilter = filter.replace(/[{()}]/g, '').split('eq');
        const propertyKey = splitFilter.shift().trim();
        if (splitFilter.length > 0) {
          const value = splitFilter
            .pop()
            .trim()
            .replace(/'/g, '')
            .isBoolean();

          if (!propertyKeys.includes(propertyKey)) {
            propertyKeys.push(propertyKey);
            filters[propertyKey] = [value];
          } else {
            filters[propertyKey].push(value);
          }
        }
      });

      Object.keys(filters).map(key => {
        if (filters[key].length === 1) {
          filters[key] = filters[key][0];
        }
      });
    } else {
      const splitFilter = $filter.replace(/[{()}]/g, '').split('eq');
      const propertyKey = splitFilter.shift().trim();
      const value = splitFilter
        .pop()
        .trim()
        .replace(/'/g, '')
        .isBoolean();

      filters[propertyKey] = value;
    }

    return filters;
  }
};

module.exports = { odataFilterParser };
