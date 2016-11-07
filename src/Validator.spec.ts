"use strict";

import "jest";
require("babel-core/register");
require("babel-polyfill");
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";
import "rxjs/add/operator/timeout";
import "rxjs/add/operator/toArray";
import "rxjs/add/operator/toPromise";

import {
  ValidationResult, successResult, ObjectResult, CollectionResult,
  errorResult, collectionResult, objectResult, messageResult,
  keepErrorsOnly, Validator, BoolValidator, MessageValidator,
  SyncValidator, ThrowValidator,
  ofSyncValidator, ofBoolValidator, ofMessageValidator,
  ofThrowValidator,
} from "./index";

const testValidationResults =
  (
    validator: Validator,
    value: any,
    expected: ValidationResult[],
  ) => {
    it(`when the value is ${value} the validator should return the expected sequence`,
      () => {
        const promise = validator(value)
          .timeout(40)
          .toArray()
          .toPromise();
        return promise.then(r => expect(r).toEqual(expected));
      });
  };

describe("ofSyncValidator", () => {
  describe("Sanity checks", () => {
    it("it should be a function",
      () => expect(typeof ofSyncValidator).toBe("function"));
  }); //    Sanity checks

  describe("Given a sync Validator", () => {
    const sValidator: SyncValidator = (v: any) => messageResult("message #" + v);
    const validator = ofSyncValidator(sValidator);

    testValidationResults(validator, 1, [messageResult("message #1")]);
    testValidationResults(validator, "hello", [messageResult("message #hello")]);
    testValidationResults(validator, false, [messageResult("message #false")]);
  }); //    Given a sync Validator
}); //    ofOneTimeValidator

describe("ofBoolValidator", () => {
  describe("Sanity checks", () => {
    it("it should be a function",
      () => expect(typeof ofBoolValidator).toBe("function"));
  }); //    Sanity checks

  describe("Given a succeeding BooleanValidator with custom message", () => {
    const bValidator: BoolValidator = (v: any) => true;
    const validator = ofBoolValidator("custom error message")(bValidator);
    testValidationResults(validator, 1, [successResult()]);
    testValidationResults(validator, "hello", [successResult()]);
    testValidationResults(validator, false, [successResult()]);
  }); //    Given a succeeding BooleanValidator with custom message

  describe("Given a failing BooleanValidator with custom message", () => {
    const bValidator: BoolValidator = (v: any) => false;
    const validator = ofBoolValidator("custom error message")(bValidator);
    testValidationResults(validator, 1, [errorResult("custom error message")]);
    testValidationResults(validator, "hello", [errorResult("custom error message")]);
    testValidationResults(validator, false, [errorResult("custom error message")]);
  }); //    Given a failing BooleanValidator with custom message

  describe("Given a failing BooleanValidator with custom message factory", () => {
    const bValidator: BoolValidator = (v: any) => false;
    const validator = ofBoolValidator(v => "custom error message " + v)(bValidator);
    testValidationResults(validator, 1, [errorResult("custom error message 1")]);
    testValidationResults(validator, "hello", [errorResult("custom error message hello")]);
    testValidationResults(validator, false, [errorResult("custom error message false")]);
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
    testValidationResults(validator, 1, [successResult()]);
    testValidationResults(validator, "hello", [successResult()]);
    testValidationResults(validator, false, [successResult()]);
  }); //    Given a succeeding message Validator

  describe("Given a failing message Validator", () => {
    const mValidator: MessageValidator = (v: any) => "error message #" + v;
    const validator = ofMessageValidator(mValidator);
    testValidationResults(validator, 1, [errorResult("error message #1")]);
    testValidationResults(validator, "hello", [errorResult("error message #hello")]);
    testValidationResults(validator, false, [errorResult("error message #false")]);
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
    testValidationResults(validator, 1, [successResult()]);
    testValidationResults(validator, "hello", [successResult()]);
    testValidationResults(validator, false, [successResult()]);
  }); //    Given a succeeding throw Validator

  describe("Given a failing throw Validator throwing Error", () => {
    const tValidator: ThrowValidator = (v: any) => {
      throw new Error("error message #" + v);
    };
    const validator = ofThrowValidator(tValidator);
    testValidationResults(validator, 1, [errorResult("error message #1")]);
    testValidationResults(validator, "hello", [errorResult("error message #hello")]);
    testValidationResults(validator, false, [errorResult("error message #false")]);
  }); //    Given a failing throw Validator

  describe("Given a failing throw Validator throwing messages", () => {
    const tValidator: ThrowValidator = (v: any) => {
      throw ("error message #" + v);
    };
    const validator = ofThrowValidator(tValidator);
    testValidationResults(validator, 1, [errorResult("error message #1")]);
    testValidationResults(validator, "hello", [errorResult("error message #hello")]);
    testValidationResults(validator, false, [errorResult("error message #false")]);
  }); //    Given a failing throw Validator

  describe("Given a failing throw Validator throwing weird", () => {
    const tValidator: ThrowValidator = (v: any) => {
      throw v;
    };
    const validator = ofThrowValidator(tValidator);
    testValidationResults(validator, 1, [errorResult("Invalid value")]);
    testValidationResults(validator, "hello", [errorResult("hello")]);
    testValidationResults(validator, false, [errorResult("Invalid value")]);
  }); //    Given a failing throw Validator
}); //    ofOneTimeValidator
