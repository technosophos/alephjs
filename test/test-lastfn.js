
var assert = require('assert');
var A = require('../lib');

function test1(a, b, c, d, e, f, g, h) {
  h = A.lastFn(arguments); 

  return h();
}

var res = test1(1, 2, 3, function(){return 77;});
assert.equal(77, res);

res = test1(1, 2, 3, 4, 5, 6, 7, 8, function(){return 77;});
assert.equal(77, res);

res = test1(1, 2, 3, 4, function(){return 77;}, 6, 7, 8);
assert.equal(77, res);
