(function(root, factory) {
  'use strict';

  if (typeof exports === 'object') { // CommonJS
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) { // RequireJS
    define([], factory);
  } else { // <script>
    root.addEvent = factory();
  }
})(this, function() {
  'use strict';

  var HAS_ADD_EVENT_LISTENER = typeof window.addEventListener === 'function';
  var myModule;
  if (HAS_ADD_EVENT_LISTENER) { // modern browser
    myModule = function(el, type, fn) {
      el.addEventListener(type, fn, false);
    };
  } else if (document.attachEvent) { // IE (not using typeof, because IE8 return 'object')
    myModule = function(el, type, fn) {
      el.attachEvent('on' + type, function() {
        fn.apply(el, arguments);
      });
    };
  } else { // other
    myModule = function(el, type, fn) {
      var evtType = 'on' + type;
      var _fn = el[evtType];
      if (typeof _fn !== 'function') {
        el[evtType] = fn;
      } else {
        el[evtType] = function() {
          _fn();
          fn();
        };
      }
    }
  }
  myModule.HAS_ADD_EVENT_LISTENER = HAS_ADD_EVENT_LISTENER;
  return myModule;
});
