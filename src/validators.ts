import { Validator, ofBoolValidator } from "./Validator";
import * as utils from "./internalValidators";

export const isRequired = ofBoolValidator("is required")(utils.isRequired);
