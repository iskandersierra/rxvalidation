"use strict";

import "jest";
require("babel-core/register");
require("babel-polyfill");
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";
import "rxjs/add/operator/toArray";
import "rxjs/add/operator/toPromise";

import {
  ValidationResult, MessageResult, ObjectResult, CollectionResult,
  successResult, messageResult, warningResult,
  errorResult, collectionResult, objectResult,
  keepErrorsOnly, Validator, BoolValidator, MessageValidator,
  OneTimeValidator, SingleValidator, ThrowValidator,
  ofOneTimeValidator, ofBoolValidator, ofMessageValidator,
  ofSingleValidator, ofThrowValidator,
} from "./index";

const testValidationResults =
  (
    validator: Validator,
    values: any[],
    expected: ValidationResult[],
  ) => {
    it("the validator should return the expected sequence",
      () => {
        const promise = validator(Observable.of(...values))
          .toArray()
          .toPromise() as PromiseLike<ValidationResult>;
        return promise.then(r => expect(r).toEqual(expected));
      });
  };

describe("ofOneTimeValidator", () => {
  describe("Sanity checks", () => {
    it("it should be a function",
      () => expect(typeof ofOneTimeValidator).toBe("function"));
  }); //    Sanity checks

  describe("Given a one-time Validator", () => {
    const otValidator: OneTimeValidator = (v: any) => Observable.of(
      successResult(),
      messageResult("message #" + v),
      errorResult("error #" + v),
    );
    const validator = ofOneTimeValidator(otValidator);

    testValidationResults(validator, [1, 2, 3], [
      successResult(),
      messageResult("message #1"),
      errorResult("error #1"),
      successResult(),
      messageResult("message #2"),
      errorResult("error #2"),
      successResult(),
      messageResult("message #3"),
      errorResult("error #3"),
    ]);
  }); //    Given a one-time Validator
}); //    ofOneTimeValidator

describe("ofSingleValidator", () => {
  describe("Sanity checks", () => {
    it("it should be a function",
      () => expect(typeof ofSingleValidator).toBe("function"));
  }); //    Sanity checks

  describe("Given a single Validator", () => {
    const sValidator: SingleValidator = (v: any) =>
      messageResult("message #" + v);
    const validator = ofSingleValidator(sValidator);

    testValidationResults(validator, [1, 2, 3], [
      messageResult("message #1"),
      messageResult("message #2"),
      messageResult("message #3"),
    ]);
  }); //    Given a single Validator
}); //    ofOneTimeValidator

describe("ofBoolValidator", () => {
  describe("Sanity checks", () => {
    it("it should be a function",
      () => expect(typeof ofBoolValidator).toBe("function"));
  }); //    Sanity checks

  describe("Given a succeeding BooleanValidator with custom message", () => {
    const bValidator: BoolValidator = (v: any) => true;
    const validator = ofBoolValidator("custom error message")(bValidator);
    testValidationResults(validator, [1, 2, 3], [
      successResult(), successResult(), successResult(),
    ]);
  }); //    Given a succeeding BooleanValidator with custom message

  describe("Given a failing BooleanValidator with custom message", () => {
    const bValidator: BoolValidator = (v: any) => false;
    const validator = ofBoolValidator("custom error message")(bValidator);
    testValidationResults(validator, [1, 2, 3], [
      errorResult("custom error message"),
      errorResult("custom error message"),
      errorResult("custom error message"),
    ]);
  }); //    Given a failing BooleanValidator with custom message

  describe("Given a failing BooleanValidator with custom message factory", () => {
    const bValidator: BoolValidator = (v: any) => false;
    const validator = ofBoolValidator(v => "custom error message " + v)(bValidator);
    testValidationResults(validator, [1, 2, 3], [
      errorResult("custom error message 1"),
      errorResult("custom error message 2"),
      errorResult("custom error message 3"),
    ]);
  }); //    Given a failing BooleanValidator with custom message factory
}); //    ofOneTimeValidator

describe("ofMessageValidator", () => {
  describe("Sanity checks", () => {
    it("it should be a function",
      () => expect(typeof ofMessageValidator).toBe("function"));
  }); //    Sanity checks

  describe("Given a succeeding message Validator", () => {
    const mValidator: MessageValidator = (v: any) => "";
    const validator = ofMessageValidator(mValidator);

    testValidationResults(validator, [1, 2, 3], [
      successResult(), successResult(), successResult(),
    ]);
  }); //    Given a succeeding message Validator

  describe("Given a failing message Validator", () => {
    const mValidator: MessageValidator = (v: any) => "error message #" + v;
    const validator = ofMessageValidator(mValidator);

    testValidationResults(validator, [1, 2, 3], [
      errorResult("error message #1"),
      errorResult("error message #2"),
      errorResult("error message #3"),
    ]);
  }); //    Given a failing message Validator
}); //    ofOneTimeValidator

describe("ofThrowValidator", () => {
  describe("Sanity checks", () => {
    it("it should be a function",
      () => expect(typeof ofThrowValidator).toBe("function"));
  }); //    Sanity checks

  describe("Given a succeeding throw Validator", () => {
    const tValidator: ThrowValidator = (v: any) => { return; };
    const validator = ofThrowValidator(tValidator);

    testValidationResults(validator, [1, 2, 3], [
      successResult(), successResult(), successResult(),
    ]);
  }); //    Given a succeeding throw Validator

  describe("Given a failing throw Validator throwing Error", () => {
    const tValidator: ThrowValidator = (v: any) => {
      throw new Error("error message #" + v);
    };
    const validator = ofThrowValidator(tValidator);

    testValidationResults(validator, [1, 2, 3], [
      errorResult("error message #1"),
      errorResult("error message #2"),
      errorResult("error message #3"),
    ]);
  }); //    Given a failing throw Validator

  describe("Given a failing throw Validator throwing messages", () => {
    const tValidator: ThrowValidator = (v: any) => {
      throw ("error message #" + v);
    };
    const validator = ofThrowValidator(tValidator);

    testValidationResults(validator, [1, 2, 3], [
      errorResult("error message #1"),
      errorResult("error message #2"),
      errorResult("error message #3"),
    ]);
  }); //    Given a failing throw Validator

  describe("Given a failing throw Validator throwing weird", () => {
    const tValidator: ThrowValidator = (v: any) => {
      throw v;
    };
    const validator = ofThrowValidator(tValidator);

    testValidationResults(validator, [1, 2, 3], [
      errorResult("Invalid value"),
      errorResult("Invalid value"),
      errorResult("Invalid value"),
    ]);
  }); //    Given a failing throw Validator
}); //    ofOneTimeValidator
