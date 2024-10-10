import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpService } from './http-client';
import type {
  Headers,
  HttpClient,
  InitParams,
  MethodParams,
  SearchParams,
} from './types';

const createMockHttpClient = (): HttpClient => ({
  addHeaders: vi.fn(),
  init: vi.fn(),
  delete: vi.fn().mockResolvedValue(undefined),
  get: vi.fn().mockResolvedValue(undefined),
  patch: vi.fn().mockResolvedValue(undefined),
  post: vi.fn().mockResolvedValue(undefined),
  put: vi.fn().mockResolvedValue(undefined),
});

describe('HttpService', () => {
  let mockAdapter: HttpClient;
  let httpService: HttpService;

  beforeEach(() => {
    mockAdapter = createMockHttpClient();
    httpService = new HttpService(mockAdapter);
  });

  it('should call addHeaders on the adapter', () => {
    const headers: Headers = { Authorization: 'Bearer token' };

    httpService.addHeaders(headers);
    expect(mockAdapter.addHeaders).toHaveBeenCalledWith(headers);
  });

  it('should call init on the adapter', () => {
    const initParams: InitParams = { baseURL: 'https://api.example.com' };

    httpService.init(initParams);
    expect(mockAdapter.init).toHaveBeenCalledWith(initParams);
  });

  it('should call delete on the adapter with correct params and return data', async () => {
    const point = '/resource/123';
    const params: MethodParams<SearchParams> = {
      searchParams: { force: 'true' },
    };
    const mockData = { success: true };

    mockAdapter.delete = vi.fn().mockResolvedValue(mockData);

    const result = await httpService.delete(point, params);

    expect(mockAdapter.delete).toHaveBeenCalledWith(point, params);
    expect(result).toEqual(mockData);
  });

  it('should call get on the adapter with correct params and handle error', async () => {
    const point = '/resource/123';
    const params: MethodParams<SearchParams> = {
      searchParams: { expand: 'details' },
    };
    const errorMessage = 'Network Error';

    mockAdapter.get = vi.fn().mockRejectedValue(new Error(errorMessage));
    await expect(httpService.get(point, params)).rejects.toThrow(errorMessage);
    expect(mockAdapter.get).toHaveBeenCalledWith(point, params);
  });

  it('should call patch on the adapter and return data', async () => {
    const point = '/resource/123';
    const body = { name: 'updated name' };
    const params: MethodParams<SearchParams> = {
      searchParams: { partial: 'true' },
    };
    const mockData = { success: true };

    mockAdapter.patch = vi.fn().mockResolvedValue(mockData);

    const result = await httpService.patch(point, body, params);

    expect(mockAdapter.patch).toHaveBeenCalledWith(point, body, params);
    expect(result).toEqual(mockData);
  });

  it('should call post on the adapter with correct params and handle error', async () => {
    const point = '/resource';
    const body = { name: 'new resource' };
    const params: MethodParams<SearchParams> = {
      searchParams: { async: 'true' },
    };
    const errorMessage = 'Internal Server Error';

    mockAdapter.post = vi.fn().mockRejectedValue(new Error(errorMessage));

    await expect(httpService.post(point, body, params)).rejects.toThrow(
      errorMessage,
    );

    expect(mockAdapter.post).toHaveBeenCalledWith(point, body, params);
  });

  it('should call put on the adapter and return data', async () => {
    const point = '/resource/123';
    const body = { name: 'updated resource' };
    const params: MethodParams<SearchParams> = {
      searchParams: { overwrite: 'true' },
    };
    const mockData = { success: true };

    mockAdapter.put = vi.fn().mockResolvedValue(mockData);

    const result = await httpService.put(point, body, params);

    expect(mockAdapter.put).toHaveBeenCalledWith(point, body, params);
    expect(result).toEqual(mockData);
  });
});
