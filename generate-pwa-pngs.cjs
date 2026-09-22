const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Minimal PNG generator using standard Node.js zlib
function createPNG(width, height, drawFn) {
  // RGBA buffer
  const rowBytes = width * 4 + 1; // +1 for filter type
  const rawData = Buffer.alloc(rowBytes * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowBytes;
    rawData[rowOffset] = 0; // Filter type: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = drawFn(x, y, width, height);
      const pixelOffset = rowOffset + 1 + x * 4;
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  // Deflate raw image data
  const compressedData = zlib.deflateSync(rawData);

  // Helper to calculate CRC32
  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c ^= buf[i];
      for (let k = 0; k < 8; k++) {
        c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
      }
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    const full = Buffer.concat([typeBuf, data]);
    crcBuf.writeUInt32BE(crc32(full), 0);
    return Buffer.concat([len, full, crcBuf]);
  }

  // PNG Header
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR Chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth: 8
  ihdrData[9] = 6; // Color type: 6 (RGBA)
  ihdrData[10] = 0; // Compression: Deflate
  ihdrData[11] = 0; // Filter: Adaptive
  ihdrData[12] = 0; // Interlace: None
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // IDAT Chunk
  const idatChunk = makeChunk('IDAT', compressedData);

  // IEND Chunk
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Draw luxury architectural gold towers on deep obsidian
function renderIcon(x, y, w, h, isMaskable = false) {
  const nx = x / w;
  const ny = y / h;
  const cx = 0.5;
  const cy = 0.5;
  const dist = Math.hypot(nx - cx, ny - cy);

  // Background: Deep luxury obsidian
  let r = 8;
  let g = 10;
  let b = 14;
  let a = 255;

  // Outer gold rim border (for non-maskable or within safe zone)
  const rimRadius = isMaskable ? 0.44 : 0.47;
  if (Math.abs(dist - rimRadius) < 0.008) {
    return [212, 175, 55, 230]; // Gold rim
  }

  // Horizon glow
  if (dist < 0.35 && ny < 0.6) {
    const glow = Math.max(0, 1 - dist / 0.35);
    r += Math.floor(glow * 25);
    g += Math.floor(glow * 20);
    b += Math.floor(glow * 10);
  }

  // Central Tower Pinnacle
  const cxMid = 0.5;
  const towerTop = 0.22;
  const towerBase = 0.72;
  const towerHalfW = 0.04;

  if (ny >= towerTop && ny <= towerBase) {
    const tProgress = (ny - towerTop) / (towerBase - towerTop);
    const halfWidth = 0.015 + tProgress * 0.035;
    if (Math.abs(nx - cxMid) <= halfWidth) {
      // Golden gradient
      const goldShade = 200 + Math.floor(tProgress * 40);
      return [goldShade, 175, 55, 255];
    }
  }

  // Left Spire
  const leftX = 0.38;
  const leftTop = 0.38;
  if (ny >= leftTop && ny <= towerBase) {
    const tProgress = (ny - leftTop) / (towerBase - leftTop);
    const halfWidth = 0.012 + tProgress * 0.025;
    if (Math.abs(nx - leftX) <= halfWidth) {
      return [180, 150, 45, 230];
    }
  }

  // Right Spire
  const rightX = 0.62;
  const rightTop = 0.38;
  if (ny >= rightTop && ny <= towerBase) {
    const tProgress = (ny - rightTop) / (towerBase - rightTop);
    const halfWidth = 0.012 + tProgress * 0.025;
    if (Math.abs(nx - rightX) <= halfWidth) {
      return [180, 150, 45, 230];
    }
  }

  // Apex Spire tip
  if (ny >= 0.16 && ny < towerTop && Math.abs(nx - cxMid) <= 0.006) {
    return [255, 245, 215, 255];
  }

  // Baseline pedestal
  if (ny >= 0.72 && ny <= 0.74 && Math.abs(nx - cxMid) <= 0.28) {
    return [212, 175, 55, 200];
  }

  return [r, g, b, a];
}

const publicDir = path.join(__dirname, 'public');

console.log('Generating PWA icons...');

// 192x192
const pwa192 = createPNG(192, 192, (x, y, w, h) => renderIcon(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), pwa192);

// 512x512
const pwa512 = createPNG(512, 512, (x, y, w, h) => renderIcon(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), pwa512);

// 512x512 Maskable
const pwaMaskable = createPNG(512, 512, (x, y, w, h) => renderIcon(x, y, w, h, true));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), pwaMaskable);

// Apple Touch Icon (180x180)
const appleIcon = createPNG(180, 180, (x, y, w, h) => renderIcon(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleIcon);

// Favicon (64x64)
const favicon = createPNG(64, 64, (x, y, w, h) => renderIcon(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), favicon);

console.log('Successfully generated all PWA icons in /public.');
