(function(root, factory) {
  'use strict';

  if (typeof exports === 'object') { // CommonJS
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) { // RequireJS
    define([], factory);
  } else { // <script>
    root.fetchShapes = factory();
  }
})(this, function() {
  'use strict';

  const m = require('mithril');

  return function(url, setterGetter, callback) {
    m.request({
        method: 'GET',
        url: url
    }).then(setterGetter)
      .then(callback);
  };
});
