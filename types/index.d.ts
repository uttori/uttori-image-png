declare module "data-image-png" {
    export = ImagePNG;
    const ImagePNG_base: any;
    class ImagePNG extends ImagePNG_base {
        [x: string]: any;
        static fromFile(data: Buffer): ImagePNG;
        static fromBuffer(buffer: any): ImagePNG;
        constructor(list: any, overrides?: {
            size: number;
        });
        width: number;
        height: number;
        bitDepth: number;
        colorType: number;
        compressionMethod: number;
        filterMethod: number;
        interlaceMethod: number;
        colors: number;
        alpha: boolean;
        palette: any[];
        pixels: Uint8Array;
        transparency: Uint8Array;
        physical: {
            width: number;
            height: number;
            unit: number;
        };
        dataChunks: any[];
        setBitDepth(bitDepth: number): void;
        setColorType(colorType: number): void;
        setCompressionMethod(compressionMethod: number): void;
        setFilterMethod(filterMethod: number): void;
        setInterlaceMethod(interlaceMethod: number): void;
        setPalette(palette: number[] | Uint8Array): void;
        getPixel(x: number, y: number): any[];
        parse(): void;
        decodeHeader(): void;
        header: any;
        decodeChunk(): string;
        decodeIHDR(chunk: Uint8Array): void;
        decodePLTE(chunk: Uint8Array): void;
        decodeIDAT(chunk: Uint8Array): void;
        decodeTRNS(chunk: Uint8Array): void;
        decodePHYS(chunk: Uint8Array): void;
        decodeIEND(_chunk: Uint8Array): void;
        decodePixels(): void;
        interlaceNone(data: Buffer): void;
        unFilterNone(scanline: Array | Uint8Array, bpp: number, offset: number, length: number): void;
        unFilterSub(scanline: Array | Uint8Array, bpp: number, offset: number, length: number): void;
        unFilterUp(scanline: Array | Uint8Array, _bpp: number, offset: number, length: number): void;
        unFilterAverage(scanline: Array | Uint8Array, bpp: number, offset: number, length: number): void;
        unFilterPaeth(scanline: Array | Uint8Array, bpp: number, offset: number, length: number): void;
    }
}
declare module "index" {
    export const ImagePNG: typeof import("data-image-png");
}
