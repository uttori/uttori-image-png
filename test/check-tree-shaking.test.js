const path = require('path');
const test = require('ava');

// https://rollupjs.org/guide/en/#javascript-api
const rollup = require('rollup');
const commonjs = require('@rollup/plugin-commonjs');
const replace = require('@rollup/plugin-replace');
const { nodeResolve } = require('@rollup/plugin-node-resolve');

const onwarn = () => {};
const plugins = [
  nodeResolve({
    mainFields: ['module', 'main'],
  }),
  replace({
    'process.env.UTTORI_DATA_DEBUG': 'false',
    'process.env.UTTORI_IMAGEPNG_DEBUG': 'false',
  }),
  commonjs(),
];

// Debugging File Output
// await bundle.write({
//   file: './test/tree-shaking-output.js',
//   format: 'es',
// });

test('Tree Shaking: { DataBuffer, DataBufferList, DataStream }', async (t) => {
  const bundle = await rollup.rollup({
    input: './test/tree-shaking/shake-me.mjs',
    onwarn,
    plugins,
  });

  const output = await bundle.generate({
    format: 'es',
  });

  // Pako Version sum should be (1 (input) + 3 (data tools) + 16 pako files) number of expected modules
  // t.deepEqual(Object.keys(output.output[0].modules).map((f) => path.basename(f)), [
  //   'adler32.js',
  //   'crc32.js',
  //   'inffast.js',
  //   'inftrees.js',
  //   'constants.js',
  //   'inflate.js',
  //   'common.js',
  //   'strings.js',
  //   'messages.js',
  //   'zstream.js',
  //   'gzheader.js',
  //   'inflate.js',
  //   'data-buffer.js',
  //   'data-buffer-list.js',
  //   'data-stream.js',
  //   'data-image-png.js',
  //   'shake-me.mjs',
  // ]);

  // Zlib sum should be (1 (input) + 3 (data tools) + 1 shake-me) number of expected modules
  t.deepEqual(Object.keys(output.output[0].modules).map((f) => path.basename(f)), [
    'underflow-error.js',
    'data-helpers.js',
    'data-buffer.js',
    'data-image-png.js',
    'shake-me.mjs',
  ]);
});
