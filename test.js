const { readFileSync, writeFileSync } = require('fs');
const { isPlainObject, mapKeys, mapValues } = require('lodash');

const mapValuesDeep = (object, callback) => {
  if (typeof object === 'string') return callback(object);
  if (Array.isArray(object)) return object.map(item => mapValuesDeep(item, callback));
  if (!isPlainObject(object)) return object;
  return mapValues(object, item => mapValuesDeep(item, callback));
};

const separator = '^';
const json = require('./src/locales/en.json');
// const json = { a: 'test' };

const wording = [];
mapValuesDeep(json, word => wording.push(word));

console.log('wording.length', wording.length);
console.log('wording.join(\'|\').length', wording.join(separator).length);
const chunks = Math.ceil(wording.join(separator).length / 5000);
console.log('chunks', chunks);
const wordsPerChunk = Math.ceil(wording.length / chunks);
console.log('wordsPerChunk', wordsPerChunk);
for (let c = 0; c < chunks; c += 1) {
  console.log('length', wording.slice(c * wordsPerChunk, (c + 1) * wordsPerChunk).length);
  const data = wording.slice(c * wordsPerChunk, (c + 1) * wordsPerChunk).join(separator);
  if (data.length > 5000) throw Error('Invalid chunk data');
  writeFileSync(`./chunk_${c}.txt`, data);
}

console.log('Press any key to continue.');
process.stdin.once('data', () => {
  let processedWords = [];
  for (let c = 0; c < chunks; c += 1) {
    console.log('length', readFileSync(`./chunk${c}.txt`).toString().split(separator).length);
    processedWords = processedWords.concat(
      readFileSync(`./chunk${c}.txt`)
        .toString().split(separator)
        .map(word => word.trim()),
    );
  }
  console.log('processedWords.length', processedWords.length);

  if (processedWords.length !== wording.length) throw Error('Invalid chunks');

  let wordIdx = -1;
  writeFileSync(
    './out.json',
    JSON.stringify(
      mapValuesDeep(json, () => processedWords[wordIdx += 1]),
      2, 2,
    ),
  );
  process.exit();
});
