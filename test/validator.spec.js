const Validate = require('../Validate');
const validator = require('../index');

describe('Validate', () => {
  let validate;
  beforeEach(() => {
    validate = new Validate();
  })

  test('string function', () => {
    validate.string();
    expect(validate.$doValidate('foo')).toBeTruthy();
  })

  test('number function', () => {
    validate.number();
    expect(validate.$doValidate(123)).toBeTruthy();
  })

  test('object function', () => {
    validate.object();
    expect(validate.$doValidate({})).toBeTruthy();
    expect(validate.$doValidate(null)).toBeFalsy();
    expect(validate.$doValidate([])).toBeFalsy();
  })

  test('array function', () => {
    validate.array();
    expect(validate.$doValidate([])).toBeTruthy();
  })

  test('boolean function', () => {
    validate.boolean();
    expect(validate.$doValidate(true)).toBeTruthy();
    expect(validate.$doValidate(false)).toBeTruthy();
  })

  test('isRequire function', () => {
    validate.isRequire();
    expect(validate.$doValidate('foo')).toBeTruthy();
    expect(validate.$doValidate({})).toBeTruthy();
    expect(validate.$doValidate('')).toBeFalsy();
    expect(validate.$doValidate(null)).toBeFalsy();
    expect(validate.$doValidate(undefined)).toBeFalsy();
  })

  test('length function', () => {
    validate.length(3);
    expect(validate.$doValidate('foo')).toBeTruthy();
    expect(validate.$doValidate([1, 2, 3])).toBeTruthy();
    expect(validate.$doValidate((a, b, c) => {})).toBeTruthy();
    expect(validate.$doValidate({})).toBeFalsy();
  })

  test('test function', () => {
    validate.test(/^foo/);
    expect(validate.$doValidate('foo bar')).toBeTruthy();
    expect(validate.$doValidate('bar foo')).toBeFalsy();
  })

  test('is function', () => {
    validate.is('object');
    expect(validate.$doValidate({})).toBeTruthy();
    expect(validate.$doValidate(null)).toBeFalsy();
  })

  test('return this', () => {
    validate.string().isRequire().length(5).test(/^foo/);
    expect(validate.$doValidate('foo66')).toBeTruthy();
  })

  test('Validate.type', () => {
    expect(Validate.type({})).toBe('object')
    expect(Validate.type([])).toBe('array')
    expect(Validate.type('foo')).toBe('string')
  })
})

describe('validator', () => {
  let ctx; // 模拟Koa的ctx
  beforeEach(() => {
    request = {
      query: {
        foo: 123,
        bar: {}
      }
    }
  })

  test('return function', () => {
    const f = validator('query', {});
    expect(f).toEqual(expect.any(Function));
  })


})
