import {
  Validator, BoolValidator, MessageValidator,
  ofBoolValidator, ofMessageValidator, ofSyncValidator,
} from "./Validator";
import { isAll, isEither, isNot } from "./internal";

export const { common, syncCommon, boolCommon, messageCommon } = createCommonValidators();

// /* STRING VALIDATORS */
// const isEmpty: BoolValidator = (v: any) => v === "";
// const isNonEmpty = isAll(isString, isNot(isEmpty));

// /* ANY VALIDATORS */
// const isRequired = isEither(isNullOrUndefined, isNonEmpty);

function createCommonValidators() {
  const bool = (() => {
    const isNull: BoolValidator = (v: any) => v === null;
    const isNotNull: BoolValidator = (v: any) => v !== null;
    const isUndefined: BoolValidator = (v: any) => typeof v === "undefined";
    const isDefined: BoolValidator = (v: any) => typeof v !== "undefined";
    const isNothing = isEither(isUndefined, isNull);

    const isBoolean: BoolValidator = (v: any) => typeof v === "boolean";
    const isNumber: BoolValidator = (v: any) => typeof v === "number";
    const isSymbol: BoolValidator = (v: any) => typeof v === "symbol";
    const isString: BoolValidator = (v: any) => typeof v === "string";
    const isFunction: BoolValidator = (v: any) => typeof v === "function";
    const isObject: BoolValidator = (v: any) => typeof v === "object";
    const isArray: BoolValidator = (v: any) => Array.isArray(v);
    // const isNaNNumber = isAll(isNaN, isNumber);
    // const isFiniteNumber = isAll(isFinite, isNumber);
    return {
      isNull, isNotNull,
      isUndefined, isDefined,
      isNothing,
      isBoolean, isNotBoolean: isNot(isBoolean),
      isNumber, isNotNumber: isNot(isNumber),
      isSymbol, isNotSymbol: isNot(isSymbol),
      isString, isNotString: isNot(isString),
      isFunction, isNotFunction: isNot(isFunction),
      isObject, isNotObject: isNot(isObject),
      isArray, isNotArray: isNot(isArray),
    };
  })();

  const message = {

  };

  const sync = {

  };

  const validators = {

  };

  return {
    common: validators,
    syncCommon: sync,
    boolCommon: bool,
    messageCommon: message,
  };
};
