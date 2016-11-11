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
import { testFunctionNames, testBoolValidators } from "./testValidators";

describe("type validators", () => {
    const names = [
        "isNull", "isNotNull",
        "isDefined", "isUndefined",
        "isNothing",
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
    describe("bool validators", () => {
        describe("Sanity checks", () => {
            it("it should be a object", () => expect(typeof boolCommon).toBe("object"));
            testFunctionNames(boolCommon, names);
        }); //    Sanity checks

        describe("Test values", () => {
            testBoolValidators(boolCommon, values, {
                isNull: "X............",
                isNotNull: ".XXXXXXXXXXXX",
                isUndefined: ".X...........",
                isDefined: "X.XXXXXXXXXXX",
                isNothing: "XX...........",
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
            });
        }); //    Test values
    }); //    bool validators
}); //    type validators
