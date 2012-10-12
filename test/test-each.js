var assert = require('assert');
var a = require('../lib');

var list = [1, 2, 3, 4, 5, 6];

var result = [];
var expectedPos = 0;

function _iter(head, pos, fn) {
  assert.equal(pos, expectedPos);
  result.push(head * 5);
  ++expectedPos;
  fn();
}

function _done(e) {
  assert.equal(false, e);

  assert.equal(6, result.length);
  for (var i = 0; i < result.length; ++i) {
    assert.equal(list[i] * 5, result[i]);
  }
}

a.each(list, _iter, _done);

console.log('=== Test 2');
var accumulate = [];
var list2 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
function _slowIter(head, pos, fn) {
  if (pos % 2 == 0) {
    // Confirmation that things don't get out of order.
    setTimeout(function(){ accumulate.push(0) ; fn() }, 200);
    return;
  }
  accumulate.push(1);
  fn();
}

function _slowDone(e) {
  console.log(accumulate);
  for (var i = 0; i < accumulate.length; ++i) {
    assert.equal(i % 2, accumulate[i]);
  }
}

a.each(list2, _slowIter, _slowDone);
