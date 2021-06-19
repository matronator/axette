/**
 * Copyright (c) 2021 Matronator
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

 module.exports = function babelConfig(api) {
  api.cache(true);
  return {
    presets: [
      '@babel/preset-typescript',
      [
        '@babel/env',
        {
          modules: false,
          targets: {
            node: '12',
            browsers: ['last 2 versions'],
          },
        },
      ],
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-proposal-optional-chaining',
    ],
    ignore: [
      'node_modules',
      'build',
      '**/*.stories.*',
      '**/__tests__',
      '**/__mocks__',
      '**/test-utils',
    ],
  };
};
