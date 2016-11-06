import * as assign from "object-assign";

export type ValidationResultKind = "message" | "collection" | "object";
export type ValidationResultType = "error" | "inconclusive" | "success";

export interface ValidationResultBase {
    readonly type: ValidationResultType;
    readonly isError: boolean;
    readonly isInconclusive: boolean;
    readonly isSuccess: boolean;
    readonly message: string;
}

export interface MessageResult extends ValidationResultBase {
    readonly kind: "message";
}

export interface CollectionResult extends ValidationResultBase {
    readonly kind: "collection";
    readonly isError: boolean;
    readonly results: ValidationResult[];
}

export interface PropertyValidation {
    readonly property: string;
    readonly result: ValidationResult;
}

export interface ObjectResult extends ValidationResultBase {
    readonly kind: "object";
    readonly properties: PropertyValidation[];
}

export type ValidationResult =
    MessageResult |
    CollectionResult |
    ObjectResult;

const newLineIfNeeded = (text: string) =>
    text === "" || text.endsWith("\r\n") ? text : text + "\r\n";

const baseResult = (type: ValidationResultType): ValidationResultBase => ({
    type,
    isError: type === "error",
    isInconclusive: type === "inconclusive",
    isSuccess: type === "success",
    message: "",
});

export const successResult = (message?: string): MessageResult =>
    assign(baseResult("success"), {
        kind: "message" as "message",
        message: message || "",
    });

export const inconclusiveResult = (message?: string): MessageResult =>
    assign(baseResult("inconclusive"), {
        kind: "message" as "message",
        message: message || "",
    });

export const errorResult = (message: string): MessageResult =>
    assign(baseResult("error"), {
        kind: "message" as "message",
        message,
    });

export const collectionResult = (results: ValidationResult[]): CollectionResult => {
    const type = results.map(r => r.type).reduce(getWorstType, "success");
    const message = results.reduce((acc, r) => newLineIfNeeded(acc) + r.message, "");
    return assign(baseResult(type), {
        kind: "collection" as "collection",
        results,
        message,
    });
};

export const objectResult = (properties: PropertyValidation[]): ObjectResult => {
    const type = properties.map(r => r.result.type).reduce(getWorstType, "success");
    const message = properties
        .reduce((acc, r) => newLineIfNeeded(acc) + newLineIfNeeded(r.property) + r.result.message, "");
    return assign(baseResult(type), {
        kind: "object" as "object",
        properties,
        message,
    });
};

export const getWorstType = (a: ValidationResultType, b: ValidationResultType): ValidationResultType => {
    switch (a) {
        case "error": return "error";
        case "inconclusive": if (b === "error") { return b; } else { return a; }
        default: return b;
    }
};

export const keepErrorsOnly =
    (result: ValidationResult): ValidationResult => {
        if (!result.isError) {
            return successResult();
        }
        if (result.kind === "collection") {
            const errorResults = result.results
                .filter(r => r.isError)
                .map(r => keepErrorsOnly(r));
            if (errorResults.length === result.results.length) {
                return result;
            } else {
                return collectionResult(errorResults);
            }
        } else if (result.kind === "object") {
            const errorProperties = result.properties
                .filter(p => p.result.isError)
                .map(p => ({ property: p.property, result: keepErrorsOnly(p.result) }));
            if (errorProperties.length === result.properties.length) {
                return result;
            } else {
                return objectResult(errorProperties);
            }
        } else {
            return result;
        }
    };
