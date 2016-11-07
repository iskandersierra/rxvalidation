import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/merge";
import "rxjs/add/observable/of";
import "rxjs/add/operator/map";
import "rxjs/add/operator/reduce";
import "rxjs/add/operator/scan";
import "rxjs/add/operator/switchMap";
import { Validator } from "./Validator";
import {
  ValidationResult,
  successResult, messageResult, errorResult, inconclusiveResult,
  combine,
} from "./ValidationResult";
import * as utils from "./internalValidators";

export const success: Validator = (value: any) =>
  Observable.of<ValidationResult>(successResult());

export const message = (msg: string): Validator => (value: any) =>
  Observable.of<ValidationResult>(messageResult(msg));

export const error = (msg: string): Validator => (value: any) =>
  Observable.of<ValidationResult>(errorResult(msg));

export const inconclusive = (msg?: string): Validator => (value: any) =>
  Observable.of<ValidationResult>(inconclusiveResult(msg));

export const yieldResult = error;
export const yieldFrom = (validator: Validator) => validator;

export const collectScan = (...validators: Validator[]): Validator =>
  (value: any) =>
    Observable
      .merge(...validators.map(v => v(value)))
      .scan((a, b) => combine(a, b), successResult())
  ;

export const ValidatorMonad = {
  // Atomic creators
  success,
  message,
  inconclusive,
  error,


};

// export class ValidatorBuilder {

// }

// export const validate = new ValidatorBuilder();
