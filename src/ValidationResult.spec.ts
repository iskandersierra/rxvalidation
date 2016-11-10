"use strict";

import "jest";
require("babel-core/register");
require("babel-polyfill");

import {
  ValidationResult, ValidationResultType,
  successResult, messageResult, inconclusiveResult, errorResult,
  collectionResult, objectResult, propertiesResult,
  getWorstType,
  reduceCollection, collectResults, combineResults,
} from "./index";

describe("successResult", () => {
  describe("Sanity checks", () => {
    it("it should be a function", () => expect(typeof successResult).toBe("function"));
  }); //    Sanity checks
  describe("When a success result is created", () => {
    const result = successResult();
    it("it should be as expected", () => expect(result).toEqual({
      kind: "success",
      type: "success",
      isSuccess: true,
      isInconclusive: false,
      isError: false,
      message: "",
    }));
  }); //    When a success result is created
}); //    successResult

describe("messageResult", () => {
  describe("Sanity checks", () => {
    it("it should be a function", () => expect(typeof messageResult).toBe("function"));
  }); //    Sanity checks
  describe("When a message result is created with no message", () => {
    const result = messageResult();
    it("it should be as expected", () => expect(result).toEqual({
      kind: "message",
      type: "success",
      isSuccess: true,
      isInconclusive: false,
      isError: false,
      message: "",
    }));
  }); //    When a success result is created

  describe("When a message result is created with a message", () => {
    const result = messageResult("A message");
    it("it should be as expected", () => expect(result).toEqual({
      kind: "message",
      type: "success",
      isSuccess: true,
      isInconclusive: false,
      isError: false,
      message: "A message",
    }));
  }); //    When a message result is created
}); //    messageResult

describe("inconclusiveResult", () => {
  describe("Sanity checks", () => {
    it("it should be a function", () => expect(typeof inconclusiveResult).toBe("function"));
  }); //    Sanity checks
  describe("When a inconclusive result is created", () => {
    const result = inconclusiveResult("An inconclusive result");
    it("it should be as expected", () => expect(result).toEqual({
      kind: "message",
      type: "inconclusive",
      isSuccess: false,
      isInconclusive: true,
      isError: false,
      message: "An inconclusive result",
    }));
  }); //    When a inconclusive result is created
}); //    inconclusiveResult

