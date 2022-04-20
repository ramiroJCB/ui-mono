const base = require('../config-overrides.base');

module.exports = (config, env) => {
  // TODO: Remove this when https://github.com/mozilla/pdf.js/issues/11495 is resolved
  // Source: https://github.com/wojtekmaj/react-pdf/issues/280#issuecomment-522574510
  config.module.rules[0].parser.requireEnsure = true;

  return base(config, env);
};
