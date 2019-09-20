/**
 * @ignore
 */
type Rule = (value: any) => boolean;

/**
 * 校验类
 */
class Validate {
  protected _rules: Rule[];

  protected _isOpposite: boolean;

  protected _isRequired: boolean;

  /**
   * 返回数据类型
   * @param value 目标值
   */
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

  /**
   * 判断是一个字符串类型
   */
  get string(): Validate {
    this._rules.push((value: any) => typeof value === 'string');
    return this;
  }

  /**
   * 校验是一个数字类型
   */
  get number(): Validate {
    this._rules.push((value: any) => typeof value === 'number');
    return this;
  }

  /**
   * 校验是一个布尔值类型
   */
  get boolean(): Validate {
    this._rules.push((value: any) => typeof value === 'boolean');
    return this;
  }

  /**
   * 校验是一个Symbol类型
   */
  get symbol(): Validate {
    this._rules.push((value: any) => typeof value === 'symbol');
    return this;
  }

  /**
   * 校验是一个数组类型
   */
  get array(): Validate {
    return this.isType('array');
  }

  /**
   * 校验是一个普通对象类型
   */
  get object(): Validate {
    return this.isType('object');
  }

  /**
   * 校验是一个方法
   */
  get func(): Validate {
    this._rules.push((value: any) => typeof value === 'function');
    return this;
  }

  /**
   * 校验是一个空值 (null、undefined、空字符串)
   */
  get isEmpty(): Validate {
    this._rules.push((value: any) => value == null || value === '');
    return this;
  }

  /**
   * 是必须的
   */
  get isRequired(): Validate {
    this._isRequired = true;
    this._rules.push((value: any) => value != null && value !== '');
    return this;
  }

  /**
   * 将校验结果置反
   */
  get not(): Validate {
    this._isOpposite = !this._isOpposite;
    return this;
  }

  /**
   * 校验长度
   * @param len
   */
  length(len: number): Validate {
    this._rules.push((value: any) => value && value.length === len);
    return this;
  }

  /**
   * 校验是否与正则匹配
   * @param regexp
   */
  test(regexp: RegExp): Validate {
    if (Validate.getType(regexp) !== 'regexp') {
      throw new Error('regexp should be a Regexp.');
    }
    this._rules.push((value: any) => regexp.test(value));
    return this;
  }

  /**
   * 校验类型
   * @param type
   */
  isType(type: string): Validate {
    this._rules.push((value: any) => Validate.getType(value) === type);
    return this;
  }

  /**
   * 校验是否与指定的值相等
   * @param value
   */
  equals(value: any): Validate {
    this._rules.push((_value: any) => _value === value);
    return this;
  }

  /**
   * 校验数组的元素
   * @param validate
   */
  arrayOf(validate: Validate): Validate {
    if (!(validate instanceof Validate)) {
      throw new TypeError('validate should be a instance of Validate');
    }
    this._rules.push((value: any) => {
      return Validate.getType(value) === 'array'
        && value.every((val: any) => validate.$validate(val));
    });
    return this;
  }

  /**
   * 校验是一个对象的属性是否合法
   * @param obj
   */
  shape(obj: Record<any, Validate>): Validate {
    if (Validate.getType(obj) !== 'object') {
      throw new TypeError('obj should be a plain object');
    }

    this._rules.push((value: any) => {
      if (Validate.getType(value) !== 'object') {
        return false;
      }
      return Object.keys(obj).every((key) => {
        const validate: Validate = obj[key];
        const val: any = value[key];
        if (!(validate instanceof Validate)) {
          throw new TypeError('property should be a Validate instance');
        }
        if (val === undefined && !validate._isRequired) {
          return true;
        }
        return validate.$validate(val);
      });
    });
    return this;
  }

  /**
   * 多个校验规则，能匹配到一个就算匹配成功
   * @param validators
   */
  oneOf(...validators: Validate[]): Validate {
    const valid = validators.every((validate) => validate instanceof Validate);
    if (!valid) {
      throw new TypeError('The parameter must be a instance of Validate');
    }
    this._rules.push((value: any) => {
      return validators.some((validate: Validate) => validate.$validate(value));
    });
    return this;
  }

  /**
   * 校验是否是指定的值
   * @param values
   */
  enums(...values: any[]): Validate {
    this._rules.push((value: any) => values.includes(value));
    return this;
  }

  /**
   * 重置数据
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
    const result = this._rules.every((rule: Rule) => {
      if (!this._isRequired && (value == null || value === '')) {
        return true;
      }
      return rule(value);
    });
    return this._isOpposite ? !result : result;
  }
}

export default Validate;
