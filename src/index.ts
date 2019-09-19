import Validate from './Validate';
import {defineGetter} from './utils';

/**
 * 判断是否是引用类型（对象、数组）
 * @param val
 */
function isReferenceType(val: any): boolean {
  const type = Validate.getType(val);
  return type === 'object' || type === 'array';
}

/**
 * 封装校验方法
 * @param val 校验的值
 * @param option 校验规则
 * @param _parent 保存父级已经遍历的引用
 */
function _validator(val: any, option: any, _parent: any[] = []): boolean {
  if (option instanceof Validate) {
    return option.$validate(val);
  }

  // 处理循环引用
  if (isReferenceType(option)) {
    if (_parent.includes(option)) {
      throw new Error('The validate option has a circular reference');
    }

    // 值为一个对象或数组
    if (isReferenceType(val)) {
      return Object.keys(option).every((key) => {
        const value = val[key];
        const validate = option[key];
        return _validator(value, validate, [..._parent, option]);
      });
    }
  }

  return false;
}

/**
 * 暴露方法
 */

function validator(val: any, option: any): boolean {
  return _validator(val, option);
}

defineGetter(validator, 'string', (): Validate => new Validate().string);
defineGetter(validator, 'number', (): Validate => new Validate().number);
defineGetter(validator, 'boolean', (): Validate => new Validate().boolean);
defineGetter(validator, 'symbol', (): Validate => new Validate().symbol);
defineGetter(validator, 'array', (): Validate => new Validate().array);
defineGetter(validator, 'object', (): Validate => new Validate().object);
defineGetter(validator, 'func', (): Validate => new Validate().func);
defineGetter(validator, 'isEmpty', (): Validate => new Validate().isEmpty);
defineGetter(validator, 'isRequired', (): Validate => new Validate().isRequired);
defineGetter(validator, 'not', (): Validate => new Validate().not);

defineGetter(validator, 'length', () => (len: number): Validate => new Validate().length(len));
defineGetter(validator, 'test', () => (regexp: RegExp): Validate => new Validate().test(regexp));
defineGetter(validator, 'isType', () => (type: string): Validate => new Validate().isType(type));
defineGetter(validator, 'equals', () => (value: any): Validate => new Validate().equals(value));
defineGetter(validator, 'arrayOf', () => (validate: Validate): Validate => new Validate().arrayOf(validate));
defineGetter(validator, 'oneOf', () => (...validators: Validate[]): Validate => new Validate().oneOf(...validators));
defineGetter(validator, 'enums', () => (...values: any[]): Validate => new Validate().enums(...values));
defineGetter(validator, 'reset', () => (): Validate => new Validate().reset());


const reservedKey: string[] = [
  'arguments', 'caller', 'length', 'prototype', 'apply', 'bind',
  'call', 'toString', 'toLocaleString', 'name', 'constructor',
  'isPrototypeOf', 'propertyIsEnumerable', 'valueOf', 'hasOwnProperty',
  'extend', '_rules', '_isOpposite', '_isRequired', '$validate'
];

// 继承接口，用于实现自定义校验规则，或者覆写已有的规则
defineGetter(validator, 'extend', () => (name: string, handler: () => boolean, isGetter: boolean = false): void => {
  if (reservedKey.includes(name)) {
    throw new Error(`The extend keyword \`${name}\` is reserved keyword`);
  }
  if (typeof handler !== 'function') {
    throw new TypeError('handler should be a function');
  }

  defineGetter(Validate.prototype, name, function getter() {
    const fn = (...args: any[]): Validate => {
      this._rules.push((value: any) => handler.call(this, value, ...args));
      return this;
    };

    if (isGetter) {
      return fn();
    }
    return fn;
  });

  // 暴露到 validator 上
  if (isGetter) {
    // @ts-ignore
    defineGetter(validator, name, (): Validate => new Validate()[name]);
  } else {
    // @ts-ignore
    defineGetter(validator, name, () => (...args: any[]): Validate => new Validate()[name](...args));
  }
});

export default validator;
