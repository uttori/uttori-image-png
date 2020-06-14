const test = require('ava');
const { FileUtility } = require('uttori-utilities');
const { DataBuffer, DataBufferList } = require('@uttori/data-tools');
const { ImagePNG } = require('../src');

test('constructor(list, options): can initialize', async (t) => {
  const data = await FileUtility.readFile('./test/assets', '512x478x24', 'png', null);
  const buffer = new DataBuffer(data);
  const list = new DataBufferList();
  list.append(buffer);

  let image = {};
  t.notThrows(() => {
    image = new ImagePNG(list);
  });
  t.is(image.colors, 3);
});

test('fromFile(data): can read a valid file', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets', '512x478x24', 'png', null);
  t.notThrows(() => {
    ImagePNG.fromFile(image_data);
  });
});

test('fromBuffer(buffer): can read a valid file buffer', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets', '512x478x24', 'png', null);
  const buffer = new DataBuffer(image_data);
  t.notThrows(() => {
    ImagePNG.fromBuffer(buffer);
  });
});

test('setCompressionMethod(compressionMethod): can set the compressionMethod', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets', '512x478x24', 'png', null);
  const buffer = new DataBuffer(image_data);
  const image = ImagePNG.fromBuffer(buffer);
  t.is(image.compressionMethod, 0);
  t.notThrows(() => {
    image.setCompressionMethod(0);
  });
  t.is(image.compressionMethod, 0);
});

test('setCompressionMethod(compressionMethod): throws an error on invalid compressionMethod value', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets', '512x478x24', 'png', null);
  const buffer = new DataBuffer(image_data);
  const image = ImagePNG.fromBuffer(buffer);
  t.is(image.compressionMethod, 0);
  t.throws(() => {
    image.setCompressionMethod(1);
  }, { message: 'Unsupported Compression Method: 1, should be 0' });
  t.is(image.compressionMethod, 0);
});

test('setFilterMethod(filterMethod): can set the filterMethod', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets', '512x478x24', 'png', null);
  const buffer = new DataBuffer(image_data);
  const image = ImagePNG.fromBuffer(buffer);
  t.is(image.filterMethod, 0);
  t.notThrows(() => {
    image.setFilterMethod(0);
  });
  t.is(image.filterMethod, 0);
});

test('setFilterMethod(filterMethod): throws an error on invalid filterMethod value', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets', '512x478x24', 'png', null);
  const buffer = new DataBuffer(image_data);
  const image = ImagePNG.fromBuffer(buffer);
  t.is(image.filterMethod, 0);
  t.throws(() => {
    image.setFilterMethod(1);
  }, { message: 'Unsupported Filter Method: 1, should be 0' });
  t.is(image.filterMethod, 0);
});

// setInterlaceMethod(interlaceMethod)
test('setInterlaceMethod(interlaceMethod): can set the interlaceMethod', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets', '512x478x24', 'png', null);
  const buffer = new DataBuffer(image_data);
  const image = ImagePNG.fromBuffer(buffer);
  t.is(image.interlaceMethod, 0);
  t.notThrows(() => {
    image.setInterlaceMethod(0);
    t.is(image.interlaceMethod, 0);
    image.setInterlaceMethod(1);
    t.is(image.interlaceMethod, 1);
  });
  t.is(image.interlaceMethod, 1);
});

test('setInterlaceMethod(interlaceMethod): throws an error on invalid interlaceMethod value', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets', '512x478x24', 'png', null);
  const buffer = new DataBuffer(image_data);
  const image = ImagePNG.fromBuffer(buffer);
  t.is(image.interlaceMethod, 0);
  t.throws(() => {
    image.setInterlaceMethod(2);
  }, { message: 'Unsupported Interlace Method: 2' });
  t.is(image.interlaceMethod, 0);
});

test('setPalette(palette): can set the palette with an Array', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets', '512x478x24', 'png', null);
  const buffer = new DataBuffer(image_data);
  const image = ImagePNG.fromBuffer(buffer);
  t.deepEqual(image.palette, []);
  t.notThrows(() => {
    image.setPalette([1]);
  });
  t.deepEqual(image.palette, [1]);
});

test('setPalette(palette): can set the palette with an Uint8Array', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets', '512x478x24', 'png', null);
  const buffer = new DataBuffer(image_data);
  const image = ImagePNG.fromBuffer(buffer);
  const palette = new Uint8Array([1]);
  t.deepEqual(image.palette, []);
  t.notThrows(() => {
    image.setPalette(palette);
  });
  t.deepEqual(image.palette, palette);
});

test('setPalette(palette): return when called with anything other than an array', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets', '512x478x24', 'png', null);
  const buffer = new DataBuffer(image_data);
  const image = ImagePNG.fromBuffer(buffer);
  t.deepEqual(image.palette, []);
  t.notThrows(() => {
    image.setPalette(0);
    image.setPalette(undefined);
    image.setPalette(null);
    image.setPalette('');
    image.setPalette({});
  });
  t.deepEqual(image.palette, []);
});

