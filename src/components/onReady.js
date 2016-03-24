(function(root, factory) {
  'use strict';

  if (typeof exports === 'object') { // CommonJS
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) { // RequireJS
    define([], factory);
  } else { // <script>
    root.onReady = factory();
  }
})(this, function() {
  'use strict';

  var addEvent    = require('./addEvent.js'),
      removeEvent = require('./removeEvent.js'),
      myModule;

  if (addEvent.HAS_ADD_EVENT_LISTENER) {
    myModule = function(fn) {
      addEvent(document, 'DOMContentLoaded', fn);
    };
  } else {
    myModule = function(fn) {
      var checkState = function() {
        if (document.readyState === 'complete') {
          removeEvent(document, 'readystatechange', checkState);
          fn();
        }
      }
      addEvent(document, 'readystatechange', checkState);
      (function() {
        try {
          document.documentElement.doScroll('left');
        } catch (e) {
          setTimeout(arguments.callee, 10);
          return;
        }
        removeEvent(document, 'readystatechange', checkState);
      })();
    };
  }

  return myModule;
});
