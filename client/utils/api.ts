// Laravel API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

interface ApiOptions extends RequestInit {
  auth?: boolean; // Include auth token (default: true)
}

/**
 * Simple API call wrapper for Laravel backend
 * Automatically includes Bearer token if available
 */
export async function apiCall<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const { auth = true, ...fetchOptions } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...fetchOptions.headers,
  };

  // Add Bearer token if needed
  if (auth) {
    const token = localStorage.getItem("accessToken");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  // Handle unauthorized
  if (response.status === 401) {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
    throw new Error("Unauthorized. Please login again.");
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Error: ${response.status}`);
  }

  return data;
}

/**
 * Public API call (no auth token needed)
 */
export async function publicApiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  return apiCall<T>(endpoint, { ...options, auth: false });
}

/**
 * Fetch user profile
 */
export async function fetchProfile<T>(): Promise<T> {
  return apiCall<T>("/api/profile");
}

/**
 * Save/Update user profile
 */
export async function saveProfile<T>(
  data: Record<string, unknown>
): Promise<T> {
  return apiCall<T>("/api/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
