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

  not(): Validate;

  arrayOf(validate: Validate): Validate;

  oneOf(...validates: Validate[]): Validate;

  reset(): Validate;
}

export default Validate;
