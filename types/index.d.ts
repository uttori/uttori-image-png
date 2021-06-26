declare module '@uttori/image-png';

declare module "data-image-png" {
    export = ImagePNG;
    class ImagePNG {
        static fromFile(data: any[] | ArrayBuffer | Buffer | any | Int8Array | Int16Array | number | string | Uint8Array | Uint32Array): ImagePNG;
        static fromBuffer(buffer: any): ImagePNG;
        constructor(list: any, overrides?: {
            size?: number;
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
        unFilterNone(scanline: any[] | Uint8Array, bpp: number, offset: number, length: number): void;
        unFilterSub(scanline: any[] | Uint8Array, bpp: number, offset: number, length: number): void;
        unFilterUp(scanline: any[] | Uint8Array, _bpp: number, offset: number, length: number): void;
        unFilterAverage(scanline: any[] | Uint8Array, bpp: number, offset: number, length: number): void;
        unFilterPaeth(scanline: any[] | Uint8Array, bpp: number, offset: number, length: number): void;
    }
}
declare module "index" {
    export const ImagePNG: typeof import("data-image-png");
}
