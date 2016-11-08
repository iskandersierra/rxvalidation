"use strict";

import "jest";
require("babel-core/register");
require("babel-polyfill");

import {
  ValidationResult, ValidationResultType,
  successResult, messageResult, inconclusiveResult, errorResult,
  collectionResult, objectResult, propertiesResult,
  getWorstType,
  reduceCollection, combineResults,
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

describe("combineResults", () => {
  describe("Sanity checks", () => {
    it("it should be a function",
      () => expect(typeof combineResults).toBe("function"));
  }); //    Sanity checks

  const testCombineResults = (
    aname: string, bname: string,
    a: ValidationResult[], b: ValidationResult) =>
    describe(`Given a ${aname} results`, () => {
      describe(`When it is combine as result`, () => {
        it(`it should be reduced to ${bname}`, () => expect(combineResults(a)).toEqual(b));
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

  testCombineResults("empty", "success", [], succ);
  testCombineResults("[succ]", "success", [succ], succ);
  testCombineResults("[succ, succ]", "success", [succ, succ], succ);
  testCombineResults("[succ, message, succ]", "message", [succ, msg, succ], msg);
  testCombineResults("[succ, inconclusive, succ]", "inconclusive", [succ, inc, succ], inc);
  testCombineResults("[succ, error, succ]", "error", [succ, err, succ], err);
  testCombineResults("[msg, msg]", "message", [msg, msg], msg);
  testCombineResults("[msg, msg2]", "[msg, msg2]", [msg, msg2], collectionResult([msg, msg2]));
  testCombineResults("[err, err]", "message", [err, err], err);
  testCombineResults("[err, err2]", "[err, err2]", [err, err2], collectionResult([err, err2]));
  testCombineResults("[msg, succ, err]", "[msg, err]", [msg, succ, err], collectionResult([msg, err]));
}); //    reduceCollection

// describe("combine", () => {
//   describe("Sanity checks", () => {
//     it("it should be a function", () =>
//       expect(typeof combine).toEqual("function"));
//   });    // Sanity checks

//   const testCombine = (
//     aname: string, bname: string, cname: string,
//     a: ValidationResult, b: ValidationResult, c: ValidationResult
//   ) =>
//     describe(`Given a ${aname} result`, () => {
//       describe(`When it is combined with a ${bname} result`, () => {
//         it(`it should give a ${cname} result`,
//           () => expect(combine(a, b)).toEqual(c));
//       }); //    When it is combined with a success result
//     }); //    Given a success result

//   const succ = successResult();
//   const msg = messageResult("Hint");
//   const msg2 = messageResult("Hint #2");
//   const err = errorResult("Error");
//   const err2 = errorResult("Error #2");
//   const inc = inconclusiveResult("Inconclusive");
//   const inc2 = inconclusiveResult("Inconclusive #2");
//   const coll = collectionResult([err, msg]);
//   const coll2 = collectionResult([inc2, msg2]);

//   // Atom + Atom
//   testCombine("success", "success", "success", succ, succ, succ);
//   testCombine("success", "message", "message", succ, msg, msg);
//   testCombine("success", "inconclusive", "inconclusive", succ, inc, inc);
//   testCombine("success", "error", "error", succ, err, err);

//   testCombine("message", "success", "message", msg, succ, msg);
//   testCombine("message", "message", "message", msg, msg, msg);
//   testCombine("message", "message 2", "collection", msg, msg2, collectionResult([msg, msg2]));
//   testCombine("message 2", "message", "collection", msg2, msg, collectionResult([msg2, msg]));
//   testCombine("message", "inconclusive", "collection", msg, inc, collectionResult([msg, inc]));
//   testCombine("message", "error", "collection", msg, err, collectionResult([msg, err]));

//   testCombine("inconclusive", "success", "inconclusive", inc, succ, inc);
//   testCombine("inconclusive", "message", "collection", inc, msg, collectionResult([inc, msg]));
//   testCombine("inconclusive", "inconclusive", "inconclusive", inc, inc, inc);
//   testCombine("inconclusive", "inconclusive 2", "collection", inc, inc2, collectionResult([inc, inc2]));
//   testCombine("inconclusive 2", "inconclusive", "collection", inc2, inc, collectionResult([inc2, inc]));
//   testCombine("inconclusive", "error", "collection", inc, err, collectionResult([inc, err]));

//   testCombine("error", "success", "error", err, succ, err);
//   testCombine("error", "message", "collection", err, msg, collectionResult([err, msg]));
//   testCombine("error", "inconclusive", "collection", err, inc, collectionResult([err, inc]));
//   testCombine("error", "error", "error", err, err, err);
//   testCombine("error", "error 2", "collection", err, err2, collectionResult([err, err2]));
//   testCombine("error 2", "error", "collection", err2, err, collectionResult([err2, err]));

//   // Collection + (Atom | Collection)
//   testCombine("success", "collection", "collection", succ, coll, coll);
//   testCombine("collection", "success", "collection", coll, succ, coll);

//   testCombine("message", "collection", "collection", msg, coll, collectionResult([msg, err]));
//   testCombine("message 2", "collection", "combined collection", msg2, coll, collectionResult([msg2, err, msg]));
//   testCombine("collection", "message", "collection", coll, msg, coll);
//   testCombine("collection", "message 2", "combined collection", coll, msg2, collectionResult([err, msg, msg2]));

//   testCombine("collection", "collection", "collection", coll, coll, coll);
//   testCombine("collection", "collection2", "combined collection", coll, coll2,
//     collectionResult([err, msg, inc2, msg2]));

// }); //    combine

// describe("keepErrorsOnly", () => {
//   describe("Sanity checks", () => {
//     it("it should be a function", () => expect(typeof keepErrorsOnly).toBe("function"));
//   }); //    Sanity checks

//   describe("Keeping only errors from successful result", () => {
//     const current = keepErrorsOnly(successResult());
//     const expected = successResult();
//     it("it should give success",
//       () => expect(current).toEqual(expected));
//   }); //    Keeping only errors from successful result

//   describe("Keeping only errors from message result", () => {
//     const current = keepErrorsOnly(messageResult("message #1"));
//     const expected = successResult();
//     it("it should give success",
//       () => expect(current).toEqual(expected));
//   }); //    Keeping only errors from message result

//   describe("Keeping only errors from warning result", () => {
//     const current = keepErrorsOnly(messageResult("warning #1"));
//     const expected = successResult();
//     it("it should give success",
//       () => expect(current).toEqual(expected));
//   }); //    Keeping only errors from warning result

//   describe("Keeping only errors from error result", () => {
//     const current = keepErrorsOnly(errorResult("error #1"));
//     const expected = errorResult("error #1");
//     it("it should give success",
//       () => expect(current).toEqual(expected));
//   }); //    Keeping only errors from error result

//   describe("Keeping only errors from successful collection result", () => {
//     const current = keepErrorsOnly(collectionResult([
//       successResult(),
//       messageResult("message #1"),
//       messageResult("warning #2"),
//     ]));
//     const expected = successResult();
//     it("it should give success",
//       () => expect(current).toEqual(expected));
//   }); //    Keeping only errors from successful collection result

//   describe("Keeping only errors from error collection result", () => {
//     describe("When the collection is flat", () => {
//       const current = keepErrorsOnly(collectionResult([
//         errorResult("error #1"),
//         successResult(),
//         messageResult("message #1"),
//         messageResult("warning #2"),
//         errorResult("error #2"),
//       ]));
//       const expected = collectionResult([
//         errorResult("error #1"),
//         errorResult("error #2"),
//       ]);
//       it("it should give error",
//         () => expect(current).toEqual(expected));
//     }); //    When the collection is flat
//     describe("When the collection is deep", () => {
//       const current = keepErrorsOnly(collectionResult([
//         collectionResult([
//           errorResult("error #1"),
//           successResult(),
//           messageResult("message #1"),
//           messageResult("warning #2"),
//           errorResult("error #2"),
//         ]),
//         successResult(),
//         messageResult("message #3"),
//         messageResult("warning #4"),
//         errorResult("error #5"),
//         collectionResult([
//           successResult(),
//           messageResult("message #6"),
//           messageResult("warning #7"),
//         ]),
//       ]));
//       const expected = collectionResult([
//         collectionResult([
//           errorResult("error #1"),
//           errorResult("error #2"),
//         ]),
//         errorResult("error #5"),
//       ]);
//       it("it should give error",
//         () => expect(current).toEqual(expected));
//     }); //    When the collection is flat
//     describe("When the collection has only errors", () => {
//       const current = keepErrorsOnly(collectionResult([
//         errorResult("error #1"),
//         collectionResult([
//           errorResult("error #2"),
//           errorResult("error #3"),
//         ]),
//         errorResult("error #4"),
//       ]));
//       const expected = collectionResult([
//         errorResult("error #1"),
//         collectionResult([
//           errorResult("error #2"),
//           errorResult("error #3"),
//         ]),
//         errorResult("error #4"),
//       ]);
//       it("it should give error",
//         () => expect(current).toEqual(expected));
//     }); //    When the collection is flat
//   }); //    Keeping only errors from error collection result

//   describe("Keeping only errors from successful object result", () => {
//     const current = keepErrorsOnly(objectResult([
//       { property: "prop2", result: successResult() },
//       { property: "prop3", result: messageResult("message #1") },
//       { property: "prop4", result: messageResult("warning #2") },
//     ]));
//     const expected = successResult();
//     it("it should give success",
//       () => expect(current).toEqual(expected));
//   }); //    Keeping only errors from successful object result

//   describe("Keeping only errors from error object result", () => {
//     describe("When the object is flat", () => {
//       const current = keepErrorsOnly(objectResult([
//         { property: "prop1", result: errorResult("error #1") },
//         { property: "prop2", result: successResult() },
//         { property: "prop3", result: messageResult("message #1") },
//         { property: "prop4", result: messageResult("warning #2") },
//         { property: "prop5", result: errorResult("error #2") },
//       ]));
//       const expected = objectResult([
//         { property: "prop1", result: errorResult("error #1") },
//         { property: "prop5", result: errorResult("error #2") },
//       ]);
//       it("it should give error",
//         () => expect(current).toEqual(expected));
//     }); //    When the object is flat
//     describe("When the object is deep", () => {
//       const current = keepErrorsOnly(objectResult([
//         {
//           property: "prop1", result: objectResult([
//             { property: "prop2", result: errorResult("error #1") },
//             { property: "prop3", result: successResult() },
//             { property: "prop4", result: messageResult("message #1") },
//             { property: "prop5", result: messageResult("warning #2") },
//             { property: "prop6", result: errorResult("error #2") },
//           ]),
//         },
//         { property: "prop7", result: successResult() },
//         { property: "prop8", result: messageResult("message #3") },
//         { property: "prop9", result: messageResult("warning #4") },
//         { property: "prop10", result: errorResult("error #5") },
//         {
//           property: "prop11", result: objectResult([
//             { property: "prop12", result: successResult() },
//             { property: "prop13", result: messageResult("message #6") },
//             { property: "prop14", result: messageResult("warning #7") },
//           ]),
//         },
//       ]));
//       const expected = objectResult([
//         {
//           property: "prop1", result: objectResult([
//             { property: "prop2", result: errorResult("error #1") },
//             { property: "prop6", result: errorResult("error #2") },
//           ]),
//         },
//         { property: "prop10", result: errorResult("error #5") },
//       ]);
//       it("it should give error",
//         () => expect(current).toEqual(expected));
//     }); //    When the object is flat
//     describe("When the object has only errors", () => {
//       const current = keepErrorsOnly(objectResult([
//         { property: "prop1", result: errorResult("error #1") },
//         {
//           property: "prop2", result: objectResult([
//             { property: "prop3", result: errorResult("error #2") },
//             { property: "prop4", result: errorResult("error #3") },
//           ]),
//         },
//         { property: "prop5", result: errorResult("error #4") },
//       ]));
//       const expected = objectResult([
//         { property: "prop1", result: errorResult("error #1") },
//         {
//           property: "prop2", result: objectResult([
//             { property: "prop3", result: errorResult("error #2") },
//             { property: "prop4", result: errorResult("error #3") },
//           ]),
//         },
//         { property: "prop5", result: errorResult("error #4") },
//       ]);
//       it("it should give error",
//         () => expect(current).toEqual(expected));
//     }); //    When the object is flat
//   }); //    Keeping only errors from error object result
// }); //    keepErrorsOnly
