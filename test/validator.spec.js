const Validate = require('../src/Validate');
const validator = require('../src/index');

describe('class Validate', () => {
  let validate;
  beforeEach(() => {
    validate = new Validate();
  });

  test('called by new', () => {
    expect(() => Validate()).toThrowError();
    expect(() => new Validate()).not.toThrowError();
  });

  test('string()', () => {
    validate.string();
    expect(validate.doValidate('foo')).toBeTruthy();
  });

  test('number()', () => {
    validate.number();
    expect(validate.doValidate(123)).toBeTruthy();
  });

  test('object()', () => {
    validate.object();
    expect(validate.doValidate({})).toBeTruthy();
    expect(validate.doValidate([])).toBeFalsy();
  });

  test('array()', () => {
    validate.array();
    expect(validate.doValidate([])).toBeTruthy();
  });

  test('boolean()', () => {
    validate.boolean();
    expect(validate.doValidate(true)).toBeTruthy();
    expect(validate.doValidate(false)).toBeTruthy();
  });

  test('isRequire()', () => {
    validate.isRequire();
    expect(validate.doValidate('foo')).toBeTruthy();
    expect(validate.doValidate({})).toBeTruthy();
    expect(validate.doValidate('')).toBeFalsy();
    expect(validate.doValidate(null)).toBeFalsy();
    expect(validate.doValidate(undefined)).toBeFalsy();
  });

  test('length()', () => {
    validate.length(3);
    expect(validate.doValidate('foo')).toBeTruthy();
    expect(validate.doValidate([1, 2, 3])).toBeTruthy();
    expect(validate.doValidate((a, b, c) => {
    })).toBeTruthy();
    expect(validate.doValidate({})).toBeFalsy();
  });

  test('test()', () => {
    validate.test(/^foo/);
    expect(validate.doValidate('foo bar')).toBeTruthy();
    expect(validate.doValidate('bar foo')).toBeFalsy();
  });

  test('is()', () => {
    validate.is('object');
    expect(validate.doValidate({})).toBeTruthy();
    expect(validate.doValidate([])).toBeFalsy();
  });

  test('equals()', () => {
    validate.equals('foo');
    expect(validate.doValidate('foo')).toBeTruthy();
    expect(validate.doValidate('bar')).toBeFalsy();

    validate.reset();
    validate.equals('123');
    expect(validate.doValidate('123')).toBeTruthy();
    expect(validate.doValidate(123)).toBeFalsy();
  });


  test('not()', () => {
    validate.not().string();
    expect(validate.doValidate(123)).toBeTruthy();
  });

  test('not() 2', () => {
    validate.not().not().string();
    expect(validate.doValidate('foo')).toBeTruthy();
  });

  test('arrayOf()', () => {
    // 需要创建一个新的 Validate 对象
    validate.arrayOf(new Validate().string().isRequire()).length(3);
    expect(validate.doValidate(['Alice', 'Bob', 'Cindy'])).toBeTruthy();
    expect(() => {
      new Validate().arrayOf('string').doValidate(['foo'])
    }).toThrowError()
  });

  test('oneOf()', () => {
    const v1 = new Validate().string().length(3);
    const v2 = new Validate().number();
    expect(new Validate().oneOf(v1, v2).doValidate(123)).toBeTruthy();
    expect(new Validate().oneOf(v1, v2).doValidate('foo')).toBeTruthy();
    expect(() => new Validate().oneOf('bar').doValidate()).toThrowError();
    expect(new Validate().oneOf(v1, v2).doValidate()).toBeTruthy();
  });

  test('enums()', () => {
    validate.enums('foo', '123');
    expect(validate.doValidate('foo')).toBeTruthy();
    expect(validate.doValidate('123')).toBeTruthy();
    expect(validate.doValidate(123)).toBeFalsy();
    expect(validate.doValidate('Alice')).toBeFalsy();
  });

  test('reset()', () => {
    validate.string();
    expect(validate.doValidate('foo')).toBeTruthy();
    validate.reset().number();
    expect(validate.doValidate(123)).toBeTruthy();
  });

  test('return this', () => {
    validate.string().isRequire().length(5).test(/^foo/);
    expect(validate.doValidate('foo66')).toBeTruthy();
  });

  test('Validate.type()', () => {
    expect(Validate.type({})).toBe('object');
    expect(Validate.type(null)).toBe('null');
    expect(Validate.type([])).toBe('array');
    expect(Validate.type('foo')).toBe('string');
  });
});

describe('validator()', () => {
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
  }

  test('plain object', () => {
    expect(validator(obj, {
      foo: validator.number().isRequire(),
      bar: validator.string().isRequire(),
      child: validator.object()
    })).toBeTruthy();
  })

  test('object detail', () => {
    expect(validator(obj, {
      foo: validator.test(/^\d+$/),
      bar: validator.string().length(5),
      child: {
        foo: validator.boolean().isRequire(),
        bar: validator.array().length(4),
        child: validator.object()
      }
    })).toBeTruthy();
    expect(validator(obj, {
      child: {
        child: {
          bar: validator.test(/null/)
        }
      }
    })).toBeTruthy();
    expect(validator(obj, {
      bar: validator.equals('hello'),
      foo: validator.enums('123', 123)
    })).toBeTruthy();
  })

  test('more functions', () => {
    const obj2 = {
      a: 'foo',
      b: 123,
      c: {},
      d: [1, 2, 3],
      e: false,
      f: ''
    }
    expect(validator(obj2, {
      a: validator.string().isRequire(),
      b: validator.number(),
      c: validator.object(),
      d: validator.array().length(3),
      e: validator.boolean(),
      f: validator.not().isRequire(),
      g: validator.string()
    })).toBeTruthy();

    expect(validator(obj2, {
      d: validator.arrayOf(validator.number().isRequire()).length(3),
      e: validator.oneOf(validator.number(), validator.boolean()).isRequire(),
      f: validator.isRequire().reset().test(/\.*/)
    })).toBeTruthy();

    expect(() => validator(obj2, {
      d: 'test',
    })).toThrowError()


  })
})

describe('validator.extend', () => {
  validator.extend({
    isNull(value) {
      return value === null;
    },
    isUppercase(value) {
      return /^[A-Z]+$/.test(value);
    }
  });
  const obj = {
    foo: null,
    bar: 'HELLO'
  }

  test('extend', () => {
    expect(validator(obj, {
      foo: validator.isNull(),
      bar: validator.isUppercase().length(5).isRequire()
    })).toBeTruthy();
  })

  test('extend 2', () => {
    validator.extend({
      any(value) {
        return true;
      }
    });

    expect(validator(obj, {
      bar: validator.isUppercase().any().isRequire()
    })).toBeTruthy();
  })

  test('extend 3', () => {
    expect(() => validator.extend({
      isTruth: true
    })).toThrowError()
  })
})

describe('validator extend reserved keyword', () => {
  const keywords = [
    'extend', 'arguments', 'caller', 'length', 'prototype', 'apply', 'bind',
    'call', 'toString', 'toLocaleString', 'name', 'constructor', 'valueOf',
    'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable',
    '$flag', '$validRules', 'doValidate', 'value'
  ]
  keywords.forEach(keyword => {
    test(keyword, () => {
      const options = {}
      options[keyword] = jest.fn()
      expect(() => validator.extend(options)).toThrowError(/is reserved keyword/)
    })
  })
})
