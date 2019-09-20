declare class Validate {
  static getType(): string;

  constructor();

  get string(): Validate;

  get number(): Validate;

  get boolean(): Validate;

  get symbol(): Validate;

  get array(): Validate;

  get object(): Validate;

  get func(): Validate;

  get isEmpty(): Validate;

  get isRequired(): Validate;

  get not(): Validate;

  length(len: number): Validate;

  test(regexp: RegExp): Validate;

  isType(type: string): Validate;

  equals(value: any): Validate;

  arrayOf(validate: Validate): Validate;

  shape(obj: Record<any, Validate>): Validate;

  oneOf(...validates: Validate[]): Validate;

  enums(...values: any[]): Validate;

  reset(): Validate;

  $validate(value: any): void
}

export default Validate;
