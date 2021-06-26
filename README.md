[![view on npm](https://img.shields.io/npm/v/@uttori/image-png.svg)](https://www.npmjs.org/package/@uttori/image-png)
[![npm module downloads](https://img.shields.io/npm/dt/@uttori/image-png.svg)](https://www.npmjs.org/package/@uttori/image-png)
[![Build Status](https://travis-ci.com/uttori/uttori-image-png.svg?branch=master)](https://travis-ci.com/uttori/uttori-image-png)
[![Dependency Status](https://david-dm.org/uttori/uttori-image-png.svg)](https://david-dm.org/uttori/uttori-image-png)
[![Coverage Status](https://coveralls.io/repos/github/uttori/uttori-image-png/badge.svg?branch=master)](https://coveralls.io/github/uttori/uttori-image-png?branch=master)
[![Tree-Shaking Support](https://badgen.net/bundlephobia/tree-shaking/@uttori/image-png)](https://bundlephobia.com/result?p=@uttori/image-png)
[![Dependency Count](https://badgen.net/bundlephobia/dependency-count/@uttori/image-png)](https://bundlephobia.com/result?p=@uttori/image-png)
[![Minified + GZip](https://badgen.net/bundlephobia/minzip/@uttori/image-png)](https://bundlephobia.com/result?p=@uttori/image-png)
[![Minified](https://badgen.net/bundlephobia/min/@uttori/image-png)](https://bundlephobia.com/result?p=@uttori/image-png)

# Uttori ImagePNG

A PNG Decoder and meta data reading utility.

## Install

```bash
npm install --save @uttori/image-png
```

# Config

```js
{
}
```

* * *

# Example

```js
const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'oi1n0g16', 'png', null);
const image = ImagePNG.fromFile(image_data);
image.decodePixels();
const length = image.pixels.length;
➜ 6144
const pixel = image.getPixel(0, 0);
➜ [255, 255, 255, 255]
```

# API Reference

## Classes

<dl>
<dt><a href="#ImagePNG">ImagePNG</a></dt>
<dd><p>PNG Decoder</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#debug">debug()</a> : <code>function</code></dt>
<dd></dd>
</dl>

<a name="ImagePNG"></a>

## ImagePNG
PNG Decoder

**Kind**: global class  
**See**

- [Chunk Specifications](http://www.libpng.org/pub/png/spec/1.2/PNG-Chunks.html)
- [The Art of PNG Glitch](https://ucnv.github.io/pnglitch/)
- [PngSuite, test-suite for PNG](http://www.schaik.com/pngsuite/)
- [Chunk Specifications (LibPNG)](http://www.libpng.org/pub/png/spec/1.2/PNG-Chunks.html)
- [Chunk Specifications (W3C)](https://www.w3.org/TR/PNG-Chunks.html)
- [PNGs containing a chunk with length 0xffffffff](http://www.simplesystems.org/libpng/FFFF/)
- [PNG files can be animated via network latency](https://news.ycombinator.com/item?id=27579759)
- [TweakPNG](https://github.com/jsummers/tweakpng)

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| width | <code>number</code> | Pixel Width |
| height | <code>number</code> | Pixel Height |
| bitDepth | <code>number</code> | Image Bit Depth, one of: 1, 2, 4, 8, 16 |
| colorType | <code>number</code> | = Defines pixel structure, one of: 0, 2, 3, 4, 6 |
| compressionMethod | <code>number</code> | Type of compression, always 0 |
| filterMethod | <code>number</code> | Type of filtering, always 0 |
| interlaceMethod | <code>number</code> | Type of interlacing, one of: 0, 1 |
| colors | <code>number</code> | Number of bytes for each pixel |
| alpha | <code>boolean</code> | True when the image has an alpha transparency layer |
| palette | <code>Array.&lt;number&gt;</code> \| <code>Uint8Array</code> | Raw Color data |
| pixels | <code>Uint8Array</code> | Raw Image Pixel data |
| transparency | <code>Uint8Array</code> | Raw Transparency data |
| physical | <code>object</code> | Object containing physical dimension information |
| physical.width | <code>number</code> | Physical Dimension Width |
| physical.height | <code>number</code> | Physical Dimension Height |
| physical.unit | <code>number</code> | Physical Dimension Units, with 0 being unknown and 1 being Meters |
| dataChunks | <code>Array.&lt;Uint8Array&gt;</code> | Image Data pieces |
| header | <code>Uint8Array</code> | PNG Signature from the data |


* [ImagePNG](#ImagePNG)
    * [new ImagePNG(list, [overrides])](#new_ImagePNG_new)
    * _instance_
        * [.setBitDepth(bitDepth)](#ImagePNG+setBitDepth)
        * [.setColorType(colorType)](#ImagePNG+setColorType)
        * [.setCompressionMethod(compressionMethod)](#ImagePNG+setCompressionMethod)
        * [.setFilterMethod(filterMethod)](#ImagePNG+setFilterMethod)
        * [.setInterlaceMethod(interlaceMethod)](#ImagePNG+setInterlaceMethod)
        * [.setPalette(palette)](#ImagePNG+setPalette)
        * [.getPixel(x, y)](#ImagePNG+getPixel) ⇒ <code>Array</code>
        * [.parse()](#ImagePNG+parse)
        * [.decodeHeader()](#ImagePNG+decodeHeader)
        * [.decodeChunk()](#ImagePNG+decodeChunk) ⇒ <code>string</code>
        * [.decodeIHDR(chunk)](#ImagePNG+decodeIHDR)
        * [.decodePLTE(chunk)](#ImagePNG+decodePLTE)
        * [.decodeIDAT(chunk)](#ImagePNG+decodeIDAT)
        * [.decodeTRNS(chunk)](#ImagePNG+decodeTRNS)
        * [.decodePHYS(chunk)](#ImagePNG+decodePHYS)
        * [.decodeIEND(_chunk)](#ImagePNG+decodeIEND)
        * [.decodePixels()](#ImagePNG+decodePixels)
        * [.interlaceNone(data)](#ImagePNG+interlaceNone)
        * [.unFilterNone(scanline, bpp, offset, length)](#ImagePNG+unFilterNone)
        * [.unFilterSub(scanline, bpp, offset, length)](#ImagePNG+unFilterSub)
    * _static_
        * [.fromFile(data)](#ImagePNG.fromFile) ⇒ [<code>ImagePNG</code>](#ImagePNG)
        * [.fromBuffer(buffer)](#ImagePNG.fromBuffer) ⇒ [<code>ImagePNG</code>](#ImagePNG)

<a name="new_ImagePNG_new"></a>

### new ImagePNG(list, [overrides])
Creates a new ImagePNG.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| list | <code>DataBufferList</code> |  | The DataBufferList of the image to process. |
| [overrides] | <code>object</code> |  | Options for this instance. |
| [overrides.size] | <code>number</code> | <code>16</code> | ArrayBuffer byteLength for the underlying binary parsing. |

**Example** *(new ImagePNG(list, options))*  
```js
const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'oi1n0g16', 'png', null);
const image = ImagePNG.fromFile(image_data);
image.decodePixels();
const length = image.pixels.length;
 ➜ 6144
const pixel = image.getPixel(0, 0);
 ➜ [255, 255, 255, 255]
```
<a name="ImagePNG+setBitDepth"></a>

### imagePNG.setBitDepth(bitDepth)
Sets the bitDepth on the ImagePNG instance.

**Kind**: instance method of [<code>ImagePNG</code>](#ImagePNG)  

| Param | Type | Description |
| --- | --- | --- |
| bitDepth | <code>number</code> | The bitDepth to set, one of: 1, 2, 4, 8, 16 |

<a name="ImagePNG+setColorType"></a>

### imagePNG.setColorType(colorType)
Sets the colorType on the ImagePNG instance.
Both color and alpha properties are inferred from the colorType.

| Color Type | Allowed Bit Depths | Interpretation |
|------------|--------------------|----------------|
| 0          | 1, 2, 4, 8, 16     | Each pixel is a grayscale sample.
| 2          | 8, 16              | Each pixel is an R, G, B triple.
| 3          | 1, 2, 4, 8         | Each pixel is a palette index; a `PLTE` chunk must appear.
| 4          | 8, 16              | Each pixel is a grayscale sample, followed by an alpha sample.
| 6          | 8, 16              | Each pixel is an R, G, B triple, followed by an alpha sample.

**Kind**: instance method of [<code>ImagePNG</code>](#ImagePNG)  
**Throws**:

- <code>Error</code> Invalid Color Type, anything other than 0, 2, 3, 4, 6


| Param | Type | Description |
| --- | --- | --- |
| colorType | <code>number</code> | The colorType to set, one of: 0, 2, 3, 4, 6 |

<a name="ImagePNG+setCompressionMethod"></a>

### imagePNG.setCompressionMethod(compressionMethod)
Sets the compressionMethod on the ImagePNG instance.
The compressionMethod should always be 0.

**Kind**: instance method of [<code>ImagePNG</code>](#ImagePNG)  
**Throws**:

- <code>Error</code> Unsupported Compression Method, anything other than 0


| Param | Type | Description |
| --- | --- | --- |
| compressionMethod | <code>number</code> | The compressionMethod to set, always 0 |

<a name="ImagePNG+setFilterMethod"></a>

### imagePNG.setFilterMethod(filterMethod)
Sets the filterMethod on the ImagePNG instance.
The filterMethod should always be 0.

**Kind**: instance method of [<code>ImagePNG</code>](#ImagePNG)  
**Throws**:

- <code>Error</code> Unsupported Filter Method, anything other than 0


| Param | Type | Description |
| --- | --- | --- |
| filterMethod | <code>number</code> | The filterMethod to set, always 0 |

<a name="ImagePNG+setInterlaceMethod"></a>

### imagePNG.setInterlaceMethod(interlaceMethod)
Sets the interlaceMethod on the ImagePNG instance.
The interlaceMethod should always be 0 or 1.

**Kind**: instance method of [<code>ImagePNG</code>](#ImagePNG)  
**Throws**:

- <code>Error</code> Unsupported Interlace Method, anything other than 0 or 1


| Param | Type | Description |
| --- | --- | --- |
| interlaceMethod | <code>number</code> | The filterMethod to set, always 0 or 1 |

<a name="ImagePNG+setPalette"></a>

### imagePNG.setPalette(palette)
Sets the palette on the ImagePNG instance.

**Kind**: instance method of [<code>ImagePNG</code>](#ImagePNG)  
**Throws**:

- <code>Error</code> No colors in the palette
- <code>Error</code> Too many colors for the current bit depth


| Param | Type | Description |
| --- | --- | --- |
| palette | <code>Array.&lt;number&gt;</code> \| <code>Uint8Array</code> | The palette to set |

<a name="ImagePNG+getPixel"></a>

### imagePNG.getPixel(x, y) ⇒ <code>Array</code>
Get the pixel color at a specified x, y location.

**Kind**: instance method of [<code>ImagePNG</code>](#ImagePNG)  
**Returns**: <code>Array</code> - the color as [red, green, blue, alpha]  
**Throws**:

- <code>Error</code> x is out of bound for the image
- <code>Error</code> y is out of bound for the image
- <code>Error</code> Unknown color types


| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | The hoizontal offset to read. |
| y | <code>number</code> | The vertical offset to read. |

<a name="ImagePNG+parse"></a>

### imagePNG.parse()
Parse the PNG file, decoding the supported chunks.

**Kind**: instance method of [<code>ImagePNG</code>](#ImagePNG)  
<a name="ImagePNG+decodeHeader"></a>

### imagePNG.decodeHeader()
Decodes and validates PNG Header.
Signature (Decimal): [137, 80, 78, 71, 13, 10, 26, 10]
Signature (Hexadecimal): [89, 50, 4E, 47, 0D, 0A, 1A, 0A]
Signature (ASCII): [\211, P, N, G, \r, \n, \032, \n]

**Kind**: instance method of [<code>ImagePNG</code>](#ImagePNG)  
**Throws**:

- <code>Error</code> Missing or invalid PNG header

**See**: [PNG Signature](http://www.w3.org/TR/2003/REC-PNG-20031110/#5PNG-file-signature)  
<a name="ImagePNG+decodeChunk"></a>

### imagePNG.decodeChunk() ⇒ <code>string</code>
Decodes the chunk type, and attempts to parse that chunk if supported.
Supported Chunk Types: IHDR, PLTE, IDAT, IEND, tRNS, pHYs

Chunk Structure:
Length: 4 bytes
Type:   4 bytes (IHDR, PLTE, IDAT, IEND, etc.)
Chunk:  {length} bytes
CRC:    4 bytes

**Kind**: instance method of [<code>ImagePNG</code>](#ImagePNG)  
**Returns**: <code>string</code> - Chunk Type  
**Throws**:

- <code>Error</code> Invalid Chunk Length when less than 0

**See**: [Chunk Layout](http://www.w3.org/TR/2003/REC-PNG-20031110/#5Chunk-layout)  
<a name="ImagePNG+decodeIHDR"></a>

### imagePNG.decodeIHDR(chunk)
Decode the IHDR (Image header) chunk.
Should be the first chunk in the data stream.

Width:              4 bytes
Height:             4 bytes
Bit Depth:          1 byte
Colour Type:        1 byte
Compression Method: 1 byte
Filter Method:      1 byte
Interlace Method:   1 byte

**Kind**: instance method of [<code>ImagePNG</code>](#ImagePNG)  
**See**

- [Image Header](http://www.w3.org/TR/2003/REC-PNG-20031110/#11IHDR)
- [Image Header](http://www.libpng.org/pub/png/spec/1.2/png-1.2-pdg.html#C.IHDR)


| Param | Type | Description |
| --- | --- | --- |
| chunk | <code>Uint8Array</code> | Data Blob |

<a name="ImagePNG+decodePLTE"></a>

### imagePNG.decodePLTE(chunk)
Decode the PLTE (Palette) chunk.
The PLTE chunk contains from 1 to 256 palette entries, each a three-byte series of the form.
The number of entries is determined from the chunk length. A chunk length not divisible by 3 is an error.

**Kind**: instance method of [<code>ImagePNG</code>](#ImagePNG)  
**See**: [Palette](http://www.w3.org/TR/PNG/#11PLTE)  

| Param | Type | Description |
| --- | --- | --- |
| chunk | <code>Uint8Array</code> | Data Blob |

<a name="ImagePNG+decodeIDAT"></a>

### imagePNG.decodeIDAT(chunk)
Decode the IDAT (Image Data) chunk.
The IDAT chunk contains the actual image data which is the output stream of the compression algorithm.

**Kind**: instance method of [<code>ImagePNG</code>](#ImagePNG)  
**See**: [Image Data](http://www.w3.org/TR/2003/REC-PNG-20031110/#11IDAT)  

| Param | Type | Description |
| --- | --- | --- |
| chunk | <code>Uint8Array</code> | Data Blob |

<a name="ImagePNG+decodeTRNS"></a>

### imagePNG.decodeTRNS(chunk)
Decode the tRNS (Transparency) chunk.
The tRNS chunk specifies that the image uses simple transparency: either alpha values associated with palette entries (for indexed-color images) or a single transparent color (for grayscale and truecolor images). Although simple transparency is not as elegant as the full alpha channel, it requires less storage space and is sufficient for many common cases.

**Kind**: instance method of [<code>ImagePNG</code>](#ImagePNG)  
**See**: [Transparency](https://www.w3.org/TR/PNG/#11tRNS)  

| Param | Type | Description |
| --- | --- | --- |
| chunk | <code>Uint8Array</code> | Data Blob |

<a name="ImagePNG+decodePHYS"></a>

### imagePNG.decodePHYS(chunk)
Decode the pHYs (Pixel Dimensions) chunk.
The pHYs chunk specifies the intended pixel size or aspect ratio for display of the image.
When the unit specifier is 0, the pHYs chunk defines pixel aspect ratio only; the actual size of the pixels remains unspecified.
If the pHYs chunk is not present, pixels are assumed to be square, and the physical size of each pixel is unspecified.

Structure:
Pixels per unit, X axis: 4 bytes (unsigned integer)
Pixels per unit, Y axis: 4 bytes (unsigned integer)
Unit specifier:          1 byte
0: unit is unknown
1: unit is the meter

**Kind**: instance method of [<code>ImagePNG</code>](#ImagePNG)  
**See**: [Pixel Dimensions](https://www.w3.org/TR/PNG/#11pHYs)  

| Param | Type | Description |
| --- | --- | --- |
| chunk | <code>Uint8Array</code> | Data Blob |

<a name="ImagePNG+decodeIEND"></a>

### imagePNG.decodeIEND(_chunk)
Decode the IEND (Image trailer) chunk.
The IEND chunk marks the end of the PNG datastream. The chunk's data field is empty.

**Kind**: instance method of [<code>ImagePNG</code>](#ImagePNG)  
**See**: [Image Trailer](http://www.w3.org/TR/2003/REC-PNG-20031110/#11IEND)  

| Param | Type | Description |
| --- | --- | --- |
| _chunk | <code>Uint8Array</code> | Unused. |

<a name="ImagePNG+decodePixels"></a>

### imagePNG.decodePixels()
Uncompress IDAT chunks.

**Kind**: instance method of [<code>ImagePNG</code>](#ImagePNG)  
**Throws**:

- <code>Error</code> No IDAT chunks to decode
- <code>Error</code> Deinterlacing Error
- <code>Error</code> Inflating Error
- <code>Error</code> Adam7 interlaced format is unsupported

<a name="ImagePNG+interlaceNone"></a>

### imagePNG.interlaceNone(data)
Deinterlace with no interlacing.

**Kind**: instance method of [<code>ImagePNG</code>](#ImagePNG)  
**See**: [PNG Filters](https://www.w3.org/TR/PNG-Filters.html)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Buffer</code> | Data to deinterlace. |

<a name="ImagePNG+unFilterNone"></a>

### imagePNG.unFilterNone(scanline, bpp, offset, length)
No filtering, direct copy.

**Kind**: instance method of [<code>ImagePNG</code>](#ImagePNG)  

| Param | Type | Description |
| --- | --- | --- |
| scanline | <code>Array</code> \| <code>Uint8Array</code> | Scanline to search for pixels in. |
| bpp | <code>number</code> | Bytes Per Pixel |
| offset | <code>number</code> | Offset |
| length | <code>number</code> | Length |

<a name="ImagePNG+unFilterSub"></a>

### imagePNG.unFilterSub(scanline, bpp, offset, length)
The Sub() filter transmits the difference between each byte and the value of the corresponding byte of the prior pixel.
Sub(x) = Raw(x) + Raw(x - bpp)

**Kind**: instance method of [<code>ImagePNG</code>](#ImagePNG)  

| Param | Type | Description |
| --- | --- | --- |
| scanline | <code>Array</code> \| <code>Uint8Array</code> | Scanline to search for pixels in. |
| bpp | <code>number</code> | Bytes Per Pixel |
| offset | <code>number</code> | Offset |
| length | <code>number</code> | Length |

<a name="ImagePNG.fromFile"></a>

### ImagePNG.fromFile(data) ⇒ [<code>ImagePNG</code>](#ImagePNG)
Creates a new ImagePNG from file data.

**Kind**: static method of [<code>ImagePNG</code>](#ImagePNG)  
**Returns**: [<code>ImagePNG</code>](#ImagePNG) - the new ImagePNG instance for the provided file data  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Array</code> \| <code>ArrayBuffer</code> \| <code>Buffer</code> \| <code>DataBuffer</code> \| <code>Int8Array</code> \| <code>Int16Array</code> \| <code>number</code> \| <code>string</code> \| <code>Uint8Array</code> \| <code>Uint32Array</code> | The data of the image to process. |

<a name="ImagePNG.fromBuffer"></a>

### ImagePNG.fromBuffer(buffer) ⇒ [<code>ImagePNG</code>](#ImagePNG)
Creates a new ImagePNG from a DataBuffer.

**Kind**: static method of [<code>ImagePNG</code>](#ImagePNG)  
**Returns**: [<code>ImagePNG</code>](#ImagePNG) - the new ImagePNG instance for the provided DataBuffer  

| Param | Type | Description |
| --- | --- | --- |
| buffer | <code>DataBuffer</code> | The DataBuffer of the image to process. |

<a name="debug"></a>

## debug() : <code>function</code>
**Kind**: global function  

* * *

## Tests

To run the test suite, first install the dependencies, then run `npm test`:

```bash
npm install
npm test
DEBUG=Uttori* npm test
```

## Contributors

* [Matthew Callis](https://github.com/MatthewCallis)

## License

* [MIT](LICENSE)
