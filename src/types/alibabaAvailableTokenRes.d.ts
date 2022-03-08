export type ResultType = {
    bannerId: string;
    requestId: string;
}

export type FinalResult = {
    departing: Array<object>;
    hasLabel: boolean;
    isCompleted: boolean;
    returning: Array<object>;
}

export interface AlibabaAvailableTokenRes {
    error: string | object;
    result: ResultType | FinalResult;
    success: boolean;
    targetUrl: string;
    unauthorizedRequest: boolean;
    __traceId: string;
    __wrapped: boolean;
}