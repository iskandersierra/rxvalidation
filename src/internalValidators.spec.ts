"use strict";

import "jest";
require("babel-core/register");
require("babel-polyfill");

import {
  successResult, messageResult, warningResult,
  errorResult, collectionResult, objectResult,
  keepErrorsOnly, Validator,
} from "./index";
import {
  isNot, isEither,
  isNullOrUndefined, isDefined, isEmpty, isNonEmpty,
  isRequired,
} from "./internalValidators";

describe("Sanity checks", () => {
  it("isNot should be a function", () => expect(typeof isNot).toBe("function"));
  it("isEither should be a function", () => expect(typeof isEither).toBe("function"));
  it("isNullOrUndefined should be a function", () => expect(typeof isNullOrUndefined).toBe("function"));
  it("isDefined should be a function", () => expect(typeof isDefined).toBe("function"));
  it("isEmpty should be a function", () => expect(typeof isEmpty).toBe("function"));
  it("isNonEmpty should be a function", () => expect(typeof isNonEmpty).toBe("function"));
  it("isRequired should be a function", () => expect(typeof isRequired).toBe("function"));
}); //    Sanity checks

describe("Testing validators", () => {
  describe("isNot", () => {
    it("isNot(...false) should return true", () => expect(isNot(a => false)("")).toBe(true));
    it("isNot(...true) should return false", () => expect(isNot(a => true)("")).toBe(false));
  }); //    isNot

  describe("isEither", () => {
    it("isEither(...false, ...false) should return false",
      () => expect(isEither(a => false, a => false)("")).toBe(false));
    it("isEither(...true, ...false) should return false",
      () => expect(isEither(a => true, a => false)("")).toBe(true));
    it("isEither(...false, ...true) should return false",
      () => expect(isEither(a => false, a => true)("")).toBe(true));
    it("isEither(...true, ...true) should return false",
      () => expect(isEither(a => true, a => true)("")).toBe(true));
  }); //    isEither

  describe("isNullOrUndefined", () => {
    it("isNullOrUndefined(null) should return true",
      () => expect(isNullOrUndefined(null)).toBe(true));
    it("isNullOrUndefined(undefined) should return true",
      () => expect(isNullOrUndefined(undefined)).toBe(true));
    it("isNullOrUndefined(\"\") should return false",
      () => expect(isNullOrUndefined("")).toBe(false));
    it("isNullOrUndefined(0) should return false",
      () => expect(isNullOrUndefined(0)).toBe(false));
    it("isNullOrUndefined(false) should return false",
      () => expect(isNullOrUndefined(false)).toBe(false));
  }); //    isNullOrUndefined

  describe("isDefined", () => {
    it("isDefined(null) should return false",
      () => expect(isDefined(null)).toBe(false));
    it("isDefined(undefined) should return false",
      () => expect(isDefined(undefined)).toBe(false));
    it("isDefined(\"\") should return true",
      () => expect(isDefined("")).toBe(true));
    it("isDefined(0) should return true",
      () => expect(isDefined(0)).toBe(true));
    it("isDefined(false) should return true",
      () => expect(isDefined(false)).toBe(true));
  }); //    isDefined

  describe("isEmpty", () => {
    it("isEmpty(null) should return false",
      () => expect(isEmpty(null)).toBe(false));
    it("isEmpty(undefined) should return false",
      () => expect(isEmpty(undefined)).toBe(false));
    it("isEmpty(\"\") should return true",
      () => expect(isEmpty("")).toBe(true));
    it("isEmpty(\"abc\") should return false",
      () => expect(isEmpty("abc")).toBe(false));
    it("isEmpty(0) should return false",
      () => expect(isEmpty(0)).toBe(false));
    it("isEmpty(false) should return false",
      () => expect(isEmpty(false)).toBe(false));
  }); //    isEmpty
}); //    Testing validators
