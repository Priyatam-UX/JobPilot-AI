const BASE_URL = 'https://jobpilot-backend-l4o2.onrender.com/api/v1';
console.log("Using API BASE_URL:", BASE_URL);



export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('token');
  const headers = new Headers(options.headers || {});

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Session expired
    localStorage.clear();
    window.location.href = '/login';
    throw new Error('Unauthorized session expired');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'An error occurred during API request');
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
