"use strict";

import "jest";
require("babel-core/register");
require("babel-polyfill");

import {
  successResult, messageResult, warningResult,
  errorResult, collectionResult, objectResult,
  keepErrorsOnly, Validator,
  isRequired,
} from "./index";

describe("isRequired", () => {
  describe("Sanity checks", () => {
    it("it should be a function",
      () => expect(typeof isRequired).toBe("function"));
  }); //    Sanity checks
}); //    isRequired
