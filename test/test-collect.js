var assert = require('assert');
var a = require('../lib');

var list = [1, 2, 3, 4, 5, 6];
var done = function (e, result) {
  assert.equal(6, result.length);
  assert.equal(12, result[5]);
  assert.equal(2, result[0]);
  console.log(result);
}
var iter = function (item, i, fn) { fn(false, item * 2) }
a.collect(list, iter , done, this);
a.map(list, iter, done, this);
