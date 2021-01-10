/* eslint-disable node/no-extraneous-import */
/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-restricted-syntax */
/* eslint no-console: 0 */
import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import cleanup from 'rollup-plugin-cleanup';
import replace from '@rollup/plugin-replace';

const config = {
  input: 'src/data-image-png.js',
  output: {
    file: 'browser/data-image-png.js',
    format: 'iife',
    name: 'ImagePNG',
    sourcemap: true,
  },
  plugins: [
    // Replace zlib with pako for brwosers
    replace({
      "const zlib = require('zlib');": "const pako = require('pako/lib/inflate.js');",
      'out = zlib.inflateSync(data);': 'out = pako.inflate(data);',
      delimiters: ['', ''],
    }),
    nodeResolve({
      mainFields: ['module', 'main'],
    }),
    replace({
      'process.env.UTTORI_DATA_DEBUG': 'false',
      'process.env.UTTORI_IMAGEPNG_DEBUG': 'false',
      delimiters: ['', ''],
    }),
    commonjs(),
    babel(),
    cleanup({
      comments: 'none',
    }),
  ],
};

export default config;
