// API configuration for Laravel Sanctum
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

interface ApiOptions extends RequestInit {
  includeAuth?: boolean;
}

/**
 * Make an authenticated API request with Laravel Sanctum token
 * @param endpoint - API endpoint (e.g., '/api/auth/login')
 * @param options - Fetch options
 * @returns Promise with response data
 */
export async function apiCall<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const { includeAuth = true, ...fetchOptions } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...fetchOptions.headers,
  };

  // Add authorization token if needed
  if (includeAuth) {
    const token = localStorage.getItem("accessToken");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  // Handle 401 Unauthorized - token might be expired
  if (response.status === 401) {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
    throw new Error("Unauthorized. Please login again.");
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || `API Error: ${response.status}`
    );
  }

  return data;
}

/**
 * Make a public API request (no authentication)
 */
export async function publicApiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  return apiCall<T>(endpoint, { ...options, includeAuth: false });
}

/**
 * Make a protected API request (requires authentication)
 */
export async function protectedApiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  return apiCall<T>(endpoint, { ...options, includeAuth: true });
}
