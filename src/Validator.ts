import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";
import "rxjs/add/operator/map";
import "rxjs/add/operator/switchMap";
import { ValidationResult, successResult, errorResult } from "./ValidationResult";
import { isEmpty, compose, compose3, compose4 } from "./internal";

export type Validator = (value: any) => Observable<ValidationResult>;

export type SyncValidator = (value: any) => ValidationResult;

export type BoolValidator = (value: any) => boolean;

export type MessageValidator = (value: any) => string;

export type ThrowValidator = (value: any) => void;

export const ofSyncValidator =
  (validator: SyncValidator): Validator =>
    compose(Observable.of, validator);

export const ofBoolValidator =
  (errorMessage: string | ((v: any) => string)) =>
    (validator: BoolValidator) => {
      const syncValidator: SyncValidator = (value: any) =>
        validator(value)
          ? successResult()
          : errorResult(typeof errorMessage === "string" ? errorMessage : errorMessage(value));
      return ofSyncValidator(syncValidator);
    };

export const ofMessageValidator =
  (validator: MessageValidator): Validator => {
    const syncValidator: SyncValidator = (value: any) => {
      const text = validator(value);
      return isEmpty(text) ? successResult() : errorResult(text);
    };
    return ofSyncValidator(syncValidator);
  };

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
