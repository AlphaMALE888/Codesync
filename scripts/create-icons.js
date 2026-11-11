import fs from "fs";
import path from "path";
import zlib from "zlib";

const publicDir = path.join(process.cwd(), "public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate a valid 32x32 PNG with dark background (#111213) and green (#49735A)
function generatePng(width, height) {
  // RGBA buffer: 4 bytes per pixel
  const rawData = Buffer.alloc(height * (1 + width * 4));
  let offset = 0;

  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter type: None
    for (let x = 0; x < width; x++) {
      // Draw a dark background with an accent inner border / center
      const isCenter = x >= 10 && x <= 22 && y >= 8 && y <= 24;
      const isInner = (x >= 14 && x <= 22 && y >= 12 && y <= 20) || (x >= 18 && y >= 10 && y <= 22);

      if (isCenter && !isInner) {
        // Arch green #49735A
        rawData[offset++] = 0x49;
        rawData[offset++] = 0x73;
        rawData[offset++] = 0x5a;
        rawData[offset++] = 0xff;
      } else {
        // Dark surface #111213
        rawData[offset++] = 0x11;
        rawData[offset++] = 0x12;
        rawData[offset++] = 0x13;
        rawData[offset++] = 0xff;
      }
    }
  }

  const compressed = zlib.deflateSync(rawData);

  function crc32(buf) {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
    }
    return (crc ^ -1) >>> 0;
  }

  const table = new Int32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, "ascii");
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth: 8
  ihdr[9] = 6; // Color type: RGBA
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace

  const ihdrChunk = chunk("IHDR", ihdr);
  const idatChunk = chunk("IDAT", compressed);
  const iendChunk = chunk("IEND", Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const png32 = generatePng(32, 32);
const png192 = generatePng(192, 192);

// Write icon.png
fs.writeFileSync(path.join(publicDir, "icon.png"), png192);

// Wrap PNG inside ICO format for favicon.ico
function wrapPngInIco(pngBuffer, size = 32) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // ICO type
  header.writeUInt16LE(1, 4); // 1 image

  const entry = Buffer.alloc(16);
  entry.writeUInt8(size, 0); // Width
  entry.writeUInt8(size, 1); // Height
  entry.writeUInt8(0, 2); // Colors
  entry.writeUInt8(0, 3); // Reserved
  entry.writeUInt16LE(1, 4); // Color planes
  entry.writeUInt16LE(32, 6); // Bits per pixel
  entry.writeUInt32LE(pngBuffer.length, 8); // Size in bytes
  entry.writeUInt32LE(22, 12); // Offset (6 + 16 = 22)

  return Buffer.concat([header, entry, pngBuffer]);
}

const ico = wrapPngInIco(png32, 32);
fs.writeFileSync(path.join(publicDir, "favicon.ico"), ico);

console.log("Generated public/favicon.ico and public/icon.png successfully!");
