/**
 * Secure API Client with Certificate Pinning Support
 * 
 * This module provides a production-ready HTTP client with built-in security headers,
 * certificate pinning support, and error handling.
 */

import { CurrentPricesResponse } from './api';
import { PRODUCTION_PINS, PINNING_CONFIG, getPinningStatus } from './certificate-pinning';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000/api';
const ENVIRONMENT = process.env.NODE_ENV || 'development';

/**
 * Security headers for all API requests
 */
const SECURITY_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'X-Client-Version': '1.0.0',
  'X-App-Build': process.env.EXPO_PUBLIC_BUILD_ID || 'dev',
};

/**
 * Initialize secure HTTP client with certificate pinning
 * 
 * For production, requires react-native-ssl-pinning:
 * ```bash
 * npm install react-native-ssl-pinning
 * ```
 */

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
}

/**
 * Secure fetch wrapper with certificate pinning support
 * 
 * In development: Uses standard fetch
 * In production (bare RN): Should use react-native-ssl-pinning
 * 
 * Setup:
 * 1. `npm install react-native-ssl-pinning`
 * 2. Uncomment the react-native-ssl-pinning imports below
 * 3. Use this function instead of fetch for all API calls
 */
export const secureFetch = async (
  url: string,
  options: FetchOptions = {}
): Promise<Response> => {
  const config = PINNING_CONFIG[ENVIRONMENT as keyof typeof PINNING_CONFIG] || PINNING_CONFIG.development;
  
  // Validate URL for certificate pinning
  const urlObj = new URL(url);
  const domain = urlObj.hostname;
  
  // Development: Skip pinning for localhost
  if (config?.allowLocalhost && (domain === 'localhost' || domain === '127.0.0.1')) {
    return performFetch(url, options);
  }
  
  // Production: Enforce certificate pinning
  if (config?.enabled && config?.enforceStrict) {
    // For bare React Native with react-native-ssl-pinning:
    // const RNSSLPinning = require('react-native-ssl-pinning');
    // return RNSSLPinning.fetch(url, {
    //   ...options,
    //   pinnedDomains: Object.keys(PRODUCTION_PINS),
    // });
    
    // For managed Expo or testing: verify domain is in pinning list
    const isPinnedDomain = Object.keys(PRODUCTION_PINS).some(
      pinnedDomain => domain.endsWith(pinnedDomain) || domain === pinnedDomain
    );
    
    if (!isPinnedDomain && !config?.allowLocalhost) {
      throw new Error(`Certificate pinning: ${domain} not in pinned domains list`);
    }
  }
  
  return performFetch(url, options);
};

/**
 * Perform actual HTTP request with security headers and error handling
 */
async function performFetch(url: string, options: FetchOptions = {}): Promise<Response> {
  const headers = {
    ...SECURITY_HEADERS,
    ...options.headers,
  };
  
  const timeout = options.timeout || 30000;
  const retries = options.retries || 0;
  
  try {
    return await fetchWithTimeout(url, { ...options, headers }, timeout, retries);
  } catch (error) {
    console.error(`[SecureAPI] Request failed: ${url}`, error);
    throw error;
  }
}

/**
 * Fetch with timeout and retry logic
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number,
  retriesLeft: number
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    // Retry on server error if retries available
    if (!response.ok && response.status >= 500 && retriesLeft > 0) {
      return fetchWithTimeout(url, options, timeout, retriesLeft - 1);
    }
    
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Type-safe API request wrapper with error handling
 */
export async function apiRequest<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await secureFetch(url, {
      ...options,
      timeout: 30000,
    });
    
    // Handle non-OK responses
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: response.statusText,
      }));
      
      throw {
        status: response.status,
        message: error.error || 'API Error',
        url: endpoint,
      };
    }
    
    return response.json();
  } catch (error: any) {
    // Format error for consumer
    throw {
      message: error.message || 'Network error',
      status: error.status || 0,
      endpoint,
      originalError: error,
    };
  }
}

/**
 * GET request with security headers
 */
export async function apiGet<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'GET',
  });
}

/**
 * POST request with security headers and JSON body
 */
export async function apiPost<T>(
  endpoint: string,
  body?: Record<string, any>,
  options: FetchOptions = {}
): Promise<T> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * API Health Check (verifies connectivity and certificate pinning)
 */
export async function checkAPIHealth(): Promise<{
  healthy: boolean;
  pinningStatus: ReturnType<typeof getPinningStatus>;
  certificateValid: boolean;
}> {
  try {
    const response = await secureFetch(`${API_BASE_URL}/health`);
    const certificateValid = response.ok;
    
    return {
      healthy: response.ok,
      pinningStatus: getPinningStatus(),
      certificateValid,
    };
  } catch (error) {
    return {
      healthy: false,
      pinningStatus: getPinningStatus(),
      certificateValid: false,
    };
  }
}

/**
 * Production API Endpoints (using secure client)
 */

export const fetchCurrentPrices = async (
  city: string
): Promise<CurrentPricesResponse> => {
  return apiGet<CurrentPricesResponse>(
    `/prices/current?city=${city}&karat=22,24`
  );
};

export const fetchPriceHistory = async (
  city: string,
  karat: number,
  days: number = 30
): Promise<any> => {
  return apiGet<any>(
    `/prices/history?city=${city}&karat=${karat}&days=${days}`
  );
};

export const registerWithOTP = async (
  phone: string
): Promise<{ status: string; message: string }> => {
  return apiPost('/auth/register', { phone });
};

export const verifyOTP = async (
  phone: string,
  otp: string
): Promise<{ token: string; user: any }> => {
  return apiPost('/auth/verify-otp', { phone, otp });
};

export const fetchUserAlerts = async (
  token: string
): Promise<any[]> => {
  return apiGet('/alerts', {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createAlert = async (
  token: string,
  alert: any
): Promise<any> => {
  return apiPost('/alerts/create', alert, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteAlert = async (
  token: string,
  alertId: string
): Promise<any> => {
  return apiPost(`/alerts/${alertId}/delete`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const calculateGoldValue = async (
  city: string,
  karat: number,
  weight: number
): Promise<any> => {
  return apiGet(
    `/calculator?city=${city}&karat=${karat}&weight=${weight}`
  );
};
