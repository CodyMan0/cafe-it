import { getBaseUrl } from "@/app/config/common";
import { HttpClient } from "./http-client";

const httpClient = new HttpClient({
  // baseUrl: `${getBaseUrl()}/dev`,
  baseUrl: `${getBaseUrl()}`,
});

export { httpClient };
