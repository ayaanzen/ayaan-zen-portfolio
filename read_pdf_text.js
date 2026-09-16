const fs = require('fs');
const pdf = require('pdf-parse');

const dataBuffer = fs.readFileSync('Ayaan_Ahmad_Resume_2026.pdf');

const parser = new pdf.PDFParse({ data: dataBuffer });
parser.getText().then(res => {
  console.log('=== RESUME TEXT ===');
  console.log(res);
}).catch(err => {
  console.log('Err:', err);
});
