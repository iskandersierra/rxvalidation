"use strict";

import "jest";
require("babel-core/register");
require("babel-polyfill");

import {
  successResult, messageResult, warningResult,
  errorResult, collectionResult, objectResult,
  keepErrorsOnly, Validator,
  ofOneTimeValidator,
} from "./index";

describe("ofOneTimeValidator", () => {
  describe("Sanity checks", () => {
    it("it should be a function",
      () => expect(typeof ofOneTimeValidator).toBe("function"));
    it("it should return a function",
      () => expect(typeof ofOneTimeValidator({} as any)).toBe("function"));
  }); //    Sanity checks
}); //    ofOneTimeValidator
