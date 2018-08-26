const Validate = require('./Validate');

/**
 * 递归校验对象
 * @param {Object} target 校验的目标对象
 * @param {Object} options 校验规则
 */
function validator(target, options) {
  let isValid = false;
  if (Validate.type(target) === 'object') {
    isValid = Object.keys(options).every(key => {
      const value = target[key];
      const validate = options[key];
      if (validate instanceof Validate) {
        // 执行校验规则
        return validate.$doValidate(value);
      } else if (Validate.type(validate) === 'object') {
        // 如果是对象，递归校验
        return validator(value, validate);
      } else {
        throw new TypeError(`The validator of ${key} is not a right validator`);
      }
    });
  }
  return isValid;
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

    // 在Validate原型上定义校验方法
    Object.defineProperty(Validate.prototype, name, {
      value() {
        this.$validRules.push(() => {
          return validateFn(this.value);
        });
        return this;
      },
      configurable: true,
      enumerable: false
    });

    // 绑定到 validator 上
    validator[name] = () => new Validate()[name]();
  });
}

validator.string = () => new Validate().string()
validator.number = () => new Validate().number()
validator.object = () => new Validate().object()
validator.array = () => new Validate().array()
validator.boolean = () => new Validate().boolean()
validator.isRequire = () => new Validate().isRequire()
validator.test = (regexp) => new Validate().test(regexp)
validator.is = (typeName) => new Validate().is(typeName)
validator.not = () => new Validate().not()

module.exports = validator;
