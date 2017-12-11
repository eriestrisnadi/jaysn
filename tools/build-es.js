import fs from 'fs';
import path from 'path';
import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import stripBanner from 'rollup-plugin-strip-banner';
import pkg from '../package.json';

const copyright = fs.readFileSync(path.join('tools', 'COPYRIGHT'), 'utf-8');

const SRC_DIR = path.resolve('src');
const DIST_DIR = path.resolve('dist');

export default {
  sourceMap: false,
  banner: copyright
          .replace('{pkg.name}', pkg.name)
          .replace('{pkg.homepage}', pkg.homepage)
          .replace('{pkg.author}', pkg.author)
          .replace('{pkg.license}', pkg.license),
  name: pkg.name,
  input: path.join(SRC_DIR, `index.js`),
  external: ['fs', 'process', 'util', ...Object.keys(pkg.dependencies)],
  output: {
    file: path.join(DIST_DIR, `${pkg.name}.es.js`),
    format: 'es',
  },
  plugins: [commonjs(), json(), stripBanner(), buble()],
};