describe("errorResult", () => {
  describe("Sanity checks", () => {
    it("it should be a function", () => expect(typeof errorResult).toBe("function"));
  }); //    Sanity checks
  describe("When a error result is created", () => {
    const result = errorResult("An error");
    it("it should be as expected", () => expect(result).toEqual({
      kind: "message",
      type: "error",
      isSuccess: false,
      isInconclusive: false,
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
        type: "success",
        isSuccess: true,
        isInconclusive: false,
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
        type: "error",
        isSuccess: false,
        isInconclusive: false,
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
        type: "success",
        isSuccess: true,
        isInconclusive: false,
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
        type: "success",
        isSuccess: true,
        isInconclusive: false,
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
      messageResult("warning #2"),
      errorResult("error #2"),
    ]);
    it("it should be as expected",
      () => expect(result).toEqual({
        kind: "collection",
        type: "error",
        isSuccess: false,
        isInconclusive: false,
        isError: true,
        results: [
          errorResult("error #1"),
          successResult(),
          messageResult("message #1"),
          messageResult("warning #2"),
          errorResult("error #2"),
        ],
        message: "error #1\r\nmessage #1\r\nwarning #2\r\nerror #2",
      }));
  }); //    When a collection result is created with a mix including errors

  describe("When a collection result is created with a mix not including errors", () => {
    const result = collectionResult([
      successResult(),
      messageResult("message #1"),
      messageResult("warning #2"),
    ]);
    it("it should be as expected",
      () => expect(result).toEqual({
        kind: "collection",
        type: "success",
        isSuccess: true,
        isInconclusive: false,
        isError: false,
        results: [
          successResult(),
          messageResult("message #1"),
          messageResult("warning #2"),
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
        type: "success",
        isSuccess: true,
        isInconclusive: false,
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
        type: "error",
        isSuccess: false,
        isInconclusive: false,
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
        type: "success",
        isSuccess: true,
        isInconclusive: false,
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
        type: "success",
        isSuccess: true,
        isInconclusive: false,
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
      { property: "prop4", result: messageResult("warning #2") },
      { property: "prop5", result: errorResult("error #2") },
    ]);
    it("it should be as expected",
      () => expect(result).toEqual({
        kind: "object",
        type: "error",
        isSuccess: false,
        isInconclusive: false,
        isError: true,
        properties: [
          { property: "prop1", result: errorResult("error #1") },
          { property: "prop2", result: successResult() },
          { property: "prop3", result: messageResult("message #1") },
          { property: "prop4", result: messageResult("warning #2") },
          { property: "prop5", result: errorResult("error #2") },
        ],
        message: "prop1\r\nerror #1\r\nprop2\r\nprop3\r\nmessage #1\r\nprop4\r\nwarning #2\r\nprop5\r\nerror #2",
      }));
  }); //    When a object result is created with a mix including errors

  describe("When a object result is created with a mix not including errors", () => {
    const result = objectResult([
      { property: "prop2", result: successResult() },
      { property: "prop3", result: messageResult("message #1") },
      { property: "prop4", result: messageResult("warning #2") },
    ]);
    it("it should be as expected",
      () => expect(result).toEqual({
        kind: "object",
        type: "success",
        isSuccess: true,
        isInconclusive: false,
        isError: false,
        properties: [
          { property: "prop2", result: successResult() },
          { property: "prop3", result: messageResult("message #1") },
          { property: "prop4", result: messageResult("warning #2") },
        ],
        message: "prop2\r\nprop3\r\nmessage #1\r\nprop4\r\nwarning #2",
      }));
  }); //    When a object result is created with a mix not including errors
}); //    objectResult

describe("getWorstType", () => {
  describe("Sanity checks", () => {
    it("it should be a function", () =>
      expect(typeof getWorstType).toEqual("function"));
  });    // Sanity checks

  const testGetWorstType = (a: ValidationResultType, b: ValidationResultType, c: ValidationResultType) =>
    it(`for ${a}, ${b} it should return ${c}`, () =>
      expect(getWorstType(a, b)).toEqual(c));

  testGetWorstType("success", "success", "success");
  testGetWorstType("success", "inconclusive", "inconclusive");
  testGetWorstType("success", "error", "error");
  testGetWorstType("inconclusive", "success", "inconclusive");
  testGetWorstType("inconclusive", "inconclusive", "inconclusive");
  testGetWorstType("inconclusive", "error", "error");
  testGetWorstType("error", "success", "error");
  testGetWorstType("error", "inconclusive", "error");
  testGetWorstType("error", "error", "error");
});    // getWorstType

describe("reduceCollection", () => {
  describe("Sanity checks", () => {
    it("it should be a function",
      () => expect(typeof reduceCollection).toBe("function"));
  }); //    Sanity checks

  const testReduceCollection = (
    aname: string, bname: string, cname: string,
    a: ValidationResult[], b: ValidationResult, c: ValidationResult[]) =>
    describe(`Given a ${aname} results`, () => {
      describe(`When it is reduced with ${bname} result`, () => {
        it(`it should be reduced to ${cname}`,
          () => expect(reduceCollection(a, b)).toEqual(c));
      }); //    When it is reduced with ${bname} result
    });

  const succ = successResult();
  const msg = messageResult("Hint");
  const msg2 = messageResult("Hint #2");
  const err = errorResult("Error");
  const err2 = errorResult("Error #2");
  const inc = inconclusiveResult("Inconclusive");
  const inc2 = inconclusiveResult("Inconclusive #2");
  const coll = collectionResult([err, msg]);
  const coll2 = collectionResult([inc2, msg2]);

  testReduceCollection("empty", "success", "empty", [], succ, []);
  testReduceCollection("empty", "message", "[message]", [], msg, [msg]);
  testReduceCollection("empty", "inconclusive", "[inconclusive]", [], inc, [inc]);
  testReduceCollection("empty", "error", "[error]", [], err, [err]);
  testReduceCollection("empty", "collection", "collection",
    [], collectionResult([succ, msg, inc, err]), [msg, inc, err]);
  testReduceCollection("empty", "object", "object",
    [], propertiesResult({ succ, msg, inc, err }), [propertiesResult({ succ, msg, inc, err })]);
  testReduceCollection("empty", "[collection]", "collection",
    [], collectionResult([collectionResult([succ, msg, inc, err])]), [msg, inc, err]);

  testReduceCollection("[msg]", "success", "empty", [msg], succ, [msg]);
  testReduceCollection("[msg]", "message", "[message]", [msg], msg, [msg]);
  testReduceCollection("[msg]", "inconclusive", "[inconclusive]", [msg], inc, [msg, inc]);
  testReduceCollection("[msg]", "error", "[error]", [msg], err, [msg, err]);
  testReduceCollection("[msg]", "collection", "collection",
    [msg], collectionResult([succ, msg, inc, err]), [msg, inc, err]);
  testReduceCollection("[msg2]", "collection", "collection",
    [msg2], collectionResult([succ, msg, inc, err]), [msg2, msg, inc, err]);
  testReduceCollection("[msg]", "collection", "collection",
    [msg], collectionResult([succ, msg2, inc, err]), [msg, msg2, inc, err]);
  testReduceCollection("[msg]", "object", "collection",
    [msg], propertiesResult({ succ, msg, inc, err }), [msg, propertiesResult({ succ, msg, inc, err })]);

  testReduceCollection("[err]", "success", "empty", [err], succ, [err]);
  testReduceCollection("[err]", "message", "[err, message]", [err], msg, [err, msg]);
  testReduceCollection("[err]", "inconclusive", "[inconclusive]", [err], inc, [err, inc]);
  testReduceCollection("[err]", "error", "[error]", [err], err, [err]);
  testReduceCollection("[err]", "collection", "collection",
    [err], collectionResult([succ, msg, inc, err]), [err, msg, inc]);
  testReduceCollection("[err]", "collection", "collection",
    [err2], collectionResult([succ, msg, inc, err]), [err2, msg, inc, err]);
  testReduceCollection("[err2]", "collection", "collection",
    [err], collectionResult([succ, msg, inc, err2]), [err, msg, inc, err2]);
  testReduceCollection("[err]", "object", "collection",
    [err], propertiesResult({ succ, msg, inc, err }), [err, propertiesResult({ succ, msg, inc, err })]);
}); //    reduceCollection

describe("collectResults", () => {
  describe("Sanity checks", () => {
    it("it should be a function",
      () => expect(typeof collectResults).toBe("function"));
  }); //    Sanity checks

  const testCollectResults = (
    aname: string, bname: string,
    a: ValidationResult[], b: ValidationResult) =>
    describe(`Given a ${aname} results`, () => {
      describe(`When they are collected as results`, () => {
        it(`it should be reduced to ${bname}`,
          () => expect(collectResults(a)).toEqual(b));
      }); //    When it is reduced with ${bname} result
    });

  const succ = successResult();
  const msg = messageResult("Hint");
  const msg2 = messageResult("Hint #2");
  const err = errorResult("Error");
  const err2 = errorResult("Error #2");
  const inc = inconclusiveResult("Inconclusive");
  const inc2 = inconclusiveResult("Inconclusive #2");
  const coll = collectionResult([err, msg]);
  const coll2 = collectionResult([inc2, msg2]);

  testCollectResults("empty", "success", [], succ);
  testCollectResults("[succ]", "success", [succ], succ);
  testCollectResults("[succ, succ]", "success", [succ, succ], succ);
  testCollectResults("[succ, message, succ]", "message", [succ, msg, succ], msg);
  testCollectResults("[succ, inconclusive, succ]", "inconclusive", [succ, inc, succ], inc);
  testCollectResults("[succ, error, succ]", "error", [succ, err, succ], err);
  testCollectResults("[msg, msg]", "message", [msg, msg], msg);
  testCollectResults("[msg, msg2]", "[msg, msg2]", [msg, msg2], collectionResult([msg, msg2]));
  testCollectResults("[err, err]", "message", [err, err], err);
  testCollectResults("[err, err2]", "[err, err2]", [err, err2], collectionResult([err, err2]));
  testCollectResults("[msg, succ, err]", "[msg, err]", [msg, succ, err], collectionResult([msg, err]));
}); //    reduceCollection

describe("combineResults", () => {
  describe("Sanity checks", () => {
    it("it should be a function",
      () => expect(typeof combineResults).toBe("function"));
  }); //    Sanity checks

  const testCombineResults = (
    aname: string, bname: string,
    a: { [key: string]: ValidationResult }, b: ValidationResult) =>
    describe(`Given a ${aname} results`, () => {
      describe(`When it is combine as result`, () => {
        it(`it should be reduced to ${bname}`,
          () => expect(combineResults(a)).toEqual(b));
      }); //    When it is reduced with ${bname} result
    });

  const succ = successResult();
  const msg = messageResult("Hint");
  const msg2 = messageResult("Hint #2");
  const err = errorResult("Error");
  const err2 = errorResult("Error #2");
  const inc = inconclusiveResult("Inconclusive");
  const inc2 = inconclusiveResult("Inconclusive #2");
  const coll = collectionResult([err, msg]);
  const coll2 = collectionResult([inc2, msg2]);

  testCombineResults("{}", "success", {}, succ);
  testCombineResults("{field:success}", "{field:success}", { field: succ }, propertiesResult({ field: succ }));
  testCombineResults("{field1...field4}", "{field1...field4}",
    { field1: succ, field2: msg, field3: inc, field4: coll },
    propertiesResult({ field1: succ, field2: msg, field3: inc, field4: coll }));
}); //    reduceCollection
