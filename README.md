# easy-object-validator
深度校验一个对象的属性值是否合法


[![Travis (.org) branch](https://img.shields.io/travis/peakchen90/easy-object-validator/master.svg)](https://travis-ci.org/peakchen90/easy-object-validator)
[![Codecov](https://img.shields.io/codecov/c/github/peakchen90/easy-object-validator.svg)](https://codecov.io/gh/peakchen90/easy-object-validator)
[![npm](https://img.shields.io/npm/v/easy-object-validator.svg)](https://www.npmjs.com/package/easy-object-validator)
[![npm](https://img.shields.io/npm/dt/easy-object-validator.svg)](https://www.npmjs.com/package/easy-object-validator)
[![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/peakchen90/easy-object-validator/blob/master/LICENSE)


> [更新日志](./CHANGELOG.md)

当前文档版本是2.x，API不兼容1.x版本，点击查看[1.x文档](https://github.com/peakchen90/easy-object-validator/blob/1.x/README.md)

## Features
- 支持 Node、浏览器端完美运行
- 无任何依赖，代码压缩后仅3kb
- 支持深度对象校验，提供的API友好、易用
- 支持校验方法扩展

## 安装
```bash
npm i -S easy-object-validator

# 构建
npm run build
# 单元测试
npm run test
```

## 快速开始
```js
import validator from 'easy-object-validator'

const obj = {
  foo: 123,
  bar: 'hello',
  child: {
    foo: true,
    bar: [1, 2, 3, 4],
    child: {
      bar: null
    }
  }
}
validator(obj, {
  foo: validator.test(/^\d+$/),
  bar: validator.string().length(5),
  child: {
    foo: validator.boolean().isRequire(),
    bar: validator.array().length(4),
    child: validator.object()
  }
})
// true
```

## API

> validator 的校验规则基于 Validate 类，下面先介绍 Validate 类

### **1. `Validate` : class**
  - 提供校验方法，以及校验方法的扩展

```js
import Validate from 'easy-object-validator/src/Validate'

const validate = new Validate();

// 校验方法都返回当前 Validate 对象，可以连缀调用
// 这个过程不会执行校验动作
validate.string().length(5).isRequire()
// 执行校验
validate.doValidate('hello') // true
```

> 1.1 实例属性：

#### 1.1.1 `validate.value`
  - 校验的值，可以通过实例方法 validate.doValidate(value) 传参设值
  - {any}

> 1.2 实例方法：

#### 1.2.1 `validate.doValidate(value)`
  - 执行校验方法
  - {any} value 执行校验的值
  - 返回 undefined

#### 1.2.2 `validate.string()`
  - 校验字符串
  - 返回 Validate 对象

#### 1.2.3 `validate.number()`
  - 校验数字
  - 返回 Validate 对象

#### 1.2.4 `validate.object()`
  - 校验数组
  - 返回 Validate 对象

#### 1.2.5 `validate.array()`
  - 校验数字
  - 返回 Validate 对象

#### 1.2.6 `validate.boolean()`
  - 校验布尔值
  - 返回 Validate 对象

#### 1.2.7 `validate.isRequire()`
  - 校验值不为空 (null/undefined/空字符串)
  - 返回 Validate 对象

#### 1.2.8 `validate.length(len)`
  - 校验长度 (仅支持有length属性的值，如字符串，数组，方法 等)
  - {Number} len 期望的长度值
  - 返回 Validate 对象

#### 1.2.9 `validate.test(regexp)`
  - 正则校验
  - {RegExp} regepx 校验的正则表达式
  - 返回 Validate 对象

#### 1.2.10 `validate.is(typeName)`
  - 校验值为指定的类型，调用 Object.prototype.toString 判断，类型名是全小写的 (如: string/number/object/null 等)
  - {String} typeName 类型名称
  - 返回 Validate 对象
  
#### 1.2.11 `validate.equals(value)`
  - 校验是否与指定的值相等
  - {*} value 指定的值
  - 返回 Validate 对象

#### 1.2.12 `validate.not()`
  - 将校验结果置反，可以多次使用
  - 返回 Validate 对象

#### 1.2.13 `validate.arrayOf(validate)`
  - 校验数组元素
  - {Validate} validate
  - 返回 Validate 对象

```js
const validate = new Validate()

// 创建一个新的Validate对象，避免污染
// 可以通过validator上方法快速创建Validate对象
const v = new Validate().string()  // 等同于 const v = validator.string()

validate.arrayOf(v).doValidate(['foo'])  // true
```

#### 1.2.14 `validate.oneOf(...validator)`
  - 校验规则能匹配到其中的一个就算校验成功
  - {Validate} validator 可以传多个Validate对象
  - 返回 Validate 对象

```js
let validate = new Validate()
// 创建一个新的Validate对象，避免污染
const v1 = new Validate().string()
const v2 = new Validate().number()
validate.oneOf(v1, v2).doValidate('foo')  // true

validate = new Validate()
validate.oneOf(v1, v2).doValidate(123)  // true
```

#### 1.2.15 `validate.enums(...values)`
  - 校验是否与指定的枚举值相等
  - {*} values 多个枚举值
  - 返回 Validate 对象
  
#### 1.2.16 `validate.reset()`
  - 将调用reset方法之前的校验规则重置，之后的校验规则不影响
  - 返回 Validate 对象

```js
let validate = new Validate()
validate.string().doValidate('foo')  // true
validate.number().doValidate(123)  // false

// reset
validate = new Validate()
validate.string().doValidate('foo')  // true
validate.reset().number().doValidate(123)  // true
```



### **2. `validator` : Function(object, options)**
  - 校验对象
  - {Object} `object` : [必选] 校验的目标对象
  - {Object} `options` : [必选] 校验规则
  - 返回 Boolean

```js
validator({
  foo: 'hello'
}, {
  foo: validator.string()
})
// true
```


#### **2.1. `validator.extend` : Function(options)**
  - 用于扩展校验方法，扩展之后永久有效，不用每次重新执行此方法
  - {Object} `options` : 校验方法对象，对象的属性将作为方法名，对象的属性值是一个方法，用于自定义校验
  - 返回 undefined

```js
// 调用 .extend 方法后，将在 Validate 类的原型上定义校验方法，
// 同时绑定到 validator 上，调用 validator[validateName] 返回 Validate 对象
// 校验方法接收一个参数，为校验的值
validator.extend({
  isName(value) {
    return /^[A-Z][A-z]*$/.test(value)
  }
})
validator({
  foo: 'Alice'
}, {
  foo: validator.isName().string()
})
// true
```


#### **2.2. `validator.string` : Function()**
  - 判断是否是一个字符串
  - 返回 Validate 对象

```js
validator({
  foo: 'Bob'
}, {
  foo: validator.string()
})
// true
```


#### **2.3. `validator.number` : Function()**
  - 判断是否是一个数字
  - 返回 Validate 对象

```js
validator({
  foo: 123
}, {
  foo: validator.number()
})
// true
```


#### **2.4. `validator.object` : Function()**
  - 判断是否是一个普通对象
  - 返回 Validate 对象

```js
validator({
  foo: {}
}, {
  foo: validator.object()
})
// true
```


#### **2.5. `validator.array` : Function()**
  - 判断是否是一个数组
  - 返回 Validate 对象

```js
validator({
  foo: []
}, {
  foo: validator.array()
})
// true
```


#### **2.6. `validator.boolean` : Function()**
  - 判断是否是一个布尔值
  - 返回 Validate 对象

```js
validator({
  foo: true
}, {
  foo: validator.boolean()
})
// true
```


#### **2.7. `validator.isRequire` : Function()**
  - 判断值不为空（null、undefined、空字符串）
  - 返回 Validate 对象

```js
validator({
  foo: 'hello'
}, {
  foo: validator.isRequire()
})
// true
```


#### **2.8. `validator.test` : Function(regexp)**
  - 通过正则表达式判断值是否匹配
  - {RegExp} regexp 正则表达式
  - 返回 Validate 对象

```js
validator({
  foo: '123@bar.com'
}, {
  foo: validator.test(/\w+@\w+\.com/)
})
// true
```


#### **2.9. `validator.is` : Function(typeName)**
  - 判断值的类型，用法与 **validate.is()** 方法类似
  - {String} typeName 类型名（小写）
  - 返回 Validate 对象

```js
validator({
  foo: []
}, {
  foo: validator.is('array')
})
// true
```


#### **2.10. `validator.equals` : Function(value)**
  - 校验是否与指定的值相等
  - {*} value 指定的值
  - 返回 Validate 对象

```js
validator({
  foo: 'foo'
}, {
  foo: validator.equals('foo')
})
// true
```


#### **2.11. `validator.not` : Function()**
  - 将校验结果置反
  - 返回 Validate 对象

```js
validator({
  foo: 123
}, {
  foo: validator.not().string()
})
// true
```

## 结语
用得不爽就造轮子😶，欢迎提issues或PR
