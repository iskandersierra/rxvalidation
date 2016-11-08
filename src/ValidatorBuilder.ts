import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/combineLatest";
import "rxjs/add/observable/merge";
import "rxjs/add/observable/of";
import "rxjs/add/operator/delay";
import "rxjs/add/operator/map";
import "rxjs/add/operator/reduce";
import "rxjs/add/operator/scan";
import "rxjs/add/operator/startWith";
import "rxjs/add/operator/switchMap";
import { Validator } from "./Validator";
import {
  ValidationResult, PropertyValidation,
  successResult, messageResult, errorResult, inconclusiveResult,
  propertiesResult, objectResult,
  combineResults,
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

export const startWith = (r: ValidationResult) =>
  (validator: Validator): Validator =>
    (value: any) =>
      validator(value).startWith(r);

export const startInconclusive = startWith(inconclusiveResult());

export const delay = (amount: number | Date) =>
  (validator: Validator): Validator =>
    (value: any) =>
      validator(value).delay(amount);

export const collect = (...validators: Validator[]): Validator => {
  if (validators.length === 0) { return success; }
  if (validators.length === 1) { return validators[0]; }
  return (value: any) => {
    const validations = validators.map(v => v(value));
    const mapper = (...results: ValidationResult[]) => combineResults(results);
    return Observable.combineLatest<ValidationResult>(...validations, mapper);
  };
};

export const compose = (properties: { [property: string]: Validator }): Validator => {
  interface NamedValidator { property: string; validator: Validator; }
  interface NamedAsyncResult { property: string; results: Observable<ValidationResult>; }
  const keys = Object.keys(properties);
  if (keys.length === 0) { return success; }
  const namedValidators = keys
    .map<NamedValidator>(property => ({ property, validator: properties[property] }));
  const temp = (value: any) => {
    const namedAsyncResults = namedValidators
      .map(({ property, validator }) =>
        ({ property, results: validator(value) } as NamedAsyncResult));
    const namedResults = namedAsyncResults
      .map(({ property, results }) =>
        results.map(result =>
          ({ property, result } as PropertyValidation)));
    const mapper = (...props: PropertyValidation[]) => objectResult(props);
    return Observable.combineLatest(...namedResults, mapper);
  };

  return temp;
};

export const ValidatorMonad = {
  // Atomic creators
  success, message, inconclusive, error,

  startWith, startInconclusive, delay,

  collect, compose,
};

// export class ValidatorBuilder {

// }

// export const validate = new ValidatorBuilder();
