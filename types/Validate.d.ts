declare class Validate {
  static type(): string;

  doValidate(value: any): boolean;

  string(): Validate;

  number(): Validate;

  object(): Validate;

  array(): Validate;

  boolean(): Validate;

  isRequire(): Validate;

  length(length: number): Validate;

  test(regexp: RegExp): Validate;

  is(typeName: string): Validate;

  equals(value: any): Validate;

  not(): Validate;

  arrayOf(validate: Validate): Validate;

  oneOf(...validates: Validate[]): Validate;

  enums(...values: any[]): Validate;

  reset(): Validate;
}

export default Validate;
