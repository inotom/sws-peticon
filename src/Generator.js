(function(root, factory) {
  'use strict';

  if (typeof exports === 'object') { // CommonJS
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) { // RequireJS
    define([], factory);
  } else { // <script>
    root.Generator = factory();
  }
})(this, function() {
  'use strict';

  const m = require('mithril');
  const fetchShapes = require('./fetchShapes.js');

  return class {
    constructor() {
      this.color = m.prop('#ff0000');
      this.shape = m.prop('');
      this.iconURI = m.prop('/icon.svg');
      this.shapes = m.prop([]);
      fetchShapes('/shapes.json', this.shapes, () => {
        if (this.shapes().length > 0) {
          this.selectShape(0);
        }
      });
    }

    setColor(color) {
      let cl = color;
      if (!color.match(/^#?[a-fA-F\d]{6}$/)) {
        cl = '#ff0000';
      } else if (color.indexOf('#') !== 0) {
        cl = '#' + color;
      }
      this.color(cl);
      this.setIconURI();
    }

    selectShape(index) {
      let key = '';
      if (index < this.shapes().length) {
        key = this.shapes()[index].key;
        this.shape(key);
        this.setIconURI();
      }
      return this.shape(key);
    }

    setIconURI() {
      let color = this.color();
      if (color.indexOf('#') === 0) {
        color = color.slice(1, color.length);
      }
      this.iconURI(`/icon.svg?c=${color}&s=${this.shape()}`);
    }
  };
});
