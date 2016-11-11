import {
  BoolValidator, MessageValidator, SyncValidator, Validator,
} from "./Validator";
import {
  successResult, messageResult, errorResult,
} from "./ValidationResult";

export const compose = <Z, Y, X>(
  f: (y: Y) => Z,
  g: (x: X) => Y,
) => (x: X) => f(g(x));

export const compose3 = <U, Z, Y, X>(
  f: (z: Z) => U,
  g: (y: Y) => Z,
  h: (x: X) => Y,
) => compose(compose(f, g), h);

export const compose4 = <V, U, Z, Y, X>(
  f: (u: U) => V,
  g: (z: Z) => U,
  h: (y: Y) => Z,
  k: (x: X) => Y,
) => compose(compose(f, g), compose(h, k));

const notFunc = (x: boolean) => !x;

export const isNot =
  (validator: BoolValidator): BoolValidator =>
    compose(notFunc, validator);
export const isEither =
  (...validators: BoolValidator[]): BoolValidator =>
    (v: any) =>
      validators.reduce((a, val) => a || val(v), false);
export const isAll =
  (...validators: BoolValidator[]): BoolValidator =>
    (v: any) =>
      validators.reduce((a, val) => a && val(v), true);

export const b2m /* bool-to-message Validator */ = (
  msg: string, validator: BoolValidator
): MessageValidator =>
  (value: any) => validator(value) ? "" : (msg || "Error");

export const b2s /* bool-to-sync Validator */ = (
  msg: string, validator: BoolValidator
): SyncValidator =>
  (value: any) => validator(value) ? successResult() : errorResult(msg || "Error");

export const m2s /* message-to-sync Validator */ = (
  validator: MessageValidator
): SyncValidator =>
  (value: any) => {
    const msg = validator(value);
    return msg === "" ? successResult() : errorResult(msg);
  };
