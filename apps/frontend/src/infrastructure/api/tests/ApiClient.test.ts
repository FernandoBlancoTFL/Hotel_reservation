import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { ApiClient } from '../ApiClient';

vi.mock('axios');

describe('ApiClient', () => {
  let apiClient: ApiClient;
  const mockAxiosInstance = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(axios.create).mockReturnValue(mockAxiosInstance as any);
    apiClient = new ApiClient('http://localhost:3000/api');
  });

  it('should create axios instance with base URL', () => {
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'http://localhost:3000/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  it('should make GET request', async () => {
    const mockData = { id: '1', name: 'Test' };
    mockAxiosInstance.get.mockResolvedValue({ data: mockData });

    const result = await apiClient.get('/test');

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test', undefined);
    expect(result).toEqual(mockData);
  });

  it('should make POST request', async () => {
    const mockData = { id: '1', name: 'Test' };
    const postData = { name: 'Test' };
    mockAxiosInstance.post.mockResolvedValue({ data: mockData });

    const result = await apiClient.post('/test', postData);

    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test', postData, undefined);
    expect(result).toEqual(mockData);
  });

  it('should make PUT request', async () => {
    const mockData = { id: '1', name: 'Updated' };
    const putData = { name: 'Updated' };
    mockAxiosInstance.put.mockResolvedValue({ data: mockData });

    const result = await apiClient.put('/test/1', putData);

    expect(mockAxiosInstance.put).toHaveBeenCalledWith('/test/1', putData, undefined);
    expect(result).toEqual(mockData);
  });

  it('should make DELETE request', async () => {
    mockAxiosInstance.delete.mockResolvedValue({ data: { success: true } });

    const result = await apiClient.delete('/test/1');

    expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/test/1', undefined);
    expect(result).toEqual({ success: true });
  });

  it('should handle request errors', async () => {
    const error = new Error('Network Error');
    mockAxiosInstance.get.mockRejectedValue(error);

    await expect(apiClient.get('/test')).rejects.toThrow('Network Error');
  });
});