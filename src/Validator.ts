import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";
import "rxjs/add/operator/map";
import "rxjs/add/operator/switchMap";
import { ValidationResult, successResult, errorResult } from "./ValidationResult";
import { isEmpty } from "./internalValidators";

export type Validator = (value$: Observable<any>) => Observable<ValidationResult>;

export type OneTimeValidator = (value: any) => Observable<ValidationResult>;

export type SingleValidator = (value: any) => ValidationResult;

export type BoolValidator = (value: any) => boolean;

export type MessageValidator = (value: any) => string;

export const ofOneTimeValidator =
  (validator: OneTimeValidator): Validator =>
    (value$: Observable<any>) =>
      value$.switchMap(validator);

export const ofSingleValidator =
  (validator: SingleValidator): Validator =>
    (value$: Observable<any>) =>
      value$.map(validator);

export const ofBoolValidator =
  (errorMessage: string | (() => string)) =>
    (validator: BoolValidator): Validator =>
      (value$: Observable<any>) =>
        value$.map(v => validator(v)
          ? successResult()
          : errorResult(typeof errorMessage === "string" ? errorMessage : errorMessage()));

export const ofMessageValidator =
  (validator: MessageValidator): Validator =>
    (value$: Observable<any>) =>
      value$.map(v => {
        const text = validator(v);
        return isEmpty(text)
          ? successResult()
          : errorResult(text);
      });


