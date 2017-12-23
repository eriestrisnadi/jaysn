import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { minify } from 'uglify-es';
import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import saveLicense from 'uglify-save-license';
import stripBanner from 'rollup-plugin-strip-banner';
import nodeResolve from 'rollup-plugin-node-resolve';
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
  input: join(SRC_DIR, 'index.js'),
  external: ['fs', 'process', 'util', ...Object.keys(pkg.dependencies)],
  globals: {
    immutable: 'immutable',
  },
  output: {
    exports: 'named',
    file: join(DIST_DIR, `${pkg.name}.js`),
    format: 'cjs',
  },
  plugins: [
    nodeResolve(),
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

        if (!existsSync(DIST_DIR)) {
          mkdirSync(DIST_DIR);
        }

        writeFileSync(join(DIST_DIR, `${pkg.name}.min.js`), result.code, {
          encoding: 'utf8',
        });
      },
    },
  ],
};
