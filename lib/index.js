/**
 * A suite of functional tools specifically for asynchronous processing.
 *
 * What this library is for:
 * - Iterating with asynchronous operations.
 *
 * What this library is NOT for:
 * - Plain iteration. Native forEach, reduce and so on are faster.
 */

/**
 * Recurse through a list.
 *
 * Recurse through a list, calling `iterator(item, index, stop)` for each 
 * element. When the list has been traversed, this calls `done(Error e)`.
 *
 * This is designed for asynchronous looping. For example, you can stat() a
 * list of files (using fs.stat) and then be called back when the stats are
 * all complete.
 *
 * The original list is left intact (though the supplied iterator may change it).
 *
 * @see dequeue
 *
 * @param {Array} list
 *   An array.
 * @param {Function} iterator
 *   A function, which will be called once for each item (in head-to-tail
 *   order) like this: `iterator(item, index, stop)`.
 *   - item: one of the items in the list.
 *   - index: the integer index of the current item in the original list.
 *   - callback: The callback to fire. It takes one optional argument, 
 *     which (if truthy) will stop loop execution.
 * @param {Object} context
 *   The context in which the iterator should run (probably `this`)
 * @param {Function} done
 *   A function that will be called when the loop is complete.
 */
var _e = exports.each = function (list, iterator, done, context) {
  var pos = -1;
  function _each(bailOut) {
    ++pos;
    if (bailOut || pos == list.length) {
      done.call(context, false);
      return;
    }

    var head = list[pos];
    iterator.call(context, head, pos, _each);
  }

  _each();
}

/**
 * Run a mapping function on each item in a list.
 *
 * @param {Array} list
 *   The list.
 * @param {Function} mapper
 *   The function to run on each item in the list. It is called:
 *   fn(item, index, callback);
 *   When it has finished mapping, it should call
 *   callback(Error e, mappedItem);
 *   The mappedItem will be added to the mapped list, which is
 *   returned with the done function.
 * @param {Function} done
 *   The function called when the list has been traversed. This
 *   will be given two arguments:
 *   fn(Error e, Array map);
 *   The map will contain all of the mapped items.
 * @param {Object} context
 *   If this is supplied, functions will be executed in that
 *   context.
 */
exports.collect =
exports.map = function (list, mapper, done, context) {
  var _collector = [];
  function _map(head, pos, next) {
    mapper.call(context, head, pos, function (e, item) {
      // We push undefined and null.
      if (!e) _collector.push(item);
      next(e);
    });
  }
  function _done(e) {
    done.call(context, e, _collector);
  }
  _e(list, _map, _done, context);
}

/**
 * Given an initial value, a list, and a reducer, fold the list.
 *
 * This is a classic foldLeft. It takes an initial value, and folds the list
 * into the value by running it through the reducer function.
 *
 * The reducer will be called like this:
 *
 * reducer(accumulatedValue, currentItem, callback);
 *
 * Here, accumulated value is the result of the initial state plus all of the
 * transformations that have happened up to this time. So on the first iteration,
 * accumulatedValue will be the same as the initial value.
 *
 * Then the folding is complete, the `done` function will be called like this:
 *
 * done(e, finalValue)
 *
 * IMPORTANT: The original list is not modified.
 *
 * @param {mixed} init
 *   The initial value.
 * @param {Array} list
 *   The list of items.
 * @param {Function} reducer
 *   The reducing function, which will be called as:
 *   reducer(accumulatedValue, currentItem, callback)
 *   The callback is called as:
 *    callback(stop)
 *   If stop is truthy, iteration will halt.
 *   Otherwise, iteration will continue until the entire list has been traversed.
 * @param {Object} context
 *   If set, the iteration will be performed in that object's context. Often
 *   this is set to `this`.
 *
 *
 * @see http://oldfashionedsoftware.com/2009/07/30/lots-and-lots-of-foldleft-examples/
 */
exports.foldLeft =
exports.reduce = function (init, list, reducer, done, context) {
  var _value;
  function _reducer(head, pos, next) {
    reducer.call(context, init, head, function (e, accumulatedValue) {
      _value = accumulatedValue;
      next();
    });
  }
  function _done(e) {
    done.call(context, e, _value);
  }
  _e(list, _reducer, _done, context);
}

/**
 * This takes a queue and depopulates it.
 *
 * Each item in the queue is passed into the `iterator` function. If this
 * traverses the entire queue, the queue will be empty.
 *
 * The internals of this function are such that you can safely push items onto
 * the queue during iteration. So it can be used for deep traversals (like
 * traversing a directory structure.)
 *
 * @param {Array} list
 *   An array.
 * @param {Function} iterator
 *   A function, which will be called once for each item (in head-to-tail
 *   order) like this: `iterator(item, stop)`.
 *   - item: one of the items in the list.
 *   - callback: The callback to fire. It takes one optional argument, 
 *     which (if truthy) will stop loop execution.
 * @param {Object} context
 *   The context in which the iterator should run (probably `this`)
 * @param {Function} done
 *   A function that will be called when the loop is complete. If this stopped because
 *   an iteration returned a stopping condition, the stopping condition is passed as
 *   the only argument. This can be used for handling errors, but you can be creative
 *   and use it in other ways, too.
 */
exports.dequeue = function (queue, iterator, done, context) {
  function _dq(bailOut) {
    if (bailOut || queue.length == 0) {
      done.call(context, bailOut);
      return;
    }
    var head = queue.shift();
    iterator.call(context, head, _dq);
  }
  _dq();
}

/**
 * Get the last function in a list of arguments.
 *
 * One of Node.js's sytlistic prefernces is for callback functions to be
 * placed at the end of the arguments list:
 *
 * function (foo, bar, baz, callback) {}
 *
 * Optional arguments and varargs make this difficult, for this style dictats
 * that optional arguments look like this:
 *
 * function(required, optional1, optional2, callback) {};
 *
 * Varargs patters are difficult to work with, too, for the same reason.
 *
 * What this does is get the last function on the arguments list. While it's 
 * only a partial solution to the optional arguments problem, it helps.
 */
exports.lastFn = function (args, targetName) {
  for (var i = args.length - 1; i >= 0; --i) {
    if(typeof args[i] == 'function') {
      return args[i];
    }
  }
}

