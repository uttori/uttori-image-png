/**
 * Creates a new ImagePNG.
 * @example
 * <caption>new ImagePNG(list, options)</caption>
 * const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'oi1n0g16', 'png', null);
 * const image = ImagePNG.fromFile(image_data);
 * image.decodePixels();
 * const length = image.pixels.length;
 *  ➜ 6144
 * const pixel = image.getPixel(0, 0);
 *  ➜ [255, 255, 255, 255]
 * @property width - Pixel Width
 * @property height - Pixel Height
 * @property bitDepth - Image Bit Depth, one of: 1, 2, 4, 8, 16
 * @property colorType - = Defines pixel structure, one of: 0, 2, 3, 4, 6
 * @property compressionMethod - Type of compression, always 0
 * @property filterMethod - Type of filtering, always 0
 * @property interlaceMethod - Type of interlacing, one of: 0, 1
 * @property colors - Number of bytes for each pixel
 * @property alpha - True when the image has an alpha transparency layer
 * @property palette - Raw Color data
 * @property pixels - Raw Image Pixel data
 * @property transparency - Raw Transparency data
 * @property physical - Object containing physical dimension information
 * @property physical.width - Physical Dimension Width
 * @property physical.height - Physical Dimension Height
 * @property physical.unit - Physical Dimension Units, with 0 being unknown and 1 being Meters
 * @property dataChunks - Image Data pieces
 * @property header - PNG Signature from the data
 * @param list - The DataBufferList of the image to process.
 * @param options - Options for this instance.
 * @param [options.size = 16] - ArrayBuffer byteLength for the underlying binary parsing.
 */
