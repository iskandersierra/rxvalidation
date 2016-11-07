"use strict";

import "jest";
require("babel-core/register");
require("babel-polyfill");

import { Observable } from "rxjs/Observable";
import {
  success, message, inconclusive, error,
  yieldResult, yieldFrom, collectScan,
  ValidatorMonad,
} from "./index";

describe("ValidationMonad operators", () => {
  describe("empty", () => {
    describe("Sanity checks", () => {
      it("it should be a function",
        () => expect(typeof success).toBe("function"));
    }); //    Sanity checks
  }); //    empty
}); //    ValidationMonad operators