"use strict";

import "jest";
require("babel-core/register");
require("babel-polyfill");

import {
  ValidationResultType,
  successResult, inconclusiveResult, errorResult, collectionResult, objectResult,
  getWorstType,
  keepErrorsOnly,
} from "./index";

describe("successResult", () => {
  describe("Sanity checks", () => {
    it("it should be a function", () => expect(typeof successResult).toBe("function"));
  }); //    Sanity checks
  describe("When a success result is created", () => {
    const result = successResult();
    it("it should be as expected", () => expect(result).toEqual({
      kind: "message",
      type: "success",
      isSuccess: true,
      isInconclusive: false,
      isError: false,
      message: "",
    }));
  }); //    When a success result is created

  describe("When a message result is created", () => {
    const result = successResult("A message");
    it("it should be as expected", () => expect(result).toEqual({
      kind: "message",
      type: "success",
      isSuccess: true,
      isInconclusive: false,
      isError: false,
      message: "A message",
    }));
  }); //    When a message result is created
}); //    successResult

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
    const result = collectionResult([successResult("message #1")]);
    it("it should be as expected",
      () => expect(result).toEqual({
        kind: "collection",
        type: "success",
        isSuccess: true,
        isInconclusive: false,
        isError: false,
        results: [successResult("message #1")],
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
      successResult("message #1"),
      successResult("warning #2"),
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
          successResult("message #1"),
          successResult("warning #2"),
          errorResult("error #2"),
        ],
        message: "error #1\r\nmessage #1\r\nwarning #2\r\nerror #2",
      }));
  }); //    When a collection result is created with a mix including errors

  describe("When a collection result is created with a mix not including errors", () => {
    const result = collectionResult([
      successResult(),
      successResult("message #1"),
      successResult("warning #2"),
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
          successResult("message #1"),
          successResult("warning #2"),
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
      { property: "prop1", result: successResult("message #1") },
    ]);
    it("it should be as expected",
      () => expect(result).toEqual({
        kind: "object",
        type: "success",
        isSuccess: true,
        isInconclusive: false,
        isError: false,
        properties: [
          { property: "prop1", result: successResult("message #1") },
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
      { property: "prop3", result: successResult("message #1") },
      { property: "prop4", result: successResult("warning #2") },
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
          { property: "prop3", result: successResult("message #1") },
          { property: "prop4", result: successResult("warning #2") },
          { property: "prop5", result: errorResult("error #2") },
        ],
        message: "prop1\r\nerror #1\r\nprop2\r\nprop3\r\nmessage #1\r\nprop4\r\nwarning #2\r\nprop5\r\nerror #2",
      }));
  }); //    When a object result is created with a mix including errors

  describe("When a object result is created with a mix not including errors", () => {
    const result = objectResult([
      { property: "prop2", result: successResult() },
      { property: "prop3", result: successResult("message #1") },
      { property: "prop4", result: successResult("warning #2") },
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
          { property: "prop3", result: successResult("message #1") },
          { property: "prop4", result: successResult("warning #2") },
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

describe("keepErrorsOnly", () => {
  describe("Sanity checks", () => {
    it("it should be a function", () => expect(typeof keepErrorsOnly).toBe("function"));
  }); //    Sanity checks

  describe("Keeping only errors from successful result", () => {
    const current = keepErrorsOnly(successResult());
    const expected = successResult();
    it("it should give success",
      () => expect(current).toEqual(expected));
  }); //    Keeping only errors from successful result

  describe("Keeping only errors from message result", () => {
    const current = keepErrorsOnly(successResult("message #1"));
    const expected = successResult();
    it("it should give success",
      () => expect(current).toEqual(expected));
  }); //    Keeping only errors from message result

  describe("Keeping only errors from warning result", () => {
    const current = keepErrorsOnly(successResult("warning #1"));
    const expected = successResult();
    it("it should give success",
      () => expect(current).toEqual(expected));
  }); //    Keeping only errors from warning result

  describe("Keeping only errors from error result", () => {
    const current = keepErrorsOnly(errorResult("error #1"));
    const expected = errorResult("error #1");
    it("it should give success",
      () => expect(current).toEqual(expected));
  }); //    Keeping only errors from error result

  describe("Keeping only errors from successful collection result", () => {
    const current = keepErrorsOnly(collectionResult([
      successResult(),
      successResult("message #1"),
      successResult("warning #2"),
    ]));
    const expected = successResult();
    it("it should give success",
      () => expect(current).toEqual(expected));
  }); //    Keeping only errors from successful collection result

  describe("Keeping only errors from error collection result", () => {
    describe("When the collection is flat", () => {
      const current = keepErrorsOnly(collectionResult([
        errorResult("error #1"),
        successResult(),
        successResult("message #1"),
        successResult("warning #2"),
        errorResult("error #2"),
      ]));
      const expected = collectionResult([
        errorResult("error #1"),
        errorResult("error #2"),
      ]);
      it("it should give error",
        () => expect(current).toEqual(expected));
    }); //    When the collection is flat
    describe("When the collection is deep", () => {
      const current = keepErrorsOnly(collectionResult([
        collectionResult([
          errorResult("error #1"),
          successResult(),
          successResult("message #1"),
          successResult("warning #2"),
          errorResult("error #2"),
        ]),
        successResult(),
        successResult("message #3"),
        successResult("warning #4"),
        errorResult("error #5"),
        collectionResult([
          successResult(),
          successResult("message #6"),
          successResult("warning #7"),
        ]),
      ]));
      const expected = collectionResult([
        collectionResult([
          errorResult("error #1"),
          errorResult("error #2"),
        ]),
        errorResult("error #5"),
      ]);
      it("it should give error",
        () => expect(current).toEqual(expected));
    }); //    When the collection is flat
    describe("When the collection has only errors", () => {
      const current = keepErrorsOnly(collectionResult([
        errorResult("error #1"),
        collectionResult([
          errorResult("error #2"),
          errorResult("error #3"),
        ]),
        errorResult("error #4"),
      ]));
      const expected = collectionResult([
        errorResult("error #1"),
        collectionResult([
          errorResult("error #2"),
          errorResult("error #3"),
        ]),
        errorResult("error #4"),
      ]);
      it("it should give error",
        () => expect(current).toEqual(expected));
    }); //    When the collection is flat
  }); //    Keeping only errors from error collection result

  describe("Keeping only errors from successful object result", () => {
    const current = keepErrorsOnly(objectResult([
      { property: "prop2", result: successResult() },
      { property: "prop3", result: successResult("message #1") },
      { property: "prop4", result: successResult("warning #2") },
    ]));
    const expected = successResult();
    it("it should give success",
      () => expect(current).toEqual(expected));
  }); //    Keeping only errors from successful object result

  describe("Keeping only errors from error object result", () => {
    describe("When the object is flat", () => {
      const current = keepErrorsOnly(objectResult([
        { property: "prop1", result: errorResult("error #1") },
        { property: "prop2", result: successResult() },
        { property: "prop3", result: successResult("message #1") },
        { property: "prop4", result: successResult("warning #2") },
        { property: "prop5", result: errorResult("error #2") },
      ]));
      const expected = objectResult([
        { property: "prop1", result: errorResult("error #1") },
        { property: "prop5", result: errorResult("error #2") },
      ]);
      it("it should give error",
        () => expect(current).toEqual(expected));
    }); //    When the object is flat
    describe("When the object is deep", () => {
      const current = keepErrorsOnly(objectResult([
        {
          property: "prop1", result: objectResult([
            { property: "prop2", result: errorResult("error #1") },
            { property: "prop3", result: successResult() },
            { property: "prop4", result: successResult("message #1") },
            { property: "prop5", result: successResult("warning #2") },
            { property: "prop6", result: errorResult("error #2") },
          ]),
        },
        { property: "prop7", result: successResult() },
        { property: "prop8", result: successResult("message #3") },
        { property: "prop9", result: successResult("warning #4") },
        { property: "prop10", result: errorResult("error #5") },
        {
          property: "prop11", result: objectResult([
            { property: "prop12", result: successResult() },
            { property: "prop13", result: successResult("message #6") },
            { property: "prop14", result: successResult("warning #7") },
          ]),
        },
      ]));
      const expected = objectResult([
        {
          property: "prop1", result: objectResult([
            { property: "prop2", result: errorResult("error #1") },
            { property: "prop6", result: errorResult("error #2") },
          ]),
        },
        { property: "prop10", result: errorResult("error #5") },
      ]);
      it("it should give error",
        () => expect(current).toEqual(expected));
    }); //    When the object is flat
    describe("When the object has only errors", () => {
      const current = keepErrorsOnly(objectResult([
        { property: "prop1", result: errorResult("error #1") },
        {
          property: "prop2", result: objectResult([
            { property: "prop3", result: errorResult("error #2") },
            { property: "prop4", result: errorResult("error #3") },
          ]),
        },
        { property: "prop5", result: errorResult("error #4") },
      ]));
      const expected = objectResult([
        { property: "prop1", result: errorResult("error #1") },
        {
          property: "prop2", result: objectResult([
            { property: "prop3", result: errorResult("error #2") },
            { property: "prop4", result: errorResult("error #3") },
          ]),
        },
        { property: "prop5", result: errorResult("error #4") },
      ]);
      it("it should give error",
        () => expect(current).toEqual(expected));
    }); //    When the object is flat
  }); //    Keeping only errors from error object result
}); //    keepErrorsOnly
