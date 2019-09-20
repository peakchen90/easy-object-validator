const validator = require('../../src').default;

describe('validator', () => {
  const obj = {
    foo: 123,
    bar: 'hello',
    child: {
      foo: true,
      bar: [1, 2, 3, 4],
      child: {
        bar: null
      }
    }
  };

  test('basic', () => {
    expect(validator('foo', validator.string)).toBeTruthy();
    expect(validator([], validator.array)).toBeTruthy();
    expect(validator({}, validator.object)).toBeTruthy();
  });

  test('plain object', () => {
    expect(validator(obj, {
      foo: validator.number,
      bar: validator.string,
      child: validator.object
    })).toBeTruthy();
  });

  test('plain array', () => {
    expect(validator(['foo', 123, {
      child: false
    }], [validator.string, validator.number, {
      child: validator.boolean.isRequired
    }])).toBeTruthy();
  });

  test('object detail', () => {
    expect(validator(obj, {
      foo: validator.test(/^\d+$/),
      bar: validator.string.length(5),
      child: {
        foo: validator.boolean.isRequired,
        bar: validator.array.length(4),
        child: validator.shape({
          bar: validator.isEmpty
        })
      }
    })).toBeTruthy();
    expect(validator(obj, {
      child: {
        child: {
          bar: validator.isEmpty
        }
      }
    })).toBeTruthy();
    expect(validator(obj, {
      bar: validator.equals('hello'),
      foo: validator.enums('123', 123)
    })).toBeTruthy();
  });

  test('more functions', () => {
    const obj2 = {
      a: 'foo',
      b: 123,
      c: {},
      d: [1, 2, 3],
      e: false,
      f: '',
      g: () => {
      }
    };
    expect(validator(obj2, {
      a: validator.string.isRequired,
      b: validator.number,
      c: validator.object,
      d: validator.array.length(3),
      e: validator.boolean,
      f: validator.not.isRequired,
      g: validator.func.isRequired,
      h: validator.string
    })).toBeTruthy();

    expect(validator(obj2, {
      d: validator.arrayOf(validator.number.isRequired).length(3),
      e: validator.oneOf(validator.number, validator.boolean).isRequired,
      f: validator.number.isRequired.reset().object
    })).toBeTruthy();
  });

  test('abnormal', () => {
    expect(validator('foo', 'foo')).toBeFalsy();
  });

  test('circular reference', () => {
    const obj2 = {};
    obj2.a = obj2;
    expect(() => validator(obj2, validator.object)).not.toThrowError(/circular reference/);
    expect(() => validator({}, obj2)).toThrowError(/circular reference/);
  });

  test('.extend()', () => {
    validator.extend('isUppercase', (val) => /^[A-Z]+$/.test(val), true);
    validator.extend('named', (val, name) => val === name);
    expect(validator('HELLO', validator.isUppercase.isRequired)).toBeTruthy();
    expect(validator('foo', validator.named('foo').isRequired)).toBeTruthy();
  });

  test('extend catch', () => {
    [
      'arguments', 'caller', 'length', 'prototype', 'apply', 'bind',
      'call', 'toString', 'toLocaleString', 'name', 'constructor',
      'isPrototypeOf', 'propertyIsEnumerable', 'valueOf', 'hasOwnProperty',
      'extend', '_rules', '_isOpposite', '_isRequired', '$validate'
    ].forEach((keyword) => {
      expect(() => validator.extend(keyword, jest.fn())).toThrowError(/is reserved keyword/);
      expect(() => validator.extend('a')).toThrowError();
    });
  });
});
