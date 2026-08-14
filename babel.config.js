module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['@babel/plugin-transform-typescript', { isTSX: true, allExtensions: true, allowDeclareFields: true }],
      ['@babel/plugin-transform-class-properties', { loose: true }],
      ['@babel/plugin-transform-private-methods', { loose: true }],
      ['@babel/plugin-transform-private-property-in-object', { loose: true }],
      ['@babel/plugin-transform-classes'],
      ['@babel/plugin-transform-async-to-generator'],
      ['@babel/plugin-transform-arrow-functions'],
      // Inline plugin to fix import.meta syntax errors in Metro
      function () {
        return {
          visitor: {
            MetaProperty(path) {
              if (path.node.meta.name === 'import' && path.node.property.name === 'meta') {
                path.replaceWithSourceString('({ env: {} })');
              }
            }
          }
        };
      },
      'react-native-reanimated/plugin'
    ],
  };
};
