const fs = require('fs');
const path = require('path');

function getPngDimensions(buffer) {
  if (buffer.toString('ascii', 1, 4) === 'PNG') {
    return {
      width: buffer.readUInt32BE(16),
      height: buffer.readUInt32BE(20)
    };
  }
  return null;
}

function getJpegDimensions(buffer) {
  let i = 0;
  if (buffer[0] !== 0xFF || buffer[1] !== 0xD8) return null;
  i += 2;
  while (i < buffer.length) {
    if (buffer[i] !== 0xFF) return null;
    const marker = buffer[i + 1];
    if (marker === 0xC0 || marker === 0xC2) { // SOF0 or SOF2
      return {
        height: buffer.readUInt16BE(i + 5),
        width: buffer.readUInt16BE(i + 7)
      };
    }
    const len = buffer.readUInt16BE(i + 2);
    i += 2 + len;
  }
  return null;
}

const dir = path.join(__dirname, '..', 'images');
for (const file of fs.readdirSync(dir)) {
  const p = path.join(dir, file);
  if (!fs.statSync(p).isFile()) continue;
  const buf = fs.readFileSync(p);
  let dims = getPngDimensions(buf) || getJpegDimensions(buf);
  console.log(`${file}: ${buf.length} bytes, ${dims ? `${dims.width}x${dims.height}` : 'unknown format'}`);
}
