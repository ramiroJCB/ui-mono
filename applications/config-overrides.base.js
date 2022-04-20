const { override, addWebpackResolve, removeModuleScopePlugin } = require('customize-cra');
const { addReactRefresh } = require('customize-cra-react-refresh');

const path = require('path');
const sourceMaps = () => config => {
  const oneOfRule = config.module.rules.find(rule => rule.hasOwnProperty('oneOf'));
  const packagesRule = oneOfRule.oneOf.find(rule => rule.test.toString() === /\.(js|mjs)$/.toString());

  if (packagesRule) {
    packagesRule.options.sourceMaps = true;
    config.module.rules.push({
      test: /\.js$/,
      loader: 'source-map-loader',
      enforce: 'pre',
      include: [
        path.resolve('node_modules/@pec/aion-ui-core/build'),
        path.resolve('node_modules/@pec/aion-ui-components/build'),
        path.resolve('node_modules/@pec/aion-ui-deprecated/build'),
        path.resolve('node_modules/@pec/aion-ui-form/build'),
        path.resolve('node_modules/@pec/aion-ui-text-editor/build'),
        path.resolve('node_modules/@pec/aion-ui-odata/build'),
        path.resolve('node_modules/@pec/aion-ui-i18next/build')
      ]
    });
  }

  return config;
};

module.exports = function(config, env) {
  return override(
    env === 'development' && sourceMaps(),
    removeModuleScopePlugin(),
    addReactRefresh(),
    addWebpackResolve({
      alias: {
        '@pec/aion-ui-core': path.resolve(__dirname, '../packages/aion-ui-core/build'),
        '@pec/aion-ui-components': path.resolve(__dirname, '../packages/aion-ui-components/build'),
        '@pec/aion-ui-deprecated': path.resolve(__dirname, '../packages/aion-ui-deprecated/build'),
        '@pec/aion-ui-form': path.resolve(__dirname, '../packages/aion-ui-form/build'),
        '@pec/aion-ui-text-editor': path.resolve(__dirname, '../packages/aion-ui-text-editor/build'),
        '@pec/aion-ui-odata': path.resolve(__dirname, '../packages/aion-ui-odata/build'),
        '@pec/aion-ui-i18next': path.resolve(__dirname, '../packages/aion-ui-i18next/build')
      }
    })
  )(config, env);
};
