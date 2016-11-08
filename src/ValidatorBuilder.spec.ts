"use strict";

import "jest";
require("babel-core/register");
require("babel-polyfill");

import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/toArray";
import "rxjs/add/operator/toPromise";
import {
  success, message, inconclusive, error,
  startWith, startInconclusive, delay, collect, compose,
  ValidatorMonad,
  successResult, messageResult, inconclusiveResult, errorResult,
  collectionResult, objectResult, propertiesResult,
} from "./index";

describe("operators", () => {
  describe("success", () => {
    describe("Sanity checks", () => {
      it("it should be a function",
        () => expect(typeof success).toBe("function"));
      it("it should return a success result", () =>
        success(1).toPromise()
          .then(r => expect(r).toEqual(successResult())));
    }); //    Sanity checks
  }); //    success

  describe("message", () => {
    describe("Sanity checks", () => {
      it("it should be a function",
        () => expect(typeof message).toBe("function"));
      it("it should return a message result", () =>
        message("Hint")(1).toPromise()
          .then(r => expect(r).toEqual(messageResult("Hint"))));
    }); //    Sanity checks
  }); //    message

  describe("inconclusive", () => {
    describe("Sanity checks", () => {
      it("it should be a function",
        () => expect(typeof inconclusive).toBe("function"));
      it("it should return a inconclusive result", () =>
        inconclusive("Inconclusive")(1).toPromise()
          .then(r => expect(r).toEqual(inconclusiveResult("Inconclusive"))));
    }); //    Sanity checks
  }); //    inconclusive

  describe("error", () => {
    describe("Sanity checks", () => {
      it("it should be a function",
        () => expect(typeof error).toBe("function"));
      it("it should return a error result", () =>
        error("Error")(1).toPromise()
          .then(r => expect(r).toEqual(errorResult("Error"))));
    }); //    Sanity checks
  }); //    error

  describe("startWith", () => {
    describe("Sanity checks", () => {
      it("it should be a function",
        () => expect(typeof startWith).toBe("function"));
      it("it should return a error result", () =>
        startWith(messageResult("Hello"))(error("Error"))(1).toArray().toPromise()
          .then(r => expect(r).toEqual([messageResult("Hello"), errorResult("Error")])));
    }); //    Sanity checks
  }); //    startWith

  describe("startInconclusive", () => {
    describe("Sanity checks", () => {
      it("it should be a function",
        () => expect(typeof startInconclusive).toBe("function"));
      it("it should return a error result", () =>
        startInconclusive(error("Error"))(1).toArray().toPromise()
          .then(r => expect(r).toEqual([inconclusiveResult(), errorResult("Error")])));
    }); //    Sanity checks
  }); //    startInconclusive

  describe("collect", () => {
    describe("Sanity checks", () => {
      it("collect should be a function",
        () => expect(typeof collect).toBe("function"));
    }); //    Sanity checks

    describe("Given no validators", () => {
      it("collect should return success", () =>
        expect(collect()).toBe(success));
    }); //    Given no validators

    describe("Given one validator", () => {
      const validator = startInconclusive(delay(10)(error("Error")));
      it("collect should return the same validator", () =>
        expect(collect(validator)).toBe(validator));
    }); //    Given no validators

    describe("Given two validators", () => {
      const validator1 = startInconclusive(delay(10)(message("Hint")));
      const validator2 = startInconclusive(delay(20)(error("Error")));
      it("collect should return the collection of validation results", () =>
        collect(validator1, validator2)(1).toArray().toPromise()
          .then(r => expect(r).toEqual([
            inconclusiveResult(),
            collectionResult([
              messageResult("Hint"),
              inconclusiveResult(),
            ]),
            collectionResult([
              messageResult("Hint"),
              errorResult("Error"),
            ]),
          ])));
    }); //    Given no validators
  }); //    collect

  describe("compose", () => {
    describe("Sanity checks", () => {
      it("compose should be a function",
        () => expect(typeof compose).toBe("function"));
    }); //    Sanity checks

    describe("Given no validators", () => {
      it("compose should return success", () =>
        compose({})(1).toArray().toPromise()
          .then(r => expect(r).toEqual([successResult()])));
    }); //    Given no validators

    describe("Given one validator", () => {
      const validator = startInconclusive(delay(10)(error("Error")));
      it("compose should return the same validator", () =>
        compose({ field1: validator })(1).toArray().toPromise()
          .then(r => expect(r).toEqual([
            propertiesResult({ field1: inconclusiveResult() }),
            propertiesResult({ field1: errorResult("Error") }),
          ])));
    }); //    Given no validators

    describe("Given two validators", () => {
      const validator1 = startInconclusive(delay(10)(message("Hint")));
      const validator2 = startInconclusive(delay(20)(error("Error")));
      it("compose should return the composeion of validation results", () =>
        compose({ field1: validator1, field2: validator2 })(1).toArray().toPromise()
          .then(r => expect(r).toEqual([
            propertiesResult({ field1: inconclusiveResult(), field2: inconclusiveResult() }),
            propertiesResult({ field1: messageResult("Hint"), field2: inconclusiveResult() }),
            propertiesResult({ field1: messageResult("Hint"), field2: errorResult("Error") }),
          ])));
    }); //    Given no validators
  }); //    compose
}); //    operators

describe("ValidatorMonad", () => {
  describe("Sanity checks", () => {
    it("it should be a object",
      () => expect(typeof ValidatorMonad).toBe("object"));
    it("Monad's success should be equal to success",
      () => expect(ValidatorMonad.success).toBe(success));
    it("Monad's message should be equal to message",
      () => expect(ValidatorMonad.message).toBe(message));
    it("Monad's inconclusive should be equal to inconclusive",
      () => expect(ValidatorMonad.inconclusive).toBe(inconclusive));
    it("Monad's error should be equal to error",
      () => expect(ValidatorMonad.error).toBe(error));
    it("Monad's startWith should be equal to startWith",
      () => expect(ValidatorMonad.startWith).toBe(startWith));
    it("Monad's startInconclusive should be equal to startInconclusive",
      () => expect(ValidatorMonad.startInconclusive).toBe(startInconclusive));
    it("Monad's delay should be equal to delay",
      () => expect(ValidatorMonad.delay).toBe(delay));
    it("Monad's collect should be equal to collect",
      () => expect(ValidatorMonad.collect).toBe(collect));
    it("Monad's compose should be equal to compose",
      () => expect(ValidatorMonad.compose).toBe(compose));
  }); //    Sanity checks

}); //    ValidatorMonad
