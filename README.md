# Aleph: An asynchronous iteration libary

**This library was an experiment, and is not currently maintained.** If
 you are looking for similar tools, try `async.js`.

This package contains utility functions primarily oriented around
asynchronous recursive iteration.

Recent versions of JavaScript have a veritable armory of iteration
features. But these are designed for synchronous iteration. Node.js (and
probably other asynchronous JavaScript tools) does not always best work
with this model of iteration.

This library provides a handful of prominent iteration functions that
work for asynchronous models.


Example:
``` javascript

var a = require('aleph');
var assert = require('assert');

var list = [1, 2, 3, 4, 5, 6];
var result = [];

// Multiply an item by 5.
function _iter(head, pos, fn) {
  result.push(head * 5);
  fn();
}

// When each() is done, check that each item 
// is multiplied by 5.
function _done(e) {
  for (var i = 0; i < result.length; ++i) {
    assert.equal(list[i] * 5, result[i]);
  }
}

a.each(list, _iter, _done);
// result == [5, 10, 15, 20, 25, 30]

```

The place to start in the example above is with the last line. There, we
iterate over a list, passing each item to the function called `_iter`.

When the list has been traversed, `a.each` will call `_done`.

The above demonstrates an attribute of many traversal functions in this
library: Once iteration is complete, a `done` callback is executed. This
provides asynchronous implementations with a way to hook back in.

## But library X does this...

There may be other Node.js libraries that provide this functionality. I
would be surprised if there weren't. If you know of some, post an issue
in the issue tracker and I will include a link here.

This library was created mainly as an educational exercise. But as often
happens, it has now worked its way into other projects.
