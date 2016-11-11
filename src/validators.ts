import { Validator, ofBoolValidator } from "./Validator";
import * as utils from "./internal";

export const isRequired = ofBoolValidator("is required")(utils.isRequired);
