import {
  NetworkClient,
  NetworkResponse,
  NetworkRequestOptions,
  Optional,
} from '@sudobility/types';
import { getFirebaseAuth } from '@sudobility/auth_lib';

/**
 * Authenticated Network Client
 * Adds Firebase auth token to all requests
 */
export class AuthenticatedNetworkClient implements NetworkClient {
  async get<T = unknown>(
    url: string,
    options?: Optional<Omit<NetworkRequestOptions, 'method' | 'body'>>
  ): Promise<NetworkResponse<T>> {
    return this.request<T>(url, { ...options, method: 'GET' });
  }

  async post<T = unknown>(
    url: string,
    body?: Optional<unknown>,
    options?: Optional<Omit<NetworkRequestOptions, 'method'>>
  ): Promise<NetworkResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: 'POST',
      body: typeof body === 'string' ? body : JSON.stringify(body),
    });
  }

  async put<T = unknown>(
    url: string,
    body?: Optional<unknown>,
    options?: Optional<Omit<NetworkRequestOptions, 'method'>>
  ): Promise<NetworkResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: 'PUT',
      body: typeof body === 'string' ? body : JSON.stringify(body),
    });
  }

  async delete<T = unknown>(
    url: string,
    options?: Optional<Omit<NetworkRequestOptions, 'method' | 'body'>>
  ): Promise<NetworkResponse<T>> {
    return this.request<T>(url, { ...options, method: 'DELETE' });
  }

  async request<T = unknown>(
    url: string,
    options?: Optional<NetworkRequestOptions>
  ): Promise<NetworkResponse<T>> {
    try {
      // Get Firebase auth token if user is logged in
      const auth = getFirebaseAuth();
      const user = auth?.currentUser;
      let token: string | undefined;

      if (user) {
        try {
          token = await user.getIdToken();
        } catch (error) {
          console.error('Error getting Firebase token:', error);
        }
      }

      // Build headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      };

      // Add auth token if available
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Make request
      const response = await fetch(url, {
        method: options?.method || 'GET',
        headers,
        body: options?.body,
        signal: options?.signal,
      });

      // Parse response headers
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      // Parse response
      let data: T | undefined;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      }

      return {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        data,
        success: response.ok,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Network request error:', error);
      return {
        ok: false,
        status: 0,
        statusText: 'Network Error',
        headers: {},
        success: false,
        timestamp: new Date().toISOString(),
        error: (error as Error).message,
      };
    }
  }
}

// Export singleton instance
export const authenticatedNetworkClient = new AuthenticatedNetworkClient();
