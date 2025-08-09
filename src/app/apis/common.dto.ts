export interface BaseResponse<T> {
  success: boolean;
  data: T;
}

export interface BaseResponseList<T> extends BaseResponse<T[]> {
  currentPage: number;
  lastPage: number;
}

export interface BaseResponsePagination<T> extends BaseResponse<T[]> {
  lastPage: number;
  count: { filtered: number; total: number };
}

export interface DisplayValue {
  name: string;
  value: string;
}

export interface ErrorResponse extends Error {
  code: string;
  message: string;
  statusCode: unknown;
}

export type RecursiveNullable<T> = {
  [P in keyof T]: T[P] extends object
    ? RecursiveNullable<T[P]> | null
    : T[P] | null;
};

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? RecursivePartial<T[P]> | undefined
    : T[P] | undefined;
};

export type SetOptional<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;
