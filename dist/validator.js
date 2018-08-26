'use strict';

const Validate = require('./src/Validate');

/**
 * 请求参数校验
 * @param {String} type 请求类型 ['query', 'body', 'header', ...]
 * @param {Object} options 校验的参数
 * @param {Object} [invalidContext] 校验失败时，将合并到ctx
 * @returns {Function} Koa中间件
 */
function validator(type, options, invalidContext) {
  return async (ctx, next) => {
    const target = ctx.request[type];
    options = options || {};
    if (target) {
      isVali = Object.keys(options).every(key => {
        const value = target[key];
        const valid = options[key];
        if (valid instanceof Validate) {
          // 执行校验规则
          return valid.$doValid(value);
        } else {
          throw new TypeError(`The validator of ${key} is not a right validator`);
        }
      });
    }
  }
}

/**
 * 暴露校验方法
 */

// 继承，用于自定义校验方法
validator.extend = (options) => {
  Object.keys(options).forEach(name => {
    const validateFn = options[name];
    if (Validate.type(validateFn) !== 'function') {
      throw new TypeError('validateFn must be a function');
    }
    Object.defineProperty(Validate.prototype, name, {
      value() {
        return () => {
          this.$validRules.push(() => {
            return validRules(this.value);
          });
          return this;
        }
      },
      configurable: true,
      enumerable: false
    });

    // 绑定到 validator 上
    validator[name] = () => new Validate()[name]();
  });
};
validator.string = () => new Validate().string();
validator.number = () => new Validate().number();
validator.object = () => new Validate().object();
validator.array = () => new Validate().array();
validator.boolean = () => new Validate().boolean();
validator.isRequire = () => new Validate().isRequire();
validator.test = (regexp) => new Validate().test(regexp);

module.exports = validator;
