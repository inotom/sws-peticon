jest.dontMock('../src/Generator.js');
jest.dontMock('mithril');

describe('Generator', function() {
  'use strict';

  const Generator = require('../src/Generator.js');
  const fetchShapes = require('../src/fetchShapes.js');

  it('Initialize', function() {

    let gen = new Generator();

    expect(gen.color()).toBe('#ff0000');
    expect(gen.shape()).toBe('');
    expect(gen.iconURI()).toBe('/icon.svg');
  });

  it('Set color', function() {

    let gen = new Generator();

    gen.setColor('#000000');
    expect(gen.color()).toBe('#000000');
    expect(gen.iconURI()).toBe('/icon.svg?c=000000&s=');

    gen.setColor('ffffff');
    expect(gen.color()).toBe('#ffffff');
    expect(gen.iconURI()).toBe('/icon.svg?c=ffffff&s=');

    gen.setColor('');
    expect(gen.color()).toBe('#ff0000');
    expect(gen.iconURI()).toBe('/icon.svg?c=ff0000&s=');
  });

  it('Set shape', function() {

    fetchShapes.mockImplementation(function(url, getterSetter, callback) {
      getterSetter([
        { key: 'tr-right', label: '右三角形' },
        { key: 'tr-left',  label: '左三角形' }
      ]);
      callback();
    });

    let gen = new Generator();

    expect(gen.shapes()).toEqual([
      { key: 'tr-right', label: '右三角形' },
      { key: 'tr-left',  label: '左三角形' }
    ]);
    expect(gen.shape()).toBe('tr-right');
    expect(gen.iconURI()).toBe('/icon.svg?c=ff0000&s=tr-right');

    gen.selectShape(1);
    expect(gen.shape()).toBe('tr-left');
    expect(gen.iconURI()).toBe('/icon.svg?c=ff0000&s=tr-left');
  });
});