test('setPalette(palette): throws an error on invalid palette length', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets', '512x478x24', 'png', null);
  const buffer = new DataBuffer(image_data);
  const image = ImagePNG.fromBuffer(buffer);
  image.bitDepth = 1;
  t.deepEqual(image.palette, []);
  t.throws(() => {
    image.setPalette([]);
  }, { message: 'Palette contains no colors' });
  t.throws(() => {
    image.setPalette([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  }, { message: 'Palette contains more colors than 6 ((2 ^ 1) * 3)' });
  t.deepEqual(image.palette, []);
});

test('decodeHeader(): can read a valid header', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets', '512x478x24', 'png', null);
  t.notThrows(() => {
    ImagePNG.fromFile(image_data);
  });
});

test('decodeHeader(): throws an error with an invalid header', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets', '512x478x24', 'jpg', null);
  t.throws(() => {
    ImagePNG.fromFile(image_data);
  }, { message: 'Missing or invalid PNG header.' });
});

test('decodeIHDR(): can read a valid PNG IHDR chunk', async (t) => {
  let image_data = await FileUtility.readFile('./test/assets', '512x478x24', 'png', null);
  let image = ImagePNG.fromFile(image_data);
  t.is(image.width, 512);
  t.is(image.height, 478);
  t.is(image.bitDepth, 8);
  t.is(image.colorType, 2);
  t.is(image.compressionMethod, 0);
  t.is(image.filterMethod, 0);
  t.is(image.interlaceMethod, 0);

  image_data = await FileUtility.readFile('./test/assets', '512x478x24-compressed', 'png', null);
  image = ImagePNG.fromFile(image_data);
  t.is(image.width, 512);
  t.is(image.height, 478);
  t.is(image.bitDepth, 8);
  t.is(image.colorType, 3);
  t.is(image.compressionMethod, 0);
  t.is(image.filterMethod, 0);
  t.is(image.interlaceMethod, 0);

  image_data = await FileUtility.readFile('./test/assets', 'png-transparent', 'png', null);
  image = ImagePNG.fromFile(image_data);
  t.is(image.width, 1);
  t.is(image.height, 1);
  t.is(image.bitDepth, 8);
  t.is(image.colorType, 6);
  t.is(image.compressionMethod, 0);
  t.is(image.filterMethod, 0);
  t.is(image.interlaceMethod, 0);
});

test('decodePLTE(): can read a valid PNG PLTE chunk', async (t) => {
  let image_data = await FileUtility.readFile('./test/assets', '512x478x24', 'png', null);
  let image = ImagePNG.fromFile(image_data);
  t.is(image.palette.length, 0);

  image_data = await FileUtility.readFile('./test/assets', '512x478x24-compressed', 'png', null);
  image = ImagePNG.fromFile(image_data);
  t.is(image.palette.length, 57);
});

test('decodeTRNS(): can read a valid PNG tRNS chunk', async (t) => {
  let image_data = await FileUtility.readFile('./test/assets', '150x300x8-MANY-CHUNKS', 'png', null);
  let image = ImagePNG.fromFile(image_data);
  t.not(image.transparency, undefined);

  image_data = await FileUtility.readFile('./test/assets', '512x478x24-compressed', 'png', null);
  image = ImagePNG.fromFile(image_data);
  t.is(image.transparency, undefined);

  image_data = await FileUtility.readFile('./test/assets', 'png-transparent', 'png', null);
  image = ImagePNG.fromFile(image_data);
  t.is(image.transparency, undefined);
});

test('decodePHYS(): can read a valid PNG pHYs chunk', async (t) => {
  let image_data = await FileUtility.readFile('./test/assets', '150x300x8-MANY-CHUNKS', 'png', null);
  let image = ImagePNG.fromFile(image_data);
  t.deepEqual(image.physical, { width: 72, height: 72, unit: 1 });

  image_data = await FileUtility.readFile('./test/assets', '512x478x24', 'png', null);
  image = ImagePNG.fromFile(image_data);
  t.deepEqual(image.physical, { width: 96, height: 96, unit: 1 });
});

