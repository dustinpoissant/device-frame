import { minify } from 'terser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputFile = path.join(__dirname, '..', 'DeviceFrame.js');
const outputFile = path.join(__dirname, '..', 'DeviceFrame.min.js');

const code = fs.readFileSync(inputFile, 'utf8');

const result = await minify(code);

if (result.error) {
  console.error('Minification error:', result.error);
  process.exit(1);
}

fs.writeFileSync(outputFile, result.code);
console.log('Minified DeviceFrame.js to DeviceFrame.min.js');
