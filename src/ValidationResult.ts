import * as assign from "object-assign";

export type ValidationResultKind = "success" | "message" | "collection" | "object";
export type ValidationResultType = "error" | "inconclusive" | "success";

export interface ValidationResultBase {
    readonly type: ValidationResultType;
    readonly isError: boolean;
    readonly isInconclusive: boolean;
    readonly isSuccess: boolean;
    readonly message: string;
}

export interface MessageResult extends ValidationResultBase {
    readonly kind: "success" | "message";
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

export const successResult = (): MessageResult =>
    assign(baseResult("success"), {
        kind: "success" as "success",
        message: "",
    });

export const messageResult = (message?: string): MessageResult =>
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
    if (properties.length === 0) {
        return assign(baseResult("success"), {
            kind: "object" as "object",
            properties: [],
            message: "",
        });
    }

    const type = properties.map(r => r.result.type).reduce(getWorstType, "success");
    const message = properties
        .reduce((acc, r) => newLineIfNeeded(acc) + newLineIfNeeded(r.property) + r.result.message, "");
    return assign(baseResult(type), {
        kind: "object" as "object",
        properties,
        message,
    });
};

export const propertiesResult = (properties: { [name: string]: ValidationResult }): ObjectResult => {
    const props: PropertyValidation[] =
        Object.keys(properties).map(key => ({ property: key, result: properties[key] }));
    return objectResult(props);
};

export const getWorstType = (a: ValidationResultType, b: ValidationResultType): ValidationResultType => {
    switch (a) {
        case "error": return "error";
        case "inconclusive": if (b === "error") { return b; } else { return a; }
        default: return b;
    }
};

export const reduceCollection = (results: ValidationResult[], result: ValidationResult): ValidationResult[] => {
    if (results.length === 0) {
        if (result.kind === "success") { return []; }
        if (result.kind === "collection") {
            return result.results.reduce(reduceCollection, []);
        }
        return [result];
    }
    if (result.kind === "success") { return results; }
    if (result.kind === "message") {
        if (!results.find(r => r.kind === result.kind && r.message === result.message)) {
            return [...results, result];
        } else {
            return results;
        }
    } else if (result.kind === "collection") {
        return result.results.reduce(reduceCollection, results);
    } else {
        return [...results, result];
    }
};

export const getSimplestResults = (results: ValidationResult[]): ValidationResult => {
    if (results.length === 0) { return successResult(); }
    if (results.length === 1) { return results[0]; }
    return collectionResult(results);
};

export const collectResults = (
    results: ValidationResult[]
): ValidationResult => {
    const reduced = results.reduce(reduceCollection, []);
    return getSimplestResults(reduced);
};

export const combineResults = (
    results: { [key: string]: ValidationResult }
): ValidationResult => {
    const keys = Object.keys(results);
    if (keys.length === 0) { return successResult(); }
    const result = objectResult(keys.map(property => {
        const vr = results[property];
        return { property, result: vr };
    }));
    return result;
};

export const bindResults = (
    results: ValidationResult[]
): ValidationResult => {
    const compute = (index: number, current: ValidationResult[]): ValidationResult[] => {
        if (index >= results.length) { return current; }
        const next = results[index];
        if (next.isError) {
            return [...current, next];
        }
        return compute(index + 1, [...current, next]);
    };
    const bound = compute(0, []);
    return collectResults(bound);
};
