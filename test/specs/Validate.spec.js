const Validate = require('../../src/Validate').default;

describe('Validate', () => {
  let validate;

  const reset = () => {
    validate = new Validate();
  };

  beforeEach(reset);

  test('static getType', () => {
    expect(Validate.getType('foo')).toBe('string');
    expect(Validate.getType(null)).toBe('null');
    expect(Validate.getType({})).toBe('object');
    expect(Validate.getType([])).toBe('array');
  });

  test('constructor', () => {
    expect(() => Validate()).toThrowError();
    expect(() => new Validate()).not.toThrowError();
  });

  test('.string', () => {
    expect(validate.string.$validate('foo')).toBeTruthy();
  });

  test('.number', () => {
    expect(validate.number.$validate(123)).toBeTruthy();
  });

  test('.boolean', () => {
    expect(validate.boolean.$validate(false)).toBeTruthy();
  });

  test('.symbol', () => {
    expect(validate.symbol.$validate(Symbol('foo'))).toBeTruthy();
  });

  test('.array', () => {
    expect(validate.array.$validate([])).toBeTruthy();
  });

  test('.object', () => {
    expect(validate.object.$validate({})).toBeTruthy();
    reset();
    expect(validate.object.$validate([])).toBeFalsy();
  });

  test('.func', () => {
    expect(validate.func.$validate(() => {
    })).toBeTruthy();
  });

  test('.isEmpty', () => {
    expect(validate.isEmpty.$validate('')).toBeTruthy();
    reset();
    expect(validate.isEmpty.$validate(null)).toBeTruthy();
    reset();
    expect(validate.isEmpty.$validate(undefined)).toBeTruthy();
  });

  test('.isRequired', () => {
    expect(validate.isRequired.$validate('')).toBeFalsy();
    reset();
    expect(validate.isRequired.$validate(null)).toBeFalsy();
    reset();
    expect(validate.isRequired.$validate(undefined)).toBeFalsy();
    reset();
    expect(validate.string.isRequired.$validate(123)).toBeFalsy();
  });

  test('.not', () => {
    expect(validate.string.not.$validate(123)).toBeTruthy();
  });

  test('.length()', () => {
    expect(validate.length(3).$validate('foo')).toBeTruthy();
    reset();
    expect(validate.length(3).$validate([1, 2, 3])).toBeTruthy();
    reset();
    // eslint-disable-next-line no-unused-vars
    expect(validate.length(3).$validate((a, b, c) => {
    })).toBeTruthy();
  });

  test('.test()', () => {
    expect(validate.test(/^\d+$/).$validate('123')).toBeTruthy();
    reset();
    expect(() => validate.test('foo')).toThrowError();
  });

  test('.isType()', () => {
    expect(validate.isType('object').$validate({})).toBeTruthy();
    reset();
    expect(validate.isType('boolean').$validate(false)).toBeTruthy();
  });

  test('.equals()', () => {
    expect(validate.equals('foo').$validate('foo')).toBeTruthy();
    reset();
    expect(validate.equals({}).$validate({})).toBeFalsy();
  });

  test('.arrayOf()', () => {
    expect(validate.arrayOf(new Validate().string).$validate(['Alice', 'Bob', 'Cindy'])).toBeTruthy();
    reset();
    expect(validate.arrayOf(new Validate().string).$validate(['Alice', 123, 'Cindy'])).toBeFalsy();
    reset();
    expect(() => validate.arrayOf('foo')).toThrowError();
  });

  test('.shape()', () => {
    expect(validate.shape({
      a: new Validate().number,
      b: new Validate().string
    }).$validate({
      a: 123,
      b: 'foo'
    })).toBeTruthy();
    reset();
    expect(validate.shape({
      a: new Validate().number,
      b: new Validate().string
    }).$validate({
      a: 123
    })).toBeTruthy();
    reset();
    expect(validate.shape({
      a: new Validate().number
    }).$validate({
      a: 123,
      b: 'foo'
    })).toBeTruthy();
    reset();
    expect(validate.shape({
      a: new Validate().number,
      b: new Validate().string.isRequired,
    }).$validate({
      a: 123
    })).toBeFalsy();
    reset();
    expect(validate.shape({}).$validate(123)).toBeFalsy();
    reset();
    expect(() => validate.shape('foo')).toThrowError();
    reset();
    expect(() => validate.shape({ a: 'foo' }).$validate({})).toThrowError();
  });

  test('.oneOf()', () => {
    const v1 = new Validate().string;
    const v2 = new Validate().number;
    expect(validate.oneOf(v1, v2).$validate(123)).toBeTruthy();
    reset();
    expect(validate.oneOf(v1, v2).$validate('foo')).toBeTruthy();
    reset();
    expect(validate.oneOf(v1, v2).$validate([])).toBeFalsy();
    reset();
    expect(() => validate.oneOf('foo')).toThrowError();
  });

  test('.enums()', () => {
    expect(validate.enums('foo', 123).$validate('foo')).toBeTruthy();
    reset();
    expect(validate.enums('foo', 123).$validate(123)).toBeTruthy();
    reset();
    expect(validate.enums('foo', 123).$validate('123')).toBeFalsy();
    reset();
    expect(validate.enums('foo', 123).$validate('bar')).toBeFalsy();
  });

  test('.reset()', () => {
    expect(validate.string.reset().number.$validate(123)).toBeTruthy();
    reset();
    expect(validate.string.reset().number.$validate('foo')).toBeFalsy();
  });
});
