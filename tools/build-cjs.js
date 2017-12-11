import fs from 'fs';
import path from 'path';
import { minify } from 'uglify-es';
import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import saveLicense from 'uglify-save-license';
import stripBanner from 'rollup-plugin-strip-banner';
import resolve from 'rollup-plugin-node-resolve';
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
  input: path.join(SRC_DIR, 'index.js'),
  external: ['fs', 'process', 'util', ...Object.keys(pkg.dependencies)],
  globals: {
    immutable: 'immutable',
  },
  output: {
    exports: 'named',
    file: path.join(DIST_DIR, `${pkg.name}.js`),
    format: 'cjs',
  },
  plugins: [
    resolve(),
    commonjs(),
    json(),
    stripBanner(),
    buble(),
    {
      name: 'uglify',
      transformBundle(code) {
        const result = minify(code, {
          mangle: { toplevel: true },
          output: { max_line_len: 2048, comments: saveLicense },
          compress: { comparisons: true, pure_getters: true, unsafe: true },
        });

        if (!fs.existsSync(DIST_DIR)) {
          fs.mkdirSync(DIST_DIR);
        }

        fs.writeFileSync(
          path.join(DIST_DIR, `${pkg.name}.min.js`),
          result.code,
          'utf8',
        );
      },
    },
  ],
};
