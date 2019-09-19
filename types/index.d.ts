import Validate from './Validate';

declare function validator(target: object, options: object): boolean;

declare namespace validator {
  function extend(option: {
    ruleName: (value: any) => boolean
  }): void;

  function string(): Validate;

  function number(): Validate;

  function object(): Validate;

  function array(): Validate;

  function boolean(): Validate;

  function isRequire(): Validate;

  function length(length: number): Validate;

  function test(regexp: RegExp): Validate;

  function is(typeName: string): Validate;

  function equals(value: any): Validate;

  function not(): Validate;

  function arrayOf(validate: Validate): Validate;

  function oneOf(...validates: Validate[]): Validate;

  function enums(...values: any[]): Validate;

  function reset(): Validate;
}

export default validator;
