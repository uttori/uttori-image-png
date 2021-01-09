/* eslint-disable node/no-unpublished-import */
/* eslint-disable import/extensions */
/* eslint-disable unicorn/import-index */
/* eslint-disable node/no-unsupported-features/es-syntax */
import ImagePNG from '../esm/index.js';

fetch('https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png')
  .then((r) => r.arrayBuffer())
  .then((buffer) => {
    const image = ImagePNG.fromFile(buffer);
    image.decodePixels();
    // eslint-disable-next-line no-console
    console.log('Image', image);
  });