test('decodePixels(): can decode pixel data', async (t) => {
  let image_data = null;
  let image = null;
  let pixel = null;

  image_data = await FileUtility.readFile('./test/assets', '150x300x8-MANY-CHUNKS', 'png', null);
  image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 45000);
  pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [128, 128, 128, 255]);

  image_data = await FileUtility.readFile('./test/assets', '512x478x24', 'png', null);
  image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 734208);
  pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [0, 0, 0, 255]);

  image_data = await FileUtility.readFile('./test/assets', '4x4x8-RGB-MAGENTA', 'png', null);
  image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 16);
  pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [254, 0, 1, 255]);

  image_data = await FileUtility.readFile('./test/assets', '4x4x8-RGB-MAGENTA-ZOPFLI', 'png', null);
  image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 12);
  pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [254, 0, 1, 255]);

  image_data = await FileUtility.readFile('./test/assets', '4x4xGRAY-ZOPFLI', 'png', null);
  image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 4);
  pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [1, 1, 1, 255]);

  image_data = await FileUtility.readFile('./test/assets', '4x4xRGB-BLACK-WHITE', 'png', null);
  image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 16);
  pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [1, 1, 1, 255]);

  image_data = await FileUtility.readFile('./test/assets', '111x115x8-PHYS-GAMA', 'png', null);
  image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 38295);
  pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [0, 0, 0, 255]);

  image_data = await FileUtility.readFile('./test/assets', '150x300x8-COMPRESSED', 'png', null);
  image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 45000);
  pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [128, 128, 128, 255]);

  image_data = await FileUtility.readFile('./test/assets', '150x300x8-MANY-CHUNKS', 'png', null);
  image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 45000);
  pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [128, 128, 128, 255]);

  image_data = await FileUtility.readFile('./test/assets', '150x300x8-NEW', 'png', null);
  image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 180000);
  pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [128, 128, 128, 255]);

  image_data = await FileUtility.readFile('./test/assets', '512x478x24-compressed', 'png', null);
  image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 244736);
  pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [0, 0, 0, 255]);

  image_data = await FileUtility.readFile('./test/assets', '512x478x24', 'png', null);
  image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 734208);
  pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [0, 0, 0, 255]);

  image_data = await FileUtility.readFile('./test/assets', '1015x1021x8-transparent', 'png', null);
  image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 4145260);
  pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [0, 0, 0, 0]);

  image_data = await FileUtility.readFile('./test/assets', 'png-transparent', 'png', null);
  image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 4);
  pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [0, 0, 0, 0]);

  image_data = await FileUtility.readFile('./test/assets', 'ucnv-png-glitch-none', 'png', null);
  image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 3279360);
  pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [233, 248, 251, 255]);

  image_data = await FileUtility.readFile('./test/assets', 'ucnv-png-glitch-up', 'png', null);
  image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 3279360);
  pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [233, 248, 251, 255]);

  image_data = await FileUtility.readFile('./test/assets', 'ucnv-png-glitch-paeth', 'png', null);
  image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 3279360);
  pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [233, 248, 251, 255]);

  image_data = await FileUtility.readFile('./test/assets', 'ucnv-png-glitch-average', 'png', null);
  image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 3279360);
  pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [233, 248, 251, 255]);

  image_data = await FileUtility.readFile('./test/assets', 'ucnv-png-glitch-sub', 'png', null);
  image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 3279360);
  pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [233, 248, 251, 255]);
});

test('getPixel(x, y): throws errors for missing pixel data', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets', '4x4x8-RGB-MAGENTA', 'png', null);
  const image = ImagePNG.fromFile(image_data);
  t.throws(() => {
    image.getPixel(true, true);
  }, { message: 'Pixel data has not been decoded.' });
});

test('getPixel(x, y): throws errors for invalid params', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets', '4x4x8-RGB-MAGENTA', 'png', null);
  const image = ImagePNG.fromFile(image_data);
  image.decodePixels();

  t.throws(() => {
    image.getPixel(true, true);
  }, { message: 'x position out of bounds or invalid: true' });

  t.throws(() => {
    image.getPixel(0, true);
  }, { message: 'y position out of bounds or invalid: true' });

  t.throws(() => {
    image.getPixel(-1, -1);
  }, { message: 'x position out of bounds or invalid: -1' });

  t.throws(() => {
    image.getPixel(0, -1);
  }, { message: 'y position out of bounds or invalid: -1' });
});

test('getPixel(x, y): throws errors for invalid color type', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets', '4x4x8-RGB-MAGENTA', 'png', null);
  const image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  image.colorType = 1;
  t.throws(() => {
    image.getPixel(0, 0);
  }, { message: 'Unknown Color Type: 1' });
});

test('getPixel(x, y): can get a specific pixel of an image (4x4, RGB, 8 bit)', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets', '4x4x8-RGB-MAGENTA', 'png', null);
  const image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  let pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [254, 0, 1, 255]);

  pixel = image.getPixel(1, 0);
  t.deepEqual(pixel, [0, 254, 1, 255]);

  pixel = image.getPixel(0, 1);
  t.deepEqual(pixel, [0, 0, 0, 255]);

  pixel = image.getPixel(1, 1);
  t.deepEqual(pixel, [255, 254, 0, 255]);
});

test('getPixel(x, y): can get a specific pixel of an image (4x4, RGB, 8 bit, Zopfli)', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets', '4x4x8-RGB-MAGENTA-ZOPFLI', 'png', null);
  const image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  let pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [254, 0, 1, 255]);

  pixel = image.getPixel(1, 0);
  t.deepEqual(pixel, [0, 254, 1, 255]);

  pixel = image.getPixel(0, 1);
  t.deepEqual(pixel, [0, 0, 0, 255]);

  pixel = image.getPixel(1, 1);
  t.deepEqual(pixel, [255, 254, 0, 255]);
});

// PngSuite - Basic Formats
// These are basic test images in all of the standard PNG b/w, color and paletted formats.
// http://www.schaik.com/pngsuite/pngsuite_bas_png.html
test('PngSuite - Basic Formats - basn0g01 - black & white', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'basn0g01', 'png', null);
  const image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 1024);
  const pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [255, 255, 255, 255]);
});

test('PngSuite - Basic Formats - basn0g02 - 2 bit (4 level) grayscale', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'basn0g02', 'png', null);
  const image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 1024);
  const pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [0, 0, 0, 255]);
});

test('PngSuite - Basic Formats - basn0g04 - 4 bit (16 level) grayscale', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'basn0g04', 'png', null);
  const image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 1024);
  const pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [0, 0, 0, 255]);
});

