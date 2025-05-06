import {HTTP_CODE} from "../constants";

export interface SystemErrorOptions<TOptions = unknown> {

    /**
     * The associated HTTP status code.
     */
    httpStatusCode: number;
    /**
     * Additional data to present in the error response.
     */
    data?: TOptions;
}

export abstract class SystemError extends Error {
    public readonly httpStatusCode: number;
    public readonly data?: unknown;

    protected constructor(message: string, options: SystemErrorOptions) {
        super(message);
        this.httpStatusCode = options.httpStatusCode;
        this.data = options.data;
    }
}
export class HttpBadRequestError extends SystemError {
    public constructor(message?: string, options?: SystemErrorOptions) {
        super(message ?? 'Bad Request', {
            httpStatusCode: HTTP_CODE.BAD_REQUEST,
            ...options,
        });
    }
}

export class NotFoundSystemError extends SystemError {
    public constructor(message?: string, options?: SystemErrorOptions) {
        super(message ?? 'Not found', {
            httpStatusCode: HTTP_CODE.NOT_FOUND,
            ...options,
        });
    }
}
