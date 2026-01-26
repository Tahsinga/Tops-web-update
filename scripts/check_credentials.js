const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'static', 'js', 'editor.js');
const src = fs.readFileSync(file, 'utf8');

function extract(name){
  const re = new RegExp("const\\s+"+name+"\\s*=\\s*['\"]([^'\"]+)['\"]");
  const m = src.match(re);
  return m ? m[1] : null;
}

const user = extract('USERNAME');
const pass = extract('PASSWORD');
console.log('Detected editor credentials:');
console.log('USERNAME:', user);
console.log('PASSWORD:', pass);
