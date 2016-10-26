"use strict";

import "jest";
require("babel-core/register");
require("babel-polyfill");

import {
  successResult, messageResult, warningResult,
  errorResult, collectionResult, objectResult,
} from "./index";

describe("successResult", () => {
  describe("Sanity checks", () => {
    it("it should be a function", () => expect(typeof successResult).toBe("function"));
  }); //    Sanity checks
  describe("When a success result is created", () => {
    const result = successResult();
    it("it should be as expected", () => expect(result).toEqual({
      kind: "success",
      isError: false,
      message: "",
    }));
  }); //    When a success result is created
}); //    successResult

describe("messageResult", () => {
  describe("Sanity checks", () => {
    it("it should be a function", () => expect(typeof messageResult).toBe("function"));
  }); //    Sanity checks
  describe("When a message result is created", () => {
    const result = messageResult("A message");
    it("it should be as expected", () => expect(result).toEqual({
      kind: "message",
      isError: false,
      message: "A message",
    }));
  }); //    When a message result is created
}); //    messageResult

describe("warningResult", () => {
  describe("Sanity checks", () => {
    it("it should be a function", () => expect(typeof warningResult).toBe("function"));
  }); //    Sanity checks
  describe("When a warning result is created", () => {
    const result = warningResult("A warning");
    it("it should be as expected", () => expect(result).toEqual({
      kind: "warning",
      isError: false,
      message: "A warning",
    }));
  }); //    When a warning result is created
}); //    warningResult

describe("errorResult", () => {
  describe("Sanity checks", () => {
    it("it should be a function", () => expect(typeof errorResult).toBe("function"));
  }); //    Sanity checks
  describe("When a error result is created", () => {
    const result = errorResult("An error");
    it("it should be as expected", () => expect(result).toEqual({
      kind: "error",
      isError: true,
      message: "An error",
    }));
  }); //    When a error result is created
}); //    errorResult

describe("collectionResult", () => {
  describe("Sanity checks", () => {
    it("it should be a function", () => expect(typeof collectionResult).toBe("function"));
  }); //    Sanity checks
  describe("When an empty collection result is created", () => {
    const result = collectionResult([]);
    it("it should be as expected",
      () => expect(result).toEqual({
        kind: "collection",
        isError: false,
        results: [],
        message: "",
      }));
  }); //    When an empty collection result is created

  describe("When a collection result is created with one error", () => {
    const result = collectionResult([errorResult("error #1")]);
    it("it should be as expected",
      () => expect(result).toEqual({
        kind: "collection",
        isError: true,
        results: [errorResult("error #1")],
        message: "error #1",
      }));
  }); //    When a collection result is created with one error

  describe("When a collection result is created with one message", () => {
    const result = collectionResult([messageResult("message #1")]);
    it("it should be as expected",
      () => expect(result).toEqual({
        kind: "collection",
        isError: false,
        results: [messageResult("message #1")],
        message: "message #1",
      }));
  }); //    When a collection result is created with one message

  describe("When a collection result is created with one success", () => {
    const result = collectionResult([successResult()]);
    it("it should be as expected",
      () => expect(result).toEqual({
        kind: "collection",
        isError: false,
        results: [successResult()],
        message: "",
      }));
  }); //    When a collection result is created with one success

  describe("When a collection result is created with a mix including errors", () => {
    const result = collectionResult([
      errorResult("error #1"),
      successResult(),
      messageResult("message #1"),
      warningResult("warning #2"),
      errorResult("error #2"),
    ]);
    it("it should be as expected",
      () => expect(result).toEqual({
        kind: "collection",
        isError: true,
        results: [
          errorResult("error #1"),
          successResult(),
          messageResult("message #1"),
          warningResult("warning #2"),
          errorResult("error #2"),
        ],
        message: "error #1\r\nerror #2",
      }));
  }); //    When a collection result is created with a mix including errors

  describe("When a collection result is created with a mix not including errors", () => {
    const result = collectionResult([
      successResult(),
      messageResult("message #1"),
      warningResult("warning #2"),
    ]);
    it("it should be as expected",
      () => expect(result).toEqual({
        kind: "collection",
        isError: false,
        results: [
          successResult(),
          messageResult("message #1"),
          warningResult("warning #2"),
        ],
        message: "message #1\r\nwarning #2",
      }));
  }); //    When a collection result is created with a mix not including errors
}); //    collectionResult

describe("objectResult", () => {
  describe("Sanity checks", () => {
    it("it should be a function", () => expect(typeof objectResult).toBe("function"));
  }); //    Sanity checks
  describe("When an empty object result is created", () => {
    const result = objectResult([]);
    it("it should be as expected",
      () => expect(result).toEqual({
        kind: "object",
        isError: false,
        properties: [],
        message: "",
      }));
  }); //    When an empty object result is created

  describe("When a object result is created with one error", () => {
    const result = objectResult([
      { property: "prop1", result: errorResult("error #1") },
    ]);
    it("it should be as expected",
      () => expect(result).toEqual({
        kind: "object",
        isError: true,
        properties: [
          { property: "prop1", result: errorResult("error #1") },
        ],
        message: "prop1\r\nerror #1",
      }));
  }); //    When a object result is created with one error

  describe("When a object result is created with one message", () => {
    const result = objectResult([
      { property: "prop1", result: messageResult("message #1") },
    ]);
    it("it should be as expected",
      () => expect(result).toEqual({
        kind: "object",
        isError: false,
        properties: [
          { property: "prop1", result: messageResult("message #1") },
        ],
        message: "prop1\r\nmessage #1",
      }));
  }); //    When a object result is created with one message

  describe("When a object result is created with one success", () => {
    const result = objectResult([
      { property: "prop1", result: successResult() },
    ]);
    it("it should be as expected",
      () => expect(result).toEqual({
        kind: "object",
        isError: false,
        properties: [
          { property: "prop1", result: successResult() },
        ],
        message: "prop1\r\n",
      }));
  }); //    When a object result is created with one success

  describe("When a object result is created with a mix including errors", () => {
    const result = objectResult([
      { property: "prop1", result: errorResult("error #1") },
      { property: "prop2", result: successResult() },
      { property: "prop3", result: messageResult("message #1") },
      { property: "prop4", result: warningResult("warning #2") },
      { property: "prop5", result: errorResult("error #2") },
    ]);
    it("it should be as expected",
      () => expect(result).toEqual({
        kind: "object",
        isError: true,
        properties: [
          { property: "prop1", result: errorResult("error #1") },
          { property: "prop2", result: successResult() },
          { property: "prop3", result: messageResult("message #1") },
          { property: "prop4", result: warningResult("warning #2") },
          { property: "prop5", result: errorResult("error #2") },
        ],
        message: "prop1\r\nerror #1\r\nprop5\r\nerror #2",
      }));
  }); //    When a object result is created with a mix including errors

  describe("When a object result is created with a mix not including errors", () => {
    const result = objectResult([
      { property: "prop2", result: successResult() },
      { property: "prop3", result: messageResult("message #1") },
      { property: "prop4", result: warningResult("warning #2") },
    ]);
    it("it should be as expected",
      () => expect(result).toEqual({
        kind: "object",
        isError: false,
        properties: [
          { property: "prop2", result: successResult() },
          { property: "prop3", result: messageResult("message #1") },
          { property: "prop4", result: warningResult("warning #2") },
        ],
        message: "prop2\r\nprop3\r\nmessage #1\r\nprop4\r\nwarning #2",
      }));
  }); //    When a object result is created with a mix not including errors
}); //    objectResult
