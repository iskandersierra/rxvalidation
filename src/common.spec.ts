"use strict";

import "jest";
require("babel-core/register");
require("babel-polyfill");

import {
    successResult,
    errorResult, collectionResult, objectResult,
    Validator,
    common, syncCommon, boolCommon, messageCommon,
} from "./index";
import {
    testFunctionNames,
    testBoolValidators, testMessageValidators, testSyncValidators, testValidators,
} from "./testValidators";

describe("type validators", () => {
    const names = [
        "isNull", "isNotNull",
        "isDefined", "isUndefined",
        "isNothing", "isSomething",
        "isBoolean", "isNotBoolean",
        "isNumber", "isNotNumber",
        "isSymbol", "isNotSymbol",
        "isString", "isNotString",
        "isFunction", "isNotFunction",
        "isObject", "isNotObject",
        "isArray", "isNotArray",
    ];
    const values = [
        null, undefined, true, false, 0, 10, Infinity, NaN, "", "abc", () => null, {}, [],
    ];
    const boolResults = {
        isNull: "X............",
        isNotNull: ".XXXXXXXXXXXX",
        isUndefined: ".X...........",
        isDefined: "X.XXXXXXXXXXX",
        isNothing: "XX...........",
        isSomething: "..XXXXXXXXXXX",
        isBoolean: "..XX.........",
        isNotBoolean: "XX..XXXXXXXXX",
        isNumber: "....XXXX.....",
        isNotNumber: "XXXX....XXXXX",
        isSymbol: ".............",
        isNotSymbol: "XXXXXXXXXXXXX",
        isString: "........XX...",
        isNotString: "XXXXXXXX..XXX",
        isFunction: "..........X..",
        isNotFunction: "XXXXXXXXXX.XX",
        isObject: "X..........XX",
        isNotObject: ".XXXXXXXXXX..",
        isArray: "............X",
        isNotArray: "XXXXXXXXXXXX.",
    };

    describe("bool validators", () => {
        describe("Sanity checks", () => {
            it("it should be a object", () => expect(typeof boolCommon).toBe("object"));
            testFunctionNames(boolCommon, names);
        }); //    Sanity checks

        describe("Test values", () => {
            testBoolValidators(boolCommon, values, boolResults);
        }); //    Test values
    }); //    bool validators

    describe("message validators", () => {
        describe("Sanity checks", () => {
            it("it should be a object", () => expect(typeof messageCommon).toBe("object"));
            testFunctionNames(messageCommon, names);
        }); //    Sanity checks

        describe("Test values", () => {
            testMessageValidators(messageCommon, values, boolResults);
        }); //    Test values
    }); //    bool validators

    describe("sync validators", () => {
        describe("Sanity checks", () => {
            it("it should be a object", () => expect(typeof syncCommon).toBe("object"));
            testFunctionNames(syncCommon, names);
        }); //    Sanity checks

        describe("Test values", () => {
            testSyncValidators(syncCommon, values, boolResults);
        }); //    Test values
    }); //    bool validators

    describe("validators", () => {
        describe("Sanity checks", () => {
            it("it should be a object", () => expect(typeof common).toBe("object"));
            testFunctionNames(common, names);
        }); //    Sanity checks

        describe("Test values", () => {
            testValidators(common, values, boolResults);
        }); //    Test values
    }); //    bool validators
}); //    type validators