test('PngSuite - Basic Formats - basn0g08 - 8 bit (256 level) grayscale', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'basn0g08', 'png', null);
  const image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 1024);
  const pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [0, 0, 0, 255]);
});

test('PngSuite - Basic Formats - basn0g16 - 16 bit (64k level) grayscale', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'basn0g16', 'png', null);
  const image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 2048);
  const pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [0, 0, 0, 255]);
});

test('PngSuite - Basic Formats - basn2c08 - 3x8 bits rgb color', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'basn2c08', 'png', null);
  const image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 3072);
  const pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [255, 255, 255, 255]);
});

test('PngSuite - Basic Formats - basn2c16 - 3x16 bits rgb color', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'basn2c16', 'png', null);
  const image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 6144);
  const pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [255, 255, 255, 255]);
});

// TODO: Fix getPixel
test('PngSuite - Basic Formats - basn3p01 - 1 bit (2 color) paletted', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'basn3p01', 'png', null);
  const image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 1024);
  // const pixel = image.getPixel(0, 0);
  // t.deepEqual(pixel, []);
});

// TODO: Fix getPixel
test('PngSuite - Basic Formats - basn3p02 - 2 bit (4 color) paletted', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'basn3p02', 'png', null);
  const image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 1024);
  // const pixel = image.getPixel(0, 0);
  // t.deepEqual(pixel, []);
});

// TODO: Fix getPixel
test('PngSuite - Basic Formats - basn3p04 - 4 bit (16 color) paletted', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'basn3p04', 'png', null);
  const image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 1024);
  // const pixel = image.getPixel(0, 0);
  // t.deepEqual(pixel, []);
});

test('PngSuite - Basic Formats - basn3p08 - 8 bit (256 color) paletted', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'basn3p08', 'png', null);
  const image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 1024);
  const pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [1, 0, 0, 255]);
});

test('PngSuite - Basic Formats - basn4a08 - 8 bit grayscale + 8 bit alpha-channel', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'basn4a08', 'png', null);
  const image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 2048);
  const pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [255, 255, 255, 0]);
});

test('PngSuite - Basic Formats - basn4a16 - 16 bit grayscale + 16 bit alpha-channel', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'basn4a16', 'png', null);
  const image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 4096);
  const pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [0, 0, 0, 0]);
});

test('PngSuite - Basic Formats - basn6a08 - 3x8 bits rgb color + 8 bit alpha-channel', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'basn6a08', 'png', null);
  const image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 4096);
  const pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [255, 0, 8, 0]);
});

test('PngSuite - Basic Formats - basn6a16 - 3x16 bits rgb color + 16 bit alpha-channel', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'basn6a16', 'png', null);
  const image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 8192);
  const pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [255, 255, 0, 0]);
});

// PngSuite - Interlacing (Adam7)
// These are the same basic test images but now using Adam-7 interlacing.
// http://www.schaik.com/pngsuite/pngsuite_bas_png.html
// TODO Support Adam7
// eslint-disable-next-line ava/no-skip-test
test.skip('PngSuite - Interlacing', async (t) => {
  let image_data = null;
  let image = null;
  let pixel = null;

  // basi0g01 - black & white
  image_data = await FileUtility.readFile('./test/assets/PngSuite', 'basi0g01', 'png', null);
  image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 1024);
  pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, []);

  // basi0g02 - 2 bit (4 level) grayscale
  image_data = await FileUtility.readFile('./test/assets/PngSuite', 'basi0g02', 'png', null);
  image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 1024);
  pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, []);

  // basi0g04 - 4 bit (16 level) grayscale
  image_data = await FileUtility.readFile('./test/assets/PngSuite', 'basi0g04', 'png', null);
  image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 1024);
  pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, []);

  // basi0g08 - 8 bit (256 level) grayscale
  image_data = await FileUtility.readFile('./test/assets/PngSuite', 'basi0g08', 'png', null);
  image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 1024);
  pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, []);

  // basi0g16 - 16 bit (64k level) grayscale
  image_data = await FileUtility.readFile('./test/assets/PngSuite', 'basi0g16', 'png', null);
  image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 1024);
  pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, []);

  // basi2c08 - 3x8 bits rgb color
  image_data = await FileUtility.readFile('./test/assets/PngSuite', 'basi2c08', 'png', null);
  image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 1024);
  pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, []);

  // basi2c16 - 3x16 bits rgb color
  image_data = await FileUtility.readFile('./test/assets/PngSuite', 'basi2c16', 'png', null);
  image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 1024);
  pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, []);

  // basi3p01 - 1 bit (2 color) paletted
  image_data = await FileUtility.readFile('./test/assets/PngSuite', 'basi3p01', 'png', null);
  image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 1024);
  pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, []);

  // basi3p02 - 2 bit (4 color) paletted
  image_data = await FileUtility.readFile('./test/assets/PngSuite', 'basi3p02', 'png', null);
  image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 1024);
  pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, []);

  // basi3p04 - 4 bit (16 color) paletted
  image_data = await FileUtility.readFile('./test/assets/PngSuite', 'basi3p04', 'png', null);
  image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 1024);
  pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, []);

  // basi3p08 - 8 bit (256 color) paletted
  image_data = await FileUtility.readFile('./test/assets/PngSuite', 'basi3p08', 'png', null);
  image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 1024);
  pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, []);

  // basi4a08 - 8 bit grayscale + 8 bit alpha-channel
  image_data = await FileUtility.readFile('./test/assets/PngSuite', 'basi4a08', 'png', null);
  image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 1024);
  pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, []);

  // basi4a16 - 16 bit grayscale + 16 bit alpha-channel
  image_data = await FileUtility.readFile('./test/assets/PngSuite', 'basi4a16', 'png', null);
  image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 1024);
  pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, []);

  // basi6a08 - 3x8 bits rgb color + 8 bit alpha-channel
  image_data = await FileUtility.readFile('./test/assets/PngSuite', 'basi6a08', 'png', null);
  image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 1024);
  pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, []);

  // basi6a16 - 3x16 bits rgb color + 16 bit alpha-channel
  image_data = await FileUtility.readFile('./test/assets/PngSuite', 'basi6a16', 'png', null);
  image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 1024);
  pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, []);
});

