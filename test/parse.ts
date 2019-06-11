import parse from '../lib/core/parse';

console.log(parse('{"name":{"firstName":"222",// dsdsd "secondName": "11111"}, "age": 13}', { disallowComments: false, allowTrailingComma: true }));


