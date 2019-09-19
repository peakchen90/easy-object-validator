const { defineGetter } = require('../../src/utils');

describe('utils', () => {
  let obj;

  beforeEach(() => {
    obj = {};
  });

  test('defineGetter', () => {
    defineGetter(obj, 'foo', () => 'get foo');
    defineGetter(obj, 'bar', () => () => 'get bar');
    expect(obj.foo).toBe('get foo');
    expect(obj.bar()).toBe('get bar');
  });
});
