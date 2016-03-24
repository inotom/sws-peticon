(function(root, factory) {
  'use strict';

  if (typeof exports === 'object') { // CommonJS
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) { // RequireJS
    define([], factory);
  } else { // <script>
    root.removeEvent = factory();
  }
})(this, function() {
  'use strict';

  var HAS_REMOVE_EVENT_LISTENER = typeof window.removeEventListener === 'function';
  var myModule;
  if (HAS_REMOVE_EVENT_LISTENER) { // modern browser
    myModule = function(el, type, fn) {
      el.removeEventListener(type, fn, false);
    };
  } else if (document.removeEvent) { // IE (not using typeof, because IE8 return 'object')
    myModule = function(el, type, fn) {
      el.removeEvent('on' + type, function() {
        fn.apply(el, arguments);
      });
    };
  } else { // other
    myModule = function(el, type, fn) {
      el['on' + type] = null;
    };
  }
  myModule.HAS_REMOVE_EVENT_LISTENER = HAS_REMOVE_EVENT_LISTENER;
  return myModule;
});
