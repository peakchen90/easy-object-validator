import Validate from './Validate';

declare function validator(val: any, option: any): boolean;

declare namespace validator {
  const string: Validate;

  const number: Validate;

  const boolean: Validate;

  const symbol: Validate;

  const array: Validate;

  const object: Validate;

  const func: Validate;

  const isEmpty: Validate;

  const isRequired: Validate;

  const not: Validate;

  function length(len: number): Validate;

  function test(regexp: RegExp): Validate;

  function isType(type: string): Validate;

  function equals(value: any): Validate;

  function arrayOf(validate: Validate): Validate;

  function shape(obj: Record<any, Validate>): Validate;

  function oneOf(...validates: Validate[]): Validate;

  function enums(...values: any[]): Validate;

  function reset(): Validate;

  function extend(name: string, handler: () => boolean, isGetter?: boolean): void;
}

export default validator;
