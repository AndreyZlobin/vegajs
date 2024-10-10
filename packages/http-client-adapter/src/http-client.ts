import type {
  Headers,
  HttpClient,
  InitParams,
  MethodParams,
  SearchParams,
} from './types';

export class HttpService implements HttpClient {
  constructor(private readonly adapter: HttpClient) {}

  public addHeaders(headers: Headers) {
    this.adapter.addHeaders(headers);
  }

  public init(params: InitParams) {
    this.adapter.init(params);
  }

  public delete<Data = unknown, Params = SearchParams>(
    point: string,
    params?: MethodParams<Params>,
  ): Promise<Data> {
    return this.adapter.delete(point, params);
  }

  public get<Data = unknown, Params = SearchParams>(
    point: string,
    params?: MethodParams<Params>,
  ): Promise<Data> {
    return this.adapter.get(point, params);
  }

  public patch<Data = unknown, Body = unknown, Params = SearchParams>(
    point: string,
    body: Body,
    params?: MethodParams<Params>,
  ): Promise<Data> {
    return this.adapter.patch(point, body, params);
  }

  public post<Data = unknown, Body = unknown, Params = SearchParams>(
    point: string,
    body: Body,
    params?: MethodParams<Params>,
  ): Promise<Data> {
    return this.adapter.post(point, body, params);
  }

  public put<Data = unknown, Body = unknown, Params = SearchParams>(
    point: string,
    body: Body,
    params?: MethodParams<Params>,
  ): Promise<Data> {
    return this.adapter.put(point, body, params);
  }
}

export const createHttpService = (adapter: HttpClient) =>
  new HttpService(adapter);
