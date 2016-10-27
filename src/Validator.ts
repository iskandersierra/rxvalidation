import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";
import "rxjs/add/operator/map";
import "rxjs/add/operator/switchMap";
import { ValidationResult, successResult, errorResult } from "./ValidationResult";
import { isEmpty, compose } from "./internalValidators";

export type Validator = (value$: Observable<any>) => Observable<ValidationResult>;

export type OneTimeValidator = (value: any) => Observable<ValidationResult>;

export type SingleValidator = (value: any) => ValidationResult;

export type BoolValidator = (value: any) => boolean;

export type MessageValidator = (value: any) => string;

export type ThrowValidator = (value: any) => void;

export const ofOneTimeValidator =
  (validator: OneTimeValidator): Validator =>
    (value$: Observable<any>) =>
      value$.switchMap(validator);

export const ofSingleValidator =
  (validator: SingleValidator): Validator =>
    (value$: Observable<any>) =>
      value$.map(validator);

export const ofBoolValidator =
  (errorMessage: string | ((v: any) => string)) =>
    (validator: BoolValidator): Validator =>
      (value$: Observable<any>) =>
        value$.map(v => validator(v)
          ? successResult()
          : errorResult(typeof errorMessage === "string" ? errorMessage : errorMessage(v)));

export const ofMessageValidator =
  (validator: MessageValidator): Validator =>
    (value$: Observable<any>) =>
      value$.map(v => {
        const text = validator(v);
        return isEmpty(text)
          ? successResult()
          : errorResult(text);
      });

const throwToMessageValidator =
  (validator: ThrowValidator): MessageValidator =>
    (value: any) => {
      try {
        validator(value);
        return "";
      } catch (error) {
        if (typeof error === "string") {
          return error;
        } else if (error instanceof Error) {
          return error.message;
        } else {
          return "Invalid value";
        }
      }
    };

export const ofThrowValidator =
  compose(ofMessageValidator, throwToMessageValidator);

