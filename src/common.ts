import {
  Validator, BoolValidator, MessageValidator,
  ofBoolValidator, ofMessageValidator, ofSyncValidator,
} from "./Validator";
import { CollectionResult, MessageResult, ObjectResult } from "./ValidationResult";
import { isAll, isEither, isNot, b2m, b2s, m2s } from "./internal";

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
    const isSomething = isNot(isNothing);

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
      isNothing, isSomething,
      isBoolean, isNotBoolean: isNot(isBoolean),
      isNumber, isNotNumber: isNot(isNumber),
      isSymbol, isNotSymbol: isNot(isSymbol),
      isString, isNotString: isNot(isString),
      isFunction, isNotFunction: isNot(isFunction),
      isObject, isNotObject: isNot(isObject),
      isArray, isNotArray: isNot(isArray),
    };
  })();

  const message = (() => {
    return {
      isNull: b2m("Should be null", bool.isNull),
      isNotNull: b2m("Should not be null", bool.isNotNull),
      isUndefined: b2m("Should be undefined", bool.isUndefined),
      isDefined: b2m("Should be defined", bool.isDefined),
      isNothing: b2m("Should be nothing", bool.isNothing),
      isSomething: b2m("Should be something", bool.isSomething),
      isBoolean: b2m("Should be a boolean", bool.isBoolean),
      isNotBoolean: b2m("Should not be a boolean", bool.isNotBoolean),
      isNumber: b2m("Should be a number", bool.isNumber),
      isNotNumber: b2m("Should not be a number", bool.isNotNumber),
      isSymbol: b2m("Should be a symbol", bool.isSymbol),
      isNotSymbol: b2m("Should not be a symbol", bool.isNotSymbol),
      isString: b2m("Should be a string", bool.isString),
      isNotString: b2m("Should not be a string", bool.isNotString),
      isFunction: b2m("Should be a function", bool.isFunction),
      isNotFunction: b2m("Should not be a function", bool.isNotFunction),
      isObject: b2m("Should be an object", bool.isObject),
      isNotObject: b2m("Should not be an object", bool.isNotObject),
      isArray: b2m("Should be an array", bool.isArray),
      isNotArray: b2m("Should not be an array", bool.isNotArray),
    };
  })();

  const sync = (() => {
    return {
      isNull: m2s(message.isNull),
      isNotNull: m2s(message.isNotNull),
      isUndefined: m2s(message.isUndefined),
      isDefined: m2s(message.isDefined),
      isNothing: m2s(message.isNothing),
      isSomething: m2s(message.isSomething),
      isBoolean: m2s(message.isBoolean),
      isNotBoolean: m2s(message.isNotBoolean),
      isNumber: m2s(message.isNumber),
      isNotNumber: m2s(message.isNotNumber),
      isSymbol: m2s(message.isSymbol),
      isNotSymbol: m2s(message.isNotSymbol),
      isString: m2s(message.isString),
      isNotString: m2s(message.isNotString),
      isFunction: m2s(message.isFunction),
      isNotFunction: m2s(message.isNotFunction),
      isObject: m2s(message.isObject),
      isNotObject: m2s(message.isNotObject),
      isArray: m2s(message.isArray),
      isNotArray: m2s(message.isNotArray),
    };
  })();

  const validators = (() => {
    return {
      isNull: ofMessageValidator(message.isNull),
      isNotNull: ofMessageValidator(message.isNotNull),
      isUndefined: ofMessageValidator(message.isUndefined),
      isDefined: ofMessageValidator(message.isDefined),
      isNothing: ofMessageValidator(message.isNothing),
      isSomething: ofMessageValidator(message.isSomething),
      isBoolean: ofMessageValidator(message.isBoolean),
      isNotBoolean: ofMessageValidator(message.isNotBoolean),
      isNumber: ofMessageValidator(message.isNumber),
      isNotNumber: ofMessageValidator(message.isNotNumber),
      isSymbol: ofMessageValidator(message.isSymbol),
      isNotSymbol: ofMessageValidator(message.isNotSymbol),
      isString: ofMessageValidator(message.isString),
      isNotString: ofMessageValidator(message.isNotString),
      isFunction: ofMessageValidator(message.isFunction),
      isNotFunction: ofMessageValidator(message.isNotFunction),
      isObject: ofMessageValidator(message.isObject),
      isNotObject: ofMessageValidator(message.isNotObject),
      isArray: ofMessageValidator(message.isArray),
      isNotArray: ofMessageValidator(message.isNotArray),
    };
  })();

  return {
    common: validators,
    syncCommon: sync,
    boolCommon: bool,
    messageCommon: message,
  };
};
