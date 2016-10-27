"use strict";

import "jest";
require("babel-core/register");
require("babel-polyfill");

import {
  successResult, messageResult, warningResult,
  errorResult, collectionResult, objectResult,
  keepErrorsOnly, Validator, BoolValidator,
} from "./index";
import {
  compose, compose3, compose4,
  isNot, isEither, isAll,
  isArray, isBoolean, isFunction, isNull, isNumber, isNaNNumber, isFiniteNumber,
  isObject, isString, isSymbol, isUndefined,
  isNullOrUndefined, isDefined, isEmpty, isNonEmpty,
  isRequired,
} from "./internalValidators";

const testBoolValidator = (
  name: string, validator: BoolValidator,
  trues: any[], falses: any[]
) => {
  describe(name, () => {
    it(name + " should be a function", () => expect(typeof validator).toBe("function"));
    trues.forEach(val => {
      it(name + "(" + JSON.stringify(val) + ") should return true",
        () => expect(validator(val)).toBe(true));
    });
    falses.forEach(val => {
      it(name + "(" + JSON.stringify(val) + ") should return false",
        () => expect(validator(val)).toBe(false));
    });
  });
};

describe("Testing validators", () => {
  describe("compose", () => {
    it("compose should be a function", () => expect(typeof compose).toBe("function"));
    it("compose(JSON.stringify, ...false) should return true",
      () => expect(compose(JSON.stringify, a => false)("")).toBe("false"));
    it("compose(JSON.stringify, ...true) should return false",
      () => expect(compose(JSON.stringify, a => true)("")).toBe("true"));
  }); //    compose

  describe("compose3", () => {
    it("compose3 should be a function", () => expect(typeof compose3).toBe("function"));
    it("compose3(JSON.stringify, ...false) should return true",
      () => expect(compose3(a => a.length, JSON.stringify, a => false)("")).toBe(5));
    it("compose3(JSON.stringify, ...true) should return false",
      () => expect(compose3(a => a.length, JSON.stringify, a => true)("")).toBe(4));
  }); //    compose

  describe("compose4", () => {
    it("compose4 should be a function", () => expect(typeof compose4).toBe("function"));
    it("compose4(JSON.stringify, ...false) should return true",
      () => expect(compose4((a: number) => a * a, a => a.length, JSON.stringify, (a: string) => false)("")).toBe(25));
    it("compose4(JSON.stringify, ...true) should return false",
      () => expect(compose4((a: number) => a * a, a => a.length, JSON.stringify, (a: string) => true)("")).toBe(16));
  }); //    compose

  describe("isNot", () => {
    it("isNot should be a function", () => expect(typeof isNot).toBe("function"));
    it("isNot(...false) should return true", () => expect(isNot(a => false)("")).toBe(true));
    it("isNot(...true) should return false", () => expect(isNot(a => true)("")).toBe(false));
  }); //    isNot

  describe("isEither", () => {
    it("isEither should be a function", () => expect(typeof isEither).toBe("function"));
    it("isEither(...false, ...false) should return false",
      () => expect(isEither(a => false, a => false)("")).toBe(false));
    it("isEither(...true, ...false) should return true",
      () => expect(isEither(a => true, a => false)("")).toBe(true));
    it("isEither(...false, ...true) should return true",
      () => expect(isEither(a => false, a => true)("")).toBe(true));
    it("isEither(...true, ...true) should return true",
      () => expect(isEither(a => true, a => true)("")).toBe(true));
  }); //    isEither

  describe("isAll", () => {
    it("isAll should be a function", () => expect(typeof isAll).toBe("function"));
    it("isAll(...false, ...false) should return false",
      () => expect(isAll(a => false, a => false)("")).toBe(false));
    it("isAll(...true, ...false) should return false",
      () => expect(isAll(a => true, a => false)("")).toBe(false));
    it("isAll(...false, ...true) should return false",
      () => expect(isAll(a => false, a => true)("")).toBe(false));
    it("isAll(...true, ...true) should return true",
      () => expect(isAll(a => true, a => true)("")).toBe(true));
  }); //    isAll

  testBoolValidator("isArray", isArray,
    [[], [1, 2, 3], Array(4), Array<string>(10), Array(1, 2, 3, 4, 5)],
    [null, undefined, "", 0, false, 5, "abc", {}],
  );

  testBoolValidator("isBoolean", isBoolean,
    [true, false, Boolean(3)],
    [null, undefined, "", 0, 5, "abc", {}, []],
  );

  testBoolValidator("isFunction", isFunction,
    [isNot, a => a, JSON.stringify],
    [null, undefined, "", 0, 5, "abc", {}, [], true, false],
  );

  testBoolValidator("isUndefined", isUndefined,
    [undefined],
    [null, true, false, "", 0, 5, "abc", {}, []],
  );

  testBoolValidator("isNull", isNull,
    [null],
    [undefined, true, false, "", 0, 5, "abc", {}, []],
  );

  testBoolValidator("isNumber", isNumber,
    [0, 5, NaN, Infinity, Number(23)],
    [null, undefined, "", true, false, "5", {}, []],
  );

  testBoolValidator("isNaNNumber", isNaNNumber,
    [NaN],
    [0, 5, Infinity, Number("23"), undefined, {}, null, "", true, false, "5", []],
  );

  testBoolValidator("isFiniteNumber", isFiniteNumber,
    [0, 5, Number("23")],
    [null, undefined, NaN, Infinity, "", true, false, "5", {}, []],
  );

  testBoolValidator("isString", isString,
    ["", "abc", String(45), String({})],
    [null, undefined, true, false, {}, []],
  );

  testBoolValidator("isSymbol", isSymbol,
    [],
    [null, undefined, true, false, {}, [], "abc"],
  );

  testBoolValidator("isObject", isObject,
    [null, {}, []],
    [undefined, true, false, "abc"],
  );

  testBoolValidator("isNullOrUndefined", isNullOrUndefined,
    [null, undefined],
    ["", 0, false, 5, "abc", {}, []],
  );

  testBoolValidator("isDefined", isDefined,
    ["", 0, false, 5, "abc", {}, []],
    [null, undefined],
  );

  testBoolValidator("isEmpty", isEmpty,
    [""],
    [null, undefined, 0, false, 5, "abc", {}, []],
  );

  testBoolValidator("isNonEmpty", isNonEmpty,
    ["abc"],
    [null, undefined, 0, false, 5, "", {}, []],
  );
}); //    Testing validators
