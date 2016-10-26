
export interface MessageResult {
    kind: "success" | "message" | "error" | "warning";
    isError: boolean;
    message: string;
}

export interface CollectionResult {
    kind: "collection";
    isError: boolean;
    results: ValidationResult[];
    message: string;
}

export interface PropertyValidation {
    property: string;
    result: ValidationResult;
}

export interface ObjectResult {
    kind: "object";
    isError: boolean;
    properties: PropertyValidation[];
    message: string;
}

export type ValidationResult =
    MessageResult |
    CollectionResult |
    ObjectResult;

export const successResult = (): MessageResult => ({
    kind: "success",
    isError: false,
    message: "",
});

export const messageResult = (msg: string): MessageResult => ({
    kind: "message",
    isError: false,
    message: msg,
});

export const warningResult = (msg: string): MessageResult => ({
    kind: "warning",
    isError: false,
    message: msg,
});

export const errorResult = (msg: string): MessageResult => ({
    kind: "error",
    isError: true,
    message: msg,
});

const newLineIfNeeded = (text: string) =>
    text === "" || text.endsWith("\r\n") ? text : text + "\r\n";

export const collectionResult = (results: ValidationResult[]): CollectionResult => {
    const isError = results.some(r => r.isError);
    const toShow = isError ? results.filter(r => r.isError) : results;
    const message = toShow.reduce((acc, r) => newLineIfNeeded(acc) + r.message, "");
    return {
        kind: "collection",
        isError,
        results,
        message,
    };
};

export const objectResult = (properties: PropertyValidation[]): ObjectResult => {
    const isError = properties.some(r => r.result.isError);
    const toShow = isError ? properties.filter(p => p.result.isError) : properties;
    const message = toShow
        .reduce((acc, r) => newLineIfNeeded(acc) + newLineIfNeeded(r.property) + r.result.message, "");
    return {
        kind: "object",
        isError,
        properties,
        message,
    };
};
