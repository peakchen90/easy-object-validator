/**
 * easy-object-valodator version 0.0.2 
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.validator = factory());
}(this, (function () { 'use strict';

  // 返回一个值的类型（小写字母）
  function type(value) {
    return Object.prototype.toString.call(value).slice(0, -1).slice(8).toLowerCase();
  }

  // 校验类
  function Validate() {
    var _this = this;

    if (!this instanceof Validate) {
      throw new Error('Validate should be called with the `new` keyword');
    }
    // 保存校验规则
    this.$validRules = [];
    // 置反标志，如果为true，将校验结果置反
    this.$flag = false;
    // 最后执行所有校验规则
    this.$doValidate = function (value) {
      _this.value = value;
      var ret = _this.$validRules.every(function (rule) {
        return rule();
      });
      return _this.$flag ? !ret : ret;
    };
  }
  Validate.type = type;

  Validate.prototype = {
    // 是一个字符串
    string: function string() {
      return this.is('string');
    },


    // 是一个数字
    number: function number() {
      return this.is('number');
    },


    // 是一个普通对象
    object: function object() {
      return this.is('object');
    },


    // 是一个数组
    array: function array() {
      return this.is('array');
    },


    // 是一个布尔值
    boolean: function boolean() {
      return this.is('boolean');
    },


    // 必须
    isRequire: function isRequire() {
      var _this2 = this;

      this.$validRules.push(function () {
        return _this2.value != null && _this2.value !== '';
      });
      return this;
    },


    // 校验长度
    length: function length(len) {
      var _this3 = this;

      this.$validRules.push(function () {
        return _this3.value && _this3.value.length === len;
      });
      return this;
    },


    // 正则校验
    test: function test(regexp) {
      var _this4 = this;

      this.$validRules.push(function () {
        return regexp.test(_this4.value);
      });
      return this;
    },


    // 是什么类型
    is: function is(typeName) {
      var _this5 = this;

      this.$validRules.push(function () {
        return type(_this5.value) === typeName;
      });
      return this;
    },


    // 将校验结果置反
    not: function not() {
      this.$flag = !this.$flag;
      return this;
    }
  };

  var Validate_1 = Validate;

  /**
   * 递归校验对象
   * @param {Object} target 校验的目标对象
   * @param {Object} options 校验规则
   */
  function validator(target, options) {
    var isValid = false;
    if (Validate_1.type(target) === 'object') {
      isValid = Object.keys(options).every(function (key) {
        var value = target[key];
        var validate = options[key];
        if (validate instanceof Validate_1) {
          // 执行校验规则
          return validate.$doValidate(value);
        } else if (Validate_1.type(validate) === 'object') {
          // 如果是对象，递归校验
          return validator(value, validate);
        } else {
          throw new TypeError('The validator of ' + key + ' is not a right validator');
        }
      });
    }
    return isValid;
  }

  /**
   * 暴露校验方法
   */

  // 继承，用于自定义校验方法
  validator.extend = function (options) {
    Object.keys(options).forEach(function (name) {
      var validateFn = options[name];
      if (Validate_1.type(validateFn) !== 'function') {
        throw new TypeError('validateFn must be a function');
      }

      // 在Validate原型上定义校验方法
      Object.defineProperty(Validate_1.prototype, name, {
        value: function value() {
          var _this = this;

          this.$validRules.push(function () {
            return validateFn(_this.value);
          });
          return this;
        },

        configurable: true,
        enumerable: false
      });

      // 绑定到 validator 上
      validator[name] = function () {
        return new Validate_1()[name]();
      };
    });
  };

  validator.string = function () {
    return new Validate_1().string();
  };
  validator.number = function () {
    return new Validate_1().number();
  };
  validator.object = function () {
    return new Validate_1().object();
  };
  validator.array = function () {
    return new Validate_1().array();
  };
  validator.boolean = function () {
    return new Validate_1().boolean();
  };
  validator.isRequire = function () {
    return new Validate_1().isRequire();
  };
  validator.test = function (regexp) {
    return new Validate_1().test(regexp);
  };

  var src = validator;

  return src;

})));
