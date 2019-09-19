/**
 * 定义getter
 * @param obj
 * @param key
 * @param getter
 */
export function defineGetter(obj: object, key: string, getter: () => any): void {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    get: getter,
  });
}
