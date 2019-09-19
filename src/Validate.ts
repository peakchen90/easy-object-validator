type Rule = () => boolean;
type Rules = Validate[];

/**
 * 校验类
 */
class Validate {
  private _rules: Array<Rule | Rules>;

  private _isOpposite: boolean;

  private _isRequired: boolean;

  protected value: any;

  // 返回数据类型
  static getType(value: any): string {
    const str = Object.prototype.toString.call(value);
    return str.slice(0, -1).slice(8).toLowerCase();
  }

  constructor() {
    if (!(this instanceof Validate)) {
      throw new Error('Validate should be called with the `new` keyword');
    }

    this.reset();
  }

  // 是一个字符串
  get string(): Validate {
    this._rules.push(() => typeof this.value === 'string');
    return this;
  }

  // 是一个数字
  get number(): Validate {
    this._rules.push(() => typeof this.value === 'number');
    return this;
  }

  // 是一个普通对象
  get object(): Validate {
    return this.isType('object');
  }

  // 是一个数组
  get array(): Validate {
    return this.isType('array');
  }

  // 是一个布尔值
  get boolean(): Validate {
    this._rules.push(() => typeof this.value === 'boolean');
    return this;
  }

  // 是一个方法
  get func(): Validate {
    this._rules.push(() => typeof this.value === 'function');
    return this;
  }

  // 是一个Symbol
  get symbol(): Validate {
    this._rules.push(() => typeof this.value === 'symbol');
    return this;
  }

  // 是一个空值（null、undefined、空字符串）
  get isEmpty(): Validate {
    this._rules.push(() => this.value == null || this.value === '');
    return this;
  }

  // 必须
  get isRequired(): Validate {
    this._isRequired = true;
    this._rules.push(() => this.value != null && this.value !== '');
    return this;
  }

  // 将校验结果置反
  get not(): Validate {
    this._isOpposite = !this._isOpposite;
    return this;
  }

  // 校验长度
  length(len: number): Validate {
    this._rules.push(() => this.value && this.value.length === len);
    return this;
  }

  // 正则校验
  test(regexp: RegExp): Validate {
    if (Validate.getType(regexp) !== 'regexp') {
      throw new Error('regexp should be a Regexp.');
    }
    this._rules.push(() => regexp.test(this.value));
    return this;
  }

  // 是什么类型
  isType(type: string): Validate {
    this._rules.push(() => Validate.getType(this.value) === type);
    return this;
  }

  // 判断是否与指定的值相等
  equals(value: any): Validate {
    this._rules.push(() => this.value === value);
    return this;
  }

  // 校验数组的元素
  arrayOf(validate: Validate): Validate {
    if (!(validate instanceof Validate)) {
      throw new TypeError('The parameter must be a instance of Validate');
    }
    this._rules.push(() => Validate.getType(this.value) === 'array'
      && this.value.every((val: any) => validate.$validate(val)));
    return this;
  }

  // 多个校验规则，能匹配到一个就算匹配成功
  oneOf(...validators: Validate[]): Validate {
    const valid = validators.every((validate) => validate instanceof Validate);
    if (!valid) {
      throw new TypeError('The parameter must be a instance of Validate');
    }
    this._rules.push(validators);
    return this;
  }

  // 判断是否是指定的值
  enums(...values: any[]): Validate {
    this._rules.push(() => values.includes(this.value));
    return this;
  }

  /**
   * 重置数据
   * @private
   */
  reset(): Validate {
    this._rules = [];
    this._isOpposite = false;
    this._isRequired = false;
    return this;
  }

  /**
   * 执行校验
   * @param value
   */
  $validate(value: any): boolean {
    this.value = value;

    const result = this._rules.every((rule) => {
      if (Validate.getType(rule) === 'array') {
        return (rule as Rules).some((validate: Validate): boolean => validate.$validate(value));
      }

      if (!this._isRequired && (this.value == null || this.value === '')) {
        return true;
      }
      return (rule as Rule)();
    });
    return this._isOpposite ? !result : result;
  }
}

export default Validate;
