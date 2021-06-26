import ImagePNG from '../esm/index.js';

// From https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png
fetch('PNG_transparency_demonstration_1.png')
  .then((r) => r.arrayBuffer())
  .then((buffer) => {
    const image = ImagePNG.fromFile(buffer);
    image.decodePixels();
    console.log('Image', image);
  });