declare class ImagePNG {
    constructor(list: DataBufferList, options: {
        size?: number;
    });
    /**
     * Creates a new ImagePNG from file data.
     * @param data - The data of the image to process.
     * @returns the new ImagePNG instance for the provided file data
     */
    static fromFile(data: Buffer): ImagePNG;
    /**
     * Creates a new ImagePNG from a DataBuffer.
     * @param buffer - The DataBuffer of the image to process.
     * @returns the new ImagePNG instance for the provided DataBuffer
     */
    static fromBuffer(buffer: DataBuffer): ImagePNG;
    /**
     * Sets the bitDepth on the ImagePNG instance.
     * @param bitDepth - The bitDepth to set, one of: 1, 2, 4, 8, 16
     */
    setBitDepth(bitDepth: number): void;
    /**
     * Sets the colorType on the ImagePNG instance.
     * Both color and alpha properties are inferred from the colorType.
     *
     * Color Type | Allowed Bit Depths | Interpretation
     * 0          | 1,2,4,8,16         | Each pixel is a grayscale sample.
     * 2          | 8,16               | Each pixel is an R,G,B triple.
     * 3          | 1,2,4,8            | Each pixel is a palette index; a PLTE chunk must appear.
     * 4          | 8,16               | Each pixel is a grayscale sample, followed by an alpha sample.
     * 6          | 8,16               | Each pixel is an R,G,B triple, followed by an alpha sample.
     * @param colorType - The colorType to set, one of: 0, 2, 3, 4, 6
     */
    setColorType(colorType: number): void;
    /**
     * Sets the compressionMethod on the ImagePNG instance.
     * The compressionMethod should always be 0.
     * @param compressionMethod - The compressionMethod to set, always 0
     */
    setCompressionMethod(compressionMethod: number): void;
    /**
     * Sets the filterMethod on the ImagePNG instance.
     * The filterMethod should always be 0.
     * @param filterMethod - The filterMethod to set, always 0
     */
    setFilterMethod(filterMethod: number): void;
    /**
     * Sets the interlaceMethod on the ImagePNG instance.
     * The interlaceMethod should always be 0 or 1.
     * @param interlaceMethod - The filterMethod to set, always 0 or 1
     */
    setInterlaceMethod(interlaceMethod: number): void;
    /**
     * Sets the palette on the ImagePNG instance.
     * @param palette - The palette to set
     */
    setPalette(palette: number[] | Uint8Array): void;
    /**
     * Get the pixel color at a specified x, y location.
     * @param x - The hoizontal offset to read.
     * @param y - The vertical offset to read.
     * @returns the color as [red, green, blue, alpha]
     */
    getPixel(x: number, y: number): any[];
    /**
     * Parse the PNG file, decoding the supported chunks.
     */
    parse(): void;
    /**
     * Decodes and validates PNG Header.
     * Signature (Decimal): [137, 80, 78, 71, 13, 10, 26, 10]
     * Signature (Hexadecimal): [89, 50, 4E, 47, 0D, 0A, 1A, 0A]
     * Signature (ASCII): [\211, P, N, G, \r, \n, \032, \n]
     */
    decodeHeader(): void;
    /**
     * Decodes the chunk type, and attempts to parse that chunk if supported.
     * Supported Chunk Types: IHDR, PLTE, IDAT, IEND, tRNS, pHYs
     *
     * Chunk Structure:
     * Length: 4 bytes
     * Type:   4 bytes (IHDR, PLTE, IDAT, IEND, etc.)
     * Chunk:  {length} bytes
     * CRC:    4 bytes
     * @returns Chunk Type
     */
    decodeChunk(): string;
    /**
     * Decode the IHDR (Image header) chunk.
     * Should be the first chunk in the data stream.
     *
     * Width:              4 bytes
     * Height:             4 bytes
     * Bit Depth:          1 byte
     * Colour Type:        1 byte
     * Compression Method: 1 byte
     * Filter Method:      1 byte
     * Interlace Method:   1 byte
     * @param chunk - Data Blob
     */
    decodeIHDR(chunk: Uint8Array): void;
    /**
     * Decode the PLTE (Palette) chunk.
     * The PLTE chunk contains from 1 to 256 palette entries, each a three-byte series of the form.
     * The number of entries is determined from the chunk length. A chunk length not divisible by 3 is an error.
     * @param chunk - Data Blob
     */
    decodePLTE(chunk: Uint8Array): void;
    /**
     * Decode the IDAT (Image Data) chunk.
     * The IDAT chunk contains the actual image data which is the output stream of the compression algorithm.
     * @param chunk - Data Blob
     */
    decodeIDAT(chunk: Uint8Array): void;
    /**
     * Decode the tRNS (Transparency) chunk.
     * The tRNS chunk specifies that the image uses simple transparency: either alpha values associated with palette entries (for indexed-color images) or a single transparent color (for grayscale and truecolor images). Although simple transparency is not as elegant as the full alpha channel, it requires less storage space and is sufficient for many common cases.
     * @param chunk - Data Blob
     */
    decodeTRNS(chunk: Uint8Array): void;
    /**
     * Decode the pHYs (Pixel Dimensions) chunk.
     * The pHYs chunk specifies the intended pixel size or aspect ratio for display of the image.
     * When the unit specifier is 0, the pHYs chunk defines pixel aspect ratio only; the actual size of the pixels remains unspecified.
     * If the pHYs chunk is not present, pixels are assumed to be square, and the physical size of each pixel is unspecified.
     *
     * Structure:
     * Pixels per unit, X axis: 4 bytes (unsigned integer)
     * Pixels per unit, Y axis: 4 bytes (unsigned integer)
     * Unit specifier:          1 byte
     * 0: unit is unknown
     * 1: unit is the meter
     * @param chunk - Data Blob
     */
    decodePHYS(chunk: Uint8Array): void;
    /**
     * Decode the IEND (Image trailer) chunk.
     * The IEND chunk marks the end of the PNG datastream. The chunk's data field is empty.
     * @param _chunk - Unused.
     */
    decodeIEND(_chunk: Uint8Array): void;
    /**
     * Uncompress IDAT chunks.
     */
    decodePixels(): void;
    /**
     * Deinterlace with no interlacing.
     * @param data - Data to deinterlace.
     */
    interlaceNone(data: Buffer): void;
    /**
     * No filtering, direct copy.
     * @param scanline - Scanline to search for pixels in.
     * @param bpp - Bytes Per Pixel
     * @param offset - Offset
     * @param length - Length
     */
    unFilterNone(scanline: any[] | Uint8Array, bpp: number, offset: number, length: number): void;
    /**
     * The Sub() filter transmits the difference between each byte and the value of the corresponding byte of the prior pixel.
     * Sub(x) = Raw(x) + Raw(x - bpp)
     * @param scanline - Scanline to search for pixels in.
     * @param bpp - Bytes Per Pixel
     * @param offset - Offset
     * @param length - Length
     */
    unFilterSub(scanline: any[] | Uint8Array, bpp: number, offset: number, length: number): void;
    /**
     * Pixel Width
    */
    width: number;
    /**
     * Pixel Height
    */
    height: number;
    /**
     * Image Bit Depth, one of: 1, 2, 4, 8, 16
    */
    bitDepth: number;
    /**
     * = Defines pixel structure, one of: 0, 2, 3, 4, 6
    */
    colorType: number;
    /**
     * Type of compression, always 0
    */
    compressionMethod: number;
    /**
     * Type of filtering, always 0
    */
    filterMethod: number;
    /**
     * Type of interlacing, one of: 0, 1
    */
    interlaceMethod: number;
    /**
     * Number of bytes for each pixel
    */
    colors: number;
    /**
     * True when the image has an alpha transparency layer
    */
    alpha: boolean;
    /**
     * Raw Color data
    */
    palette: number[] | Uint8Array;
    /**
     * Raw Image Pixel data
    */
    pixels: Uint8Array;
    /**
     * Raw Transparency data
    */
    transparency: Uint8Array;
    /**
     * Object containing physical dimension information
    */
    physical: {
        width: number;
        height: number;
        unit: number;
    };
    /**
     * Image Data pieces
    */
    dataChunks: Uint8Array[];
    /**
     * PNG Signature from the data
    */
    header: Uint8Array;
}

