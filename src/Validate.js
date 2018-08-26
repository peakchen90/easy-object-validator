// 返回一个值的类型（小写字母）
function type(value) {
  return Object.prototype.toString.call(value)
    .slice(0, -1)
    .slice(8)
    .toLowerCase();
}

// 校验类
function Validate() {
  if (!this instanceof Validate) {
    throw new Error('Validate should be called with the `new` keyword');
  }
  // 保存校验规则
  this.$validRules = [];
  // 置反标志，如果为true，将校验结果置反
  this.$flag = false;
  // 最后执行所有校验规则
  this.$doValidate = (value) => {
    this.value = value;
    const ret = this.$validRules.every(rule => rule());
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
  }
}

module.exports = Validate;