// PngSuite - Odd Sizes
// These tests are there to check if your software handles pictures well, with less obvious picture sizes. This is particularly important with Adam-7 type interlacing. In the same way these tests check if pictures size 1 x 1 and similar are ok.
// http://www.schaik.com/pngsuite/pngsuite_siz_png.html
// s01i3p01 - 1x1 paletted file, interlaced
// s01n3p01 - 1x1 paletted file, no interlacing
// s02i3p01 - 2x2 paletted file, interlaced
// s02n3p01 - 2x2 paletted file, no interlacing
// s03i3p01 - 3x3 paletted file, interlaced
// s03n3p01 - 3x3 paletted file, no interlacing
// s04i3p01 - 4x4 paletted file, interlaced
// s04n3p01 - 4x4 paletted file, no interlacing
// s05i3p02 - 5x5 paletted file, interlaced
// s05n3p02 - 5x5 paletted file, no interlacing
// s06i3p02 - 6x6 paletted file, interlaced
// s06n3p02 - 6x6 paletted file, no interlacing
// s07i3p02 - 7x7 paletted file, interlaced
// s07n3p02 - 7x7 paletted file, no interlacing
// s08i3p02 - 8x8 paletted file, interlaced
// s08n3p02 - 8x8 paletted file, no interlacing
// s09i3p02 - 9x9 paletted file, interlaced
// s09n3p02 - 9x9 paletted file, no interlacing
// s32i3p04 - 32x32 paletted file, interlaced
// s32n3p04 - 32x32 paletted file, no interlacing
// s33i3p04 - 33x33 paletted file, interlaced
// s33n3p04 - 33x33 paletted file, no interlacing
// s34i3p04 - 34x34 paletted file, interlaced
// s34n3p04 - 34x34 paletted file, no interlacing
// s35i3p04 - 35x35 paletted file, interlaced
// s35n3p04 - 35x35 paletted file, no interlacing
// s36i3p04 - 36x36 paletted file, interlaced
// s36n3p04 - 36x36 paletted file, no interlacing
// s37i3p04 - 37x37 paletted file, interlaced
// s37n3p04 - 37x37 paletted file, no interlacing
// s38i3p04 - 38x38 paletted file, interlaced
// s38n3p04 - 38x38 paletted file, no interlacing
// s39i3p04 - 39x39 paletted file, interlaced
// s39n3p04 - 39x39 paletted file, no interlacing
// s40i3p04 - 40x40 paletted file, interlaced
// s40n3p04 - 40x40 paletted file, no interlacing

// PngSuite - Background Colors
// When the PNG file contains a background chunk, this should be used for pictures with alpha-channel or pictures with a transparency chunk. For pictures without this background-chunk, but with alpha, this test-set assumes a black background.
// For the images in this test, the left-side should be 100% the background color, where moving to the right the color should gradually become the image pattern.
// http://www.schaik.com/pngsuite/pngsuite_bck_png.html
// bgai4a08 - 8 bit grayscale, alpha, no background chunk, interlaced
// bgai4a16 - 16 bit grayscale, alpha, no background chunk, interlaced
// bgan6a08 - 3x8 bits rgb color, alpha, no background chunk
// bgan6a16 - 3x16 bits rgb color, alpha, no background chunk
// bgbn4a08 - 8 bit grayscale, alpha, black background chunk
// bggn4a16 - 16 bit grayscale, alpha, gray background chunk
// bgwn6a08 - 3x8 bits rgb color, alpha, white background chunk
// bgyn6a16 - 3x16 bits rgb color, alpha, yellow background chunk

// PngSuite - Transparency
// Transparency should be used together with a background chunk. To test the combination of the two the latter 4 tests are there. How to handle pictures with transparency, but without a background, opinions can differ. Here we use black, but especially in the case of paletted images, the normal color would maybe even be better.
// http://www.schaik.com/pngsuite/pngsuite_trn_png.html
// tbbn0g04 - transparent, black background chunk
// tbbn2c16 - transparent, blue background chunk
// tbbn3p08 - transparent, black background chunk
// tbgn2c16 - transparent, green background chunk
// tbgn3p08 - transparent, light-gray background chunk
// tbrn2c08 - transparent, red background chunk
// tbwn0g16 - transparent, white background chunk
// tbwn3p08 - transparent, white background chunk
// tbyn3p08 - transparent, yellow background chunk
// tp0n0g08 - not transparent for reference (logo on gray)
// tp0n2c08 - not transparent for reference (logo on gray)
// tp0n3p08 - not transparent for reference (logo on gray)
// tp1n3p08 - transparent, but no background chunk
// tm3n3p02 - multiple levels of transparency, 3 entries

