/*!
 * Peticon script
 *
 * @author iNo <wdf7322@yahoo.co.jp>
 * @version 1.0.0
 * @license MIT
 */

(function() {
  'use strict';

  const m = require('mithril'),
        onReady = require('./components/onReady.js'),
        Generator = require('./Generator.js');

  // View Model
  let vm = (function() {
    let vm = {};
    vm.init = function() {
      vm.generator = new Generator();
    };
    vm.shape = function(index) {
      vm.generator.selectShape(index);
    };
    vm.color = function(color) {
      vm.generator.setColor(color);
    };
    return vm;
  })();

  const appComponent = {
    // Controller
    controller: function() {
      vm.init();
    },
    // View
    view: function() {
      return m('div', [
        m('h2', 'アイコン形状選択'),
        m('ul.shape-list', vm.generator.shapes().map(function(shape, index) {
          return m('li', [
            m('input[type=radio][name=s]', {
              id: shape.key,
              onchange: function() {
                vm.shape(index);
              },
              value: shape.key,
              checked: (shape.key === vm.generator.shape())
            }),
            m('label', {
              for: shape.key
            }, shape.label)
          ]);
        })),
        m('h2', 'アイコン色選択'),
        m('div.color-box', [
          m('input[type=color][name=c]', {
            onchange: m.withAttr('value', function(value) {
              vm.color(value);
            }),
            value: vm.generator.color()
          }),
          m('input.color-field[type=text][size=7]', {
            pattern: "^\#[a-fA-F\\d]{6}$",
            onchange: m.withAttr('value', function(value) {
              vm.color(value);
            }),
            value: vm.generator.color()
          })
        ]),
        m('div.icon-container', [
          m('div.icon-box', [
            m('img', {
              src: vm.generator.iconURI(),
              width: 100,
              height: 100
            })
          ]),
          m('div.link-box', [
            m('a.link', {
              href: vm.generator.iconURI(),
              download: 'icon.svg'
            }, 'Download')
          ])
        ])
      ]);
    }
  };

  onReady(function() {
    m.mount(document.getElementById('app'), appComponent);
  });
})();
