"use strict";

import "jest";
require("babel-core/register");
require("babel-polyfill");

import {
  successResult,
  errorResult, collectionResult, objectResult,
  Validator,
  isRequired,
} from "./index";

describe("isRequired", () => {
  describe("Sanity checks", () => {
    it("it should be a function",
      () => expect(typeof isRequired).toBe("function"));
  }); //    Sanity checks
}); //    isRequired
