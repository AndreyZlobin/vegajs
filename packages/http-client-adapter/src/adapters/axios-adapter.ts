import axios, { type AxiosInstance } from 'axios';
import type {
  Headers,
  HttpClient,
  InitParams,
  MethodParams,
  SearchParams,
} from '../types';

export class AxiosAdapter implements HttpClient {
  private readonly instance: AxiosInstance;

  constructor(instanceCb?: (instance: AxiosInstance) => unknown) {
    this.instance = axios.create({
      paramsSerializer: {
        serialize: (params) => {
          return new URLSearchParams(params).toString();
        },
      },
    });

    if (instanceCb) {
      instanceCb(this.instance);
    }
  }

  public init(params: InitParams) {
    this.instance.defaults.baseURL = params.baseURL;
  }

  public addHeaders(headers: Headers) {
    const originalHeaders = this.instance.defaults.headers;

    this.instance.defaults.headers = {
      ...originalHeaders,
      ...headers,
    };
  }

  public async get<Data = unknown, Params = SearchParams>(
    point: string,
    params?: MethodParams<Params>,
  ): Promise<Data> {
    const { searchParams, ...rest } = params || {};

    try {
      const response = await this.instance.get<Data>(point, {
        params: searchParams,
        ...rest,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async post<Data = unknown, Body = unknown, Params = SearchParams>(
    point: string,
    body: Body,
    params?: MethodParams<Params>,
  ): Promise<Data> {
    const { searchParams, ...rest } = params || {};

    try {
      const response = await this.instance.post<Data>(point, body, {
        params: searchParams,
        ...rest,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async put<Data = unknown, Body = unknown, Params = SearchParams>(
    point: string,
    body: Body,
    params?: MethodParams<Params>,
  ): Promise<Data> {
    const { searchParams, ...rest } = params || {};

    try {
      const response = await this.instance.put<Data>(point, body, {
        params: searchParams,
        ...rest,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async patch<Data = unknown, Body = unknown, Params = SearchParams>(
    point: string,
    body: Body,
    params?: MethodParams<Params>,
  ): Promise<Data> {
    const { searchParams, ...rest } = params || {};

    try {
      const response = await this.instance.patch<Data>(point, body, {
        params: searchParams,
        ...rest,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async delete<Data = unknown, Params = SearchParams>(
    point: string,
    params?: MethodParams<Params>,
  ): Promise<Data> {
    const { searchParams, ...rest } = params || {};

    try {
      const response = await this.instance.delete<Data>(point, {
        params: searchParams,
        ...rest,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
