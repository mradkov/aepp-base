const { readFileSync, writeFileSync } = require('fs');
const { isPlainObject, mapKeys, mapValues } = require('lodash');

const separator = '^';

const words1 = readFileSync(`./chunk0.txt`)
  .toString().split(separator)
  .map(word => word.trim());
const words2 = readFileSync(`./chunk_0.txt`)
  .toString().split(separator)
  .map(word => word.trim());

console.log(words1.length, words2.length);

for (let c = 0; c < Math.max(words1.length, words2.length); c += 1) {
  console.log('***');
  console.log(words1[c]);
  console.log(words2[c]);
}
