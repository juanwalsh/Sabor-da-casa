/**
 * Testes do Cliente HTTP Resiliente
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  resilientFetch,
  api,
  FetchError,
  CircuitOpenError,
  getCircuitState,
  recordFailure,
  recordSuccess,
} from '@/lib/fetch-client';

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('resilientFetch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    // Reset circuit breaker state
    recordSuccess('test-endpoint');
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('basic functionality', () => {
    it('should fetch successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ data: 'test' }),
      });

      const result = await resilientFetch('/api/test');

      expect(result).toEqual({ data: 'test' });
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should return text for non-JSON responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'text/plain' }),
        text: async () => 'plain text response',
      });

      const result = await resilientFetch('/api/test');

      expect(result).toBe('plain text response');
    });
  });

  describe('retry logic', () => {
    it('should retry on 5xx errors', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
        })
        .mockResolvedValueOnce({
          ok: true,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => ({ success: true }),
        });

      const resultPromise = resilientFetch('/api/test', { retries: 2, retryDelay: 100 });

      // Avança o timer para o retry
      await vi.advanceTimersByTimeAsync(100);

      const result = await resultPromise;

      expect(result).toEqual({ success: true });
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should not retry on 4xx errors (except 429)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(
        resilientFetch('/api/test', { retries: 3 })
      ).rejects.toThrow(FetchError);

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should retry on 429 (rate limit)', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 429,
          statusText: 'Too Many Requests',
        })
        .mockResolvedValueOnce({
          ok: true,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => ({ success: true }),
        });

      const resultPromise = resilientFetch('/api/test', { retries: 2, retryDelay: 100 });
      await vi.advanceTimersByTimeAsync(100);
      const result = await resultPromise;

      expect(result).toEqual({ success: true });
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should use exponential backoff', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: false, status: 500, statusText: 'Error' })
        .mockResolvedValueOnce({ ok: false, status: 500, statusText: 'Error' })
        .mockResolvedValueOnce({
          ok: true,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => ({ success: true }),
        });

      const resultPromise = resilientFetch('/api/test', {
        retries: 3,
        retryDelay: 1000,
      });

      // First retry: 1000ms
      await vi.advanceTimersByTimeAsync(1000);
      // Second retry: 2000ms (exponential)
      await vi.advanceTimersByTimeAsync(2000);

      const result = await resultPromise;
      expect(result).toEqual({ success: true });
    });
  });

  describe('timeout', () => {
    it('should timeout after specified duration', async () => {
      // Este teste usa timers reais por causa do AbortController
      vi.useRealTimers();

      // Cria um novo mock que demora mais do que o timeout
      const slowMock = vi.fn().mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 5000))
      );
      global.fetch = slowMock;

      await expect(
        resilientFetch('/api/test', {
          timeout: 100,
          retries: 0,
        })
      ).rejects.toThrow(); // Qualquer erro é aceitável

      // Restaura o mock original
      global.fetch = mockFetch;
      vi.useFakeTimers();
    }, 10000);
  });

  describe('circuit breaker', () => {
    it('should open circuit after multiple failures', async () => {
      const key = '/api/circuit-test';

      // Simula 5 falhas
      for (let i = 0; i < 5; i++) {
        recordFailure(key);
      }

      const state = getCircuitState(key);
      expect(state.isOpen).toBe(true);
    });

    it('should throw CircuitOpenError when circuit is open', async () => {
      const key = '/api/circuit-open';

      // Abre o circuit
      for (let i = 0; i < 5; i++) {
        recordFailure(key);
      }

      await expect(
        resilientFetch('http://localhost/api/circuit-open', {
          circuitBreakerKey: key,
        })
      ).rejects.toThrow(CircuitOpenError);

      // fetch não deve ser chamado
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should reset circuit after success', () => {
      const key = '/api/reset-test';

      // Simula falhas (mas não o suficiente para abrir)
      recordFailure(key);
      recordFailure(key);

      // Sucesso deve resetar
      recordSuccess(key);

      const state = getCircuitState(key);
      expect(state.failures).toBe(0);
      expect(state.isOpen).toBe(false);
    });
  });
});

describe('api helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ success: true }),
    });
  });

  it('api.get should make GET request', async () => {
    await api.get('/api/test');

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/test',
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('api.post should make POST request with JSON body', async () => {
    await api.post('/api/test', { data: 'test' });

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/test',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        body: '{"data":"test"}',
      })
    );
  });

  it('api.put should make PUT request', async () => {
    await api.put('/api/test', { id: 1, data: 'updated' });

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/test',
      expect.objectContaining({
        method: 'PUT',
        body: '{"id":1,"data":"updated"}',
      })
    );
  });

  it('api.delete should make DELETE request', async () => {
    await api.delete('/api/test');

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/test',
      expect.objectContaining({ method: 'DELETE' })
    );
  });
});