// PngSuite - Gamma Values
// To test if your viewer handles gamma-correction, (3x) 6 test-files are available. They contain corrected color-ramps and a corresponding gamma-chunk with the file-gamma value. These are created in such a way that when the viewer does the gamma correction right, all 6 should be displayed identical.
// If they are different, probably the gamma correction is omitted. In that case, have a look at the two right columns in the 6 pictures. The image where those two look the same (when looked from far) reflects the gamma of your system. However, because of the limited size of the image, you should do more elaborate tests to determine your display gamma.
// For comparisons, three pages with GIF images are available. Depending on the display gamma of your system, select the NeXT-, the Mac- or the PC-version.
// http://www.schaik.com/pngsuite/pngsuite_gam_png.html
// g03n0g16 - grayscale, file-gamma = 0.35
// g03n2c08 - color, file-gamma = 0.35
// g03n3p04 - paletted, file-gamma = 0.35
// g04n0g16 - grayscale, file-gamma = 0.45
// g04n2c08 - color, file-gamma = 0.45
// g04n3p04 - paletted, file-gamma = 0.45
// g05n0g16 - grayscale, file-gamma = 0.55
// g05n2c08 - color, file-gamma = 0.55
// g05n3p04 - paletted, file-gamma = 0.55
// g07n0g16 - grayscale, file-gamma = 0.70
// g07n2c08 - color, file-gamma = 0.70
// g07n3p04 - paletted, file-gamma = 0.70
// g10n0g16 - grayscale, file-gamma = 1.00
// g10n2c08 - color, file-gamma = 1.00
// g10n3p04 - paletted, file-gamma = 1.00
// g25n0g16 - grayscale, file-gamma = 2.50
// g25n2c08 - color, file-gamma = 2.50
// g25n3p04 - paletted, file-gamma = 2.50

// PngSuite - Image Filtering
// PNG uses file-filtering, for optimal compression. Normally the type is of filtering is adjusted to the contents of the picture, but here each file has the same picture, with a different filtering.
// http://www.schaik.com/pngsuite/pngsuite_fil_png.html
test('PngSuite - Image Filtering - f00n0g08 - grayscale, no interlacing, filter-type 0', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'f00n0g08', 'png', null);
  const image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 1024);
  const pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [127, 127, 127, 255]);
});

test('PngSuite - Image Filtering - f00n2c08 - color, no interlacing, filter-type 0', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'f00n2c08', 'png', null);
  const image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 3072);
  const pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [255, 0, 8, 255]);
});

test('PngSuite - Image Filtering - f01n0g08 - grayscale, no interlacing, filter-type 1', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'f01n0g08', 'png', null);
  const image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 1024);
  const pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [127, 127, 127, 255]);
});

test('PngSuite - Image Filtering - f01n2c08 - color, no interlacing, filter-type 1', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'f01n2c08', 'png', null);
  const image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 3072);
  const pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [255, 0, 8, 255]);
});

test('PngSuite - Image Filtering - f02n0g08 - grayscale, no interlacing, filter-type 2', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'f02n0g08', 'png', null);
  const image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 1024);
  const pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [127, 127, 127, 255]);
});

test('PngSuite - Image Filtering - f02n2c08 - color, no interlacing, filter-type 2', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'f02n2c08', 'png', null);
  const image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 3072);
  const pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [255, 0, 8, 255]);
});

test('PngSuite - Image Filtering - f03n0g08 - grayscale, no interlacing, filter-type 3', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'f03n0g08', 'png', null);
  const image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 1024);
  const pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [127, 127, 127, 255]);
});

test('PngSuite - Image Filtering - f03n2c08 - color, no interlacing, filter-type 3', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'f03n2c08', 'png', null);
  const image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 3072);
  const pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [255, 0, 8, 255]);
});

test('PngSuite - Image Filtering - f04n0g08 - grayscale, no interlacing, filter-type 4', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'f04n0g08', 'png', null);
  const image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 1024);
  const pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [127, 127, 127, 255]);
});

test('PngSuite - Image Filtering - f04n2c08 - color, no interlacing, filter-type 4', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'f04n2c08', 'png', null);
  const image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 3072);
  const pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [255, 0, 8, 255]);
});

test('PngSuite - Image Filtering - f99n0g04 - bit-depth 4, filter changing per scanline', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'f99n0g04', 'png', null);
  const image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 1024);
  const pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [0, 0, 0, 255]);
});

// PngSuite - Additional Palettes
// Besides the normal use of paletted images, palette chunks can in combination with true-color (and other) images also be used to select color lookup-tables when the video system is of limited capabilities. The suggested palette chunk is specially created for this purpose.
// http://www.schaik.com/pngsuite/pngsuite_pal_png.html
// pp0n2c16 - six-cube palette-chunk in true-color image
// pp0n6a08 - six-cube palette-chunk in true-color+alpha image
// ps1n0g08 - six-cube suggested palette (1 byte) in grayscale image
// ps1n2c16 - six-cube suggested palette (1 byte) in true-color image
// ps2n0g08 - six-cube suggested palette (2 bytes) in grayscale image
// ps2n2c16 - six-cube suggested palette (2 bytes) in true-color image

