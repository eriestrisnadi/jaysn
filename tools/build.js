import { writeFileSync, readFileSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';
import { platform } from 'os';
import { minify } from 'uglify-es';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import pkg from '../package.json';

const bundles = [
  {
    format: 'cjs',
    ext: '.js',
    plugins: [],
    babelPresets: ['stage-1'],
    babelPlugins: [
      'transform-es2015-destructuring',
      'transform-es2015-function-name',
      'transform-es2015-parameters',
    ],
  },
  {
    format: 'cjs',
    ext: '.min.js',
    plugins: [uglify({}, minify)],
    babelPresets: ['stage-1'],
    babelPlugins: [
      'transform-es2015-destructuring',
      'transform-es2015-function-name',
      'transform-es2015-parameters',
    ],
    minify: true,
  },
  {
    format: 'es',
    ext: '.es.js',
    plugins: [],
    babelPresets: ['stage-1'],
    babelPlugins: [
      'transform-es2015-destructuring',
      'transform-es2015-function-name',
      'transform-es2015-parameters',
    ],
  },
  {
    format: 'es',
    ext: '.es.min.js',
    plugins: [uglify({}, minify)],
    babelPresets: ['stage-1'],
    babelPlugins: [
      'transform-es2015-destructuring',
      'transform-es2015-function-name',
      'transform-es2015-parameters',
    ],
    minify: true,
  },
];

// Clean up dist directory
execSync(`${(platform === 'win32') ? 'rmdir /s /q' : 'rm -rf'} dist`);
mkdirSync('dist');
// Copy package.json and LICENSE
delete pkg.devDependencies;
delete pkg.scripts;
delete pkg.eslintConfig;
writeFileSync('dist/package.json', JSON.stringify(pkg, null, 2), 'utf-8');
writeFileSync('dist/LICENSE', readFileSync('LICENSE', 'utf-8'), 'utf-8');

const buildConfig = bundles.map(config => ({
  input: `src/index.js`,
  external: ['fs', 'process', 'util', ...Object.keys(pkg.dependencies)],
  plugins: [
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: config.babelPresets,
      plugins: config.babelPlugins,
    }),
  ].concat(config.plugins),
  banner: `/**
 * ${pkg.name} (${pkg.homepage})
 *
 * Copyright © 2017-Present ${pkg.author}. All rights reserved.
 *
 * This source code is licensed under the ${pkg.license} license found in the
 * LICENSE file in the root directory of this source tree.
 */
`,
  output: [
    {
      file: `dist/${pkg.name}${config.ext}`,
      format: config.format,
      sourcemap: !config.minify,
      name: pkg.name,
      exports: 'named',
    },
  ],
}));

export default buildConfig;
