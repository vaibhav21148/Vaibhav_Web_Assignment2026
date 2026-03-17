import fs from 'fs';
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) results = results.concat(walk(file));
    else if (file.endsWith('.jsx')) results.push(file);
  });
  return results;
}
const files = walk('c:/Users/vaibh/OneDrive/Desktop/Assignment/TryAgain/src');
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const fixed = content.replace(/\\\${/g, '${').replace(/\\`/g, '`');
  if (content !== fixed) {
    fs.writeFileSync(f, fixed);
    console.log('Fixed:', f);
  }
});
