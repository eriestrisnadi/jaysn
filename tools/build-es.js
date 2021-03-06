import { readFileSync } from 'fs';
import { join, resolve } from 'path';
import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import stripBanner from 'rollup-plugin-strip-banner';
import { capitalize } from './utils';
import pkg from '../package.json';

const copyright = readFileSync(join('tools', 'COPYRIGHT'), 'utf-8');

const SRC_DIR = resolve('src');
const DIST_DIR = resolve('dist');

export default {
  sourceMap: false,
  banner: copyright
    .replace('{pkg.name}', pkg.name)
    .replace('{pkg.homepage}', pkg.homepage)
    .replace('{pkg.author}', pkg.author)
    .replace('{pkg.license}', pkg.license),
  name: pkg.name,
  input: join(SRC_DIR, `${capitalize(pkg.name)}.js`),
  external: ['fs', 'process', 'util', ...Object.keys(pkg.dependencies)],
  output: {
    file: join(DIST_DIR, `${pkg.name}.es.js`),
    format: 'es',
  },
  plugins: [commonjs(), json(), stripBanner(), buble()],
};
