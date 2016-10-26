import { BoolValidator } from "./Validator";

export const isNot = (val: BoolValidator): BoolValidator =>
  (v: any) => !val(v);
export const isEither =
  (...validators: BoolValidator[]): BoolValidator =>
    (v: any) =>
      validators.reduce((a, val) => a || val(v), false);
export const isAll =
  (...validators: BoolValidator[]): BoolValidator =>
    (v: any) =>
      validators.reduce((a, val) => a && val(v), true);

export const isUndefined = (v: any) => typeof v === "undefined";
export const isNull = (v: any) => v === null;
export const isBoolean = (v: any) => typeof v === "boolean";
export const isNumber = (v: any) => typeof v === "number";
export const isSymbol = (v: any) => typeof v === "symbol";
export const isString = (v: any) => typeof v === "string";
export const isFunction = (v: any) => typeof v === "function";
export const isObject = (v: any) => typeof v === "object";
export const isArray = (v: any) => Array.isArray(v);

export const isNullOrUndefined = isEither(isUndefined, isNull);
export const isDefined = isNot(isNullOrUndefined);

/* STRING VALIDATORS */
const isEmptyString = (v: any) => v === "";
export const isEmpty = isAll(isString, isEmptyString);
export const isNonEmpty = isAll(isString, isNot(isEmptyString));

/* ANY VALIDATORS */
export const isRequired = isEither(isNullOrUndefined, isNonEmpty);
