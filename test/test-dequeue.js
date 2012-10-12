var assert = require('assert');
var a = require('../lib');

var list = [1, 2, 3, 4, 5, 6];

var result = [];
var expectedPos = 0;

function _iter(head, fn) {
  result.push(head * 5);
  ++expectedPos;
  fn();
}

function _done(e) {
  assert.equal(6, result.length);
  for (var i = 0; i < result.length; ++i) {
    assert.equal((i + 1) * 5, result[i]);
  }

  assert.ok(list.length == 0);
}

a.dequeue(list, _iter, _done);

console.log('TEST 2');

var q = [1, 2, 3, 4, 5, 6, 7, 8];
a.dequeue(q, function (item, cb) {
  if (item == 5) {
    cb(5);
    return;
  }
  cb();
},
function (five) {
  assert.equal(5, five);
  assert.equal(3, q.length);
});
