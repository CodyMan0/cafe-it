/* eslint-disable @typescript-eslint/no-explicit-any */
// import { getAuth } from "@/app/config/common";
import { convertRecordValueString } from "@/shared/lib/utils";

import { toast } from "react-toastify";

export type Primitive = string | number | boolean | null | undefined;

// TODO: 제거 필요
export type NestedRecord = any;
export interface CustomResponse<R> {
  data: R;
  status: number;
  statusText: string;
  headers: Headers;
}

export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PATCH: "PATCH",
  DELETE: "DELETE",
} as const;

export const CONTENT_TYPE = {
  JSON: "application/json",
};

export type HttpMethod = (typeof HTTP_METHODS)[keyof typeof HTTP_METHODS];

export class HttpClient {
  #baseUrl: string;

  constructor({ baseUrl }: { baseUrl: string }) {
    this.#baseUrl = baseUrl;
  }

  get baseUrl() {
    return this.#baseUrl;
  }

  // get authorization() {
  //   return {
  //     Authorization: getAuth(),
  //   };
  // }

  get contentJsonType() {
    return { "Content-Type": CONTENT_TYPE.JSON };
  }

  private async handleResponse<R>(
    response: Response
  ): Promise<CustomResponse<R>> {
    const data = (await response.json()) as R;
    if (response.status === 403) {
      // 클라이언트 환경일 때만 라우팅 가능
      toast.error("세션이 만료되었습니다. 다시 로그인해주세요.");
      if (typeof window !== "undefined") {
        window.location.href = "/login"; // or router.push('/login')
      }
    }

    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    };
  }

  async get<R>(url: string, params?: NestedRecord, options?: NestedRecord) {
    const customHeaders = (options?.headers ?? {}) as NestedRecord;

    const queryString = new URLSearchParams(
      convertRecordValueString(params)
    ).toString();

    const queryUrl = `${this.baseUrl}${url}?${queryString}`;

    const result = await fetch(queryUrl, {
      method: HTTP_METHODS.GET,
      headers: {
        ...this.contentJsonType,
        // ...this.authorization,
        ...customHeaders,
      },
    });

    return this.handleResponse<R>(result);
  }

  async post<R>(url: string, body: NestedRecord, options?: NestedRecord) {
    const customHeaders = (options?.headers ?? {}) as NestedRecord;
    const params = options?.params as NestedRecord;

    const queryString = params
      ? "?" + new URLSearchParams(convertRecordValueString(params)).toString()
      : "";

    const requestUrl = `${this.baseUrl}${url}${queryString}`;

    const result = await fetch(requestUrl, {
      method: HTTP_METHODS.POST,
      headers: {
        ...this.contentJsonType,
        // ...this.authorization,
        ...customHeaders,
      },
      body: JSON.stringify(body),
    });

    return this.handleResponse<R>(result);
  }

  async patch<R>(url: string, body?: any, options?: any) {
    const customHeaders = options?.headers ?? {};

    const requestUrl = `${this.baseUrl}${url}`;
    const result = await fetch(requestUrl, {
      method: "PATCH",
      headers: {
        ...this.contentJsonType,
        // ...this.authorization,
        ...customHeaders,
      },
      body: JSON.stringify(body),
    });

    return this.handleResponse<R>(result);
  }

  async delete(url: string, body?: NestedRecord, options?: NestedRecord) {
    const customHeaders = (options?.headers ?? {}) as NestedRecord;

    const requestUrl = `${this.baseUrl}${url}`;
    const result = await fetch(requestUrl, {
      method: "DELETE",
      headers: {
        ...this.contentJsonType,
        // ...this.authorization,
        ...customHeaders,
      },
      body: JSON.stringify(body),
    });

    return this.handleResponse(result);
  }
}
