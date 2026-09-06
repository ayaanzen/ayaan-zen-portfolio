const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const indexPath = path.resolve(__dirname, '..', 'index.html');
const source = fs.readFileSync(indexPath, 'utf8');
const manifestMatch = source.match(/(<script type="__bundler\/manifest">\s*)([\s\S]*?)(\s*<\/script>)/);

if (!manifestMatch) {
  throw new Error('Embedded resource manifest was not found.');
}

const manifest = JSON.parse(manifestMatch[2]);

(async () => {
  let optimizedBytes = 0;
  let originalBytes = 0;

  for (const entry of Object.values(manifest)) {
    if (!entry.mime || !entry.mime.startsWith('image/') || entry.mime === 'image/webp') continue;

    const input = Buffer.from(entry.data, 'base64');
    const output = await sharp(input).webp({ quality: 82, effort: 4 }).toBuffer();
    originalBytes += input.length;
    optimizedBytes += output.length;
    entry.mime = 'image/webp';
    entry.compressed = false;
    entry.data = output.toString('base64');
  }

  const nextManifest = JSON.stringify(manifest);
  const nextSource = source.slice(0, manifestMatch.index) +
    manifestMatch[1] + nextManifest + manifestMatch[3] +
    source.slice(manifestMatch.index + manifestMatch[0].length);

  fs.writeFileSync(indexPath, nextSource);
  console.log(`Optimized embedded images: ${Math.round(originalBytes / 1024)} KB -> ${Math.round(optimizedBytes / 1024)} KB`);
})();