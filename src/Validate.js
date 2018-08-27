// 返回一个值的类型（小写字母）
function type(value) {
  return Object.prototype.toString.call(value)
    .slice(0, -1)
    .slice(8)
    .toLowerCase();
}

// 校验类
function Validate() {
  if (!(this instanceof Validate)) {
    throw new Error('Validate should be called with the `new` keyword');
  }
  // 保存校验规则
  this.$validRules = [];
  // 置反标志，如果为true，将校验结果置反
  this.$flag = false;
  // 最后执行所有校验规则
  this.doValidate = (value) => {
    this.value = value;
    const ret = this.$validRules.every(rule => {
      if (Validate.type(rule) === 'array') {
        return rule.some(validate => validate.doValidate(value));
      }
      return rule()
    });
    return this.$flag ? !ret : ret;
  }
}
Validate.type = type;

Validate.prototype = {
  // 是一个字符串
  string() {
    return this.is('string');
  },

  // 是一个数字
  number() {
    return this.is('number');
  },

  // 是一个普通对象
  object() {
    return this.is('object');
  },

  // 是一个数组
  array() {
    return this.is('array');
  },

  // 是一个布尔值
  boolean() {
    return this.is('boolean');
  },

  // 必须
  isRequire() {
    this.$validRules.push(() => {
      return this.value != null && this.value !== '';
    });
    return this;
  },

  // 校验长度
  length(len) {
    this.$validRules.push(() => {
      return this.value && this.value.length === len;
    });
    return this;
  },

  // 正则校验
  test(regexp) {
    this.$validRules.push(() => {
      return regexp.test(this.value);
    });
    return this;
  },

  // 是什么类型
  is(typeName) {
    this.$validRules.push(() => {
      return type(this.value) === typeName;
    });
    return this;
  },

  // 将校验结果置反
  not() {
    this.$flag = !this.$flag;
    return this;
  },

  // 校验数组的元素
  arrayOf(validate) {
    if (!(validate instanceof Validate)) {
      throw new TypeError('The parameter must be a instance of Validate');
    }
    this.$validRules.push(() => {
      return type(this.value) === 'array' &&
        this.value.every(item => {
          return validate.doValidate(item);
        });
    });
    return this;
  },

  // 多个校验规则，能匹配到一个就算匹配成功
  oneOf(...validators) {
    const valid = validators.every(validate => validate instanceof Validate);
    if (!valid) {
      throw new TypeError('The parameter must be a instance of Validate');
    }
    this.$validRules.push(validators);
    return this;
  },

  // 重置校验规则
  reset() {
    this.$validRules = [];
    this.$flag = false;
    return this;
  }
}

module.exports = Validate;