// PngSuite - Ancillary Chunks
// To test the correct decoding of ancillary chunks, these test-files contain one or more examples of these chunks. Depending on the type of chunk, a number of typical values are selected to test. Unluckily, the test-set can not contain all combinations, because that would be an endless set.
// The significant bits are used in files with the next higher bit-depth. They indicate how many bits are valid.
// For the physical pixel dimensions, the result of each decoding should be a square picture. The first (cdf) image is an example of flat (horizontal) pixels, where the pHYS chunk (x is 1 per unit, y = 4 per unit) must take care of the correction. The second is just the other way round. The last example uses the unit specifier, for 1000 pixels per meter. This should result in a picture of 3.2 cm square.
// The chromaticity chunk defines the rgb and whitepoint coordinates according to the 1931 CIE Committee XYZ color space.
// PNG files can contain a chunk giving a histogram of the colors in the image.
// The time chunk specifies when the picture last was modified (or created).
// In the textual chunk, a number of the standard and some non-standard text items are included. Text can optionally be compressed.
// The exif chunk was added to PNG in 2017 to contain exif data typically added by digital cameras to JPEG images.
// http://www.schaik.com/pngsuite/pngsuite_cnk_png.html
// ccwn2c08 - chroma chunk w:0.3127,0.3290 r:0.64,0.33 g:0.30,0.60 b:0.15,0.06
// ccwn3p08 - chroma chunk w:0.3127,0.3290 r:0.64,0.33 g:0.30,0.60 b:0.15,0.06
// cdfn2c08 - physical pixel dimensions, 8x32 flat pixels
// cdhn2c08 - physical pixel dimensions, 32x8 high pixels
// cdsn2c08 - physical pixel dimensions, 8x8 square pixels
// cdun2c08 - physical pixel dimensions, 1000 pixels per 1 meter
// ch1n3p04 - histogram 15 colors
// ch2n3p08 - histogram 256 colors
// cm0n0g04 - modification time, 01-jan-2000 12:34:56
// cm7n0g04 - modification time, 01-jan-1970 00:00:00
// cm9n0g04 - modification time, 31-dec-1999 23:59:59
// cs3n2c16 - color, 13 significant bits
// cs3n3p08 - paletted, 3 significant bits
// cs5n2c08 - color, 5 significant bits
// cs5n3p08 - paletted, 5 significant bits
// cs8n2c08 - color, 8 significant bits (reference)
// cs8n3p08 - paletted, 8 significant bits (reference)
// ct0n0g04 - no textual data
// ct1n0g04 - with textual data
// ctzn0g04 - with compressed textual data
// cten0g04 - international UTF-8, english
// ctfn0g04 - international UTF-8, finnish
// ctgn0g04 - international UTF-8, greek
// cthn0g04 - international UTF-8, hindi
// ctjn0g04 - international UTF-8, japanese
// exif2c08 - chunk with jpeg exif data

// PngSuite - Chunk Ordering
// These testfiles will test the obligatory ordering relations between various chunk types (not yet) as well as the number of data chunks used for the image.
// http://www.schaik.com/pngsuite/pngsuite_ord_png.html
test('PngSuite - Chunk Ordering - oi1n0g16 - grayscale mother image with 1 idat-chunk', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'oi1n0g16', 'png', null);
  const image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 2048);
  const pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [0, 0, 0, 255]);
});

test('PngSuite - Chunk Ordering - oi1n2c16 - color mother image with 1 idat-chunk', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'oi1n2c16', 'png', null);
  const image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 6144);
  const pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [255, 255, 255, 255]);
});

test('PngSuite - Chunk Ordering - oi2n0g16 - grayscale image with 2 idat-chunks', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'oi2n0g16', 'png', null);
  const image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 2048);
  const pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [0, 0, 0, 255]);
});

test('PngSuite - Chunk Ordering - oi2n2c16 - color image with 2 idat-chunks', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'oi2n2c16', 'png', null);
  const image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 6144);
  const pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [255, 255, 255, 255]);
});

test('PngSuite - Chunk Ordering - oi4n0g16 - grayscale image with 4 unequal sized idat-chunks', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'oi4n0g16', 'png', null);
  const image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 2048);
  const pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [0, 0, 0, 255]);
});

test('PngSuite - Chunk Ordering - oi4n2c16 - color image with 4 unequal sized idat-chunks', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'oi4n2c16', 'png', null);
  const image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 6144);
  const pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [255, 255, 255, 255]);
});

test('PngSuite - Chunk Ordering - oi9n0g16 - grayscale image with all idat-chunks length one', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'oi9n0g16', 'png', null);
  const image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 2048);
  const pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [0, 0, 0, 255]);
});

test('PngSuite - Chunk Ordering - oi9n2c16 - color image with all idat-chunks length one', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'oi9n2c16', 'png', null);
  const image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 6144);
  const pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [255, 255, 255, 255]);
});

