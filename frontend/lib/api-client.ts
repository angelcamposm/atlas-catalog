/**
 * API Client for Atlas Catalog Backend
 * 
 * Centralized API client using fetch with proper error handling
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const API_TIMEOUT = Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 30000;

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestOptions extends RequestInit {
  timeout?: number;
}

/**
 * Base fetch wrapper with timeout and error handling
 */
async function fetchWithTimeout(url: string, options: RequestOptions = {}): Promise<Response> {
  const { timeout = API_TIMEOUT, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...fetchOptions.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP Error ${response.status}`,
        response.status,
        errorData
      );
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Request timeout', 408);
    }
    
    throw new ApiError('Network error', 0, error);
  }
}

/**
 * GET request
 */
export async function get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
  const response = await fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    ...options,
  });
  return response.json();
}

/**
 * POST request
 */
export async function post<T>(
  endpoint: string,
  data?: unknown,
  options?: RequestOptions
): Promise<T> {
  const response = await fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  });
  return response.json();
}

/**
 * PUT request
 */
export async function put<T>(
  endpoint: string,
  data?: unknown,
  options?: RequestOptions
): Promise<T> {
  const response = await fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options,
  });
  return response.json();
}

/**
 * DELETE request
 */
export async function del(endpoint: string, options?: RequestOptions): Promise<void> {
  await fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
    method: 'DELETE',
    ...options,
  });
}

/**
 * API Client object with resource-specific methods
 */
export const apiClient = {
  // Generic methods
  get,
  post,
  put,
  delete: del,

  // Helper to build query params
  buildQuery(params: Record<string, string | number | boolean | undefined>): string {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query.append(key, String(value));
      }
    });
    const queryString = query.toString();
    return queryString ? `?${queryString}` : '';
  },
};

export default apiClient;
