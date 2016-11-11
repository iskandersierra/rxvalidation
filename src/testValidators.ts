"use strict";

import "jest";
require("babel-core/register");
require("babel-polyfill");
import {
  BoolValidator,
} from "./index";

export const testFunctionNames = (o: Object, names: string[]) => {
  names.forEach(name =>
    it(name + " should be a function",
      () => expect(typeof o[name]).toBe("function"))
  );
  Object.keys(o)
    .filter(name => names.indexOf(name) < 0)
    .forEach(key =>
      it(key + " should not be defined here",
        () => expect(true).toBe(false)));
};

export const testBoolValidators = (
  o: Object,
  values: any[],
  expected: { [name: string]: string }
) => {
  const X = "X".charAt(0);
  Object.keys(expected).forEach(name => {
    const fn: BoolValidator = o[name];
    describe(name, () => {
      let someError = false;
      for (let i = 0; i < values.length; i++) {
        const value = values[i];
        const expectedValue = i < expected[name].length ? expected[name].charAt(i) === X : false;
        if (fn(value) !== expectedValue) {
          someError = true;
          it(`${name}(${JSON.stringify(value)}) should be equal to ${expectedValue}`,
            () => expect(!expectedValue).toBe(expectedValue));
        }
      }
      if (!someError) {
        it(`${name}(...) should evaluate as expected`, () => { return; });
      }
    }); //     
  });
};