// PngSuite - Zlib Compression
// Here you will find a set of images compressed by zlib, ranging from level 0 for no compression at maximum speed upto level 9 for maximum compression.
// http://www.schaik.com/pngsuite/pngsuite_zlb_png.html
test('PngSuite - Zlib Compression - z00n2c08 - color, no interlacing, compression level 0 (none)', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'z00n2c08', 'png', null);
  const image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 3072);
  const pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [255, 255, 0, 255]);
});

test('PngSuite - Zlib Compression - z03n2c08 - color, no interlacing, compression level 3', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'z03n2c08', 'png', null);
  const image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 3072);
  const pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [255, 255, 0, 255]);
});

test('PngSuite - Zlib Compression - z06n2c08 - color, no interlacing, compression level 6 (default)', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'z06n2c08', 'png', null);
  const image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 3072);
  const pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [255, 255, 0, 255]);
});

test('PngSuite - Zlib Compression - z09n2c08 - color, no interlacing, compression level 9 (maximum)', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'z09n2c08', 'png', null);
  const image = ImagePNG.fromFile(image_data);
  image.decodePixels();
  t.is(image.pixels.length, 3072);
  const pixel = image.getPixel(0, 0);
  t.deepEqual(pixel, [255, 255, 0, 255]);
});

// PngSuite - Corrupted Files
// All these files are invalid PNG images. When decoding they should generate appropriate error-messages.
// http://www.schaik.com/pngsuite/pngsuite_xxx_png.html
test('PngSuite - Corrupted Files - xs2n0g01 - signature byte 2 is a "Q"', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'xs2n0g01', 'png', null);
  t.throws(() => {
    ImagePNG.fromFile(image_data);
  }, { message: 'Missing or invalid PNG header.' });
});

test('PngSuite - Corrupted Files - xs4n0g01 - signature byte 4 lowercase', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'xs4n0g01', 'png', null);
  t.throws(() => {
    ImagePNG.fromFile(image_data);
  }, { message: 'Missing or invalid PNG header.' });
});

test('PngSuite - Corrupted Files - xs7n0g01 - 7th byte a space instead of control-Z', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'xs7n0g01', 'png', null);
  t.throws(() => {
    ImagePNG.fromFile(image_data);
  }, { message: 'Missing or invalid PNG header.' });
});

test('PngSuite - Corrupted Files - xcrn0g04 - added cr bytes', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'xcrn0g04', 'png', null);
  t.throws(() => {
    ImagePNG.fromFile(image_data);
  }, { message: 'Missing or invalid PNG header.' });
});

test('PngSuite - Corrupted Files - xlfn0g04 - added lf bytes', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'xlfn0g04', 'png', null);
  t.throws(() => {
    ImagePNG.fromFile(image_data);
  }, { message: 'Missing or invalid PNG header.' });
});

// TODO Enable option to verify IHDR CRCs.
// eslint-disable-next-line ava/no-skip-test
test.skip('PngSuite - Corrupted Files - xhdn0g08 - incorrect IHDR checksum', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'xhdn0g08', 'png', null);
  t.throws(() => {
    ImagePNG.fromFile(image_data);
  }, { message: '' });
});

test('PngSuite - Corrupted Files - xc1n0g08 - color type 1', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'xc1n0g08', 'png', null);
  t.throws(() => {
    ImagePNG.fromFile(image_data);
  }, { message: 'Invalid Color Type: 1, can be one of: 0, 2, 3, 4, 6' });
});

test('PngSuite - Corrupted Files - xc9n2c08 - color type 9', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'xc9n2c08', 'png', null);
  t.throws(() => {
    ImagePNG.fromFile(image_data);
  }, { message: 'Invalid Color Type: 9, can be one of: 0, 2, 3, 4, 6' });
});

test('PngSuite - Corrupted Files - xd0n2c08 - bit-depth 0', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'xd0n2c08', 'png', null);
  t.throws(() => {
    ImagePNG.fromFile(image_data);
  }, { message: 'Invalid Bit Depth: 0, can be one of: 1, 2, 4, 8, 16' });
});

test('PngSuite - Corrupted Files - xd3n2c08 - bit-depth 3', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'xd3n2c08', 'png', null);
  t.throws(() => {
    ImagePNG.fromFile(image_data);
  }, { message: 'Invalid Bit Depth: 3, can be one of: 1, 2, 4, 8, 16' });
});

test('PngSuite - Corrupted Files - xd9n2c08 - bit-depth 99', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'xd9n2c08', 'png', null);
  t.throws(() => {
    ImagePNG.fromFile(image_data);
  }, { message: 'Invalid Bit Depth: 99, can be one of: 1, 2, 4, 8, 16' });
});

test('PngSuite - Corrupted Files - xdtn0g01 - missing IDAT chunk', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'xdtn0g01', 'png', null);
  const image = ImagePNG.fromFile(image_data);
  t.throws(() => {
    image.decodePixels();
  }, { message: 'No IDAT chunks to decode.' });
});

// TODO Enable option to verify IDAT CRCs.
// eslint-disable-next-line ava/no-skip-test
test.skip('PngSuite - Corrupted Files - xcsn0g01 - incorrect IDAT checksum', async (t) => {
  const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'xcsn0g01', 'png', null);
  t.throws(() => {
    ImagePNG.fromFile(image_data);
  }, { message: '' });
});
