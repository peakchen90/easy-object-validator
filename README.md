# easy-object-validator
深度校验一个值是否合法


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
- 支持自定义校验方法扩展

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
};

validator(obj, {
  foo: validator.test(/^\d+$/),
  bar: validator.string.length(5),
  child: {
   foo: validator.boolean.isRequired,
   bar: validator.array.length(4),
   child: validator.object
  }
})
// true
```

## API

> validator 的校验规则基于 Validate 类

[API参考](https://peakchen90.github.io/easy-object-validator/index.html)

## 结语
用得不爽就造轮子😶，欢迎提issues或PR
