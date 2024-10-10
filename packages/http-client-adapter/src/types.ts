export type SearchParams = Record<string, string | number | boolean>;

export type Headers = Record<string, string>;

export type MethodParams<P = SearchParams> = {
  searchParams?: P;
  headers?: Headers;
  signal?: AbortSignal;
};

export type InitParams = {
  baseURL?: string;
};

export interface HttpClient {
  get<Data = unknown, Params = SearchParams>(
    point: string,
    params?: MethodParams<Params>,
  ): Promise<Data>;

  post<Data = unknown, Body = unknown, Params = SearchParams>(
    point: string,
    body: Body,
    params?: MethodParams<Params>,
  ): Promise<Data>;

  put<Data = unknown, Body = unknown, Params = SearchParams>(
    point: string,
    body: Body,
    params?: MethodParams<Params>,
  ): Promise<Data>;

  patch<Data = unknown, Body = unknown, Params = SearchParams>(
    point: string,
    body: Body,
    params?: MethodParams<Params>,
  ): Promise<Data>;

  delete<Data = unknown, Params = SearchParams>(
    point: string,
    params?: MethodParams<Params>,
  ): Promise<Data>;

  addHeaders(headers: Headers): void;

  init(params: InitParams): void;
}
