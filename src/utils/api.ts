import type { AuthResponse, Meta, RequestFields, ServiceRequest, Summary, User } from '../common/types/api.types';

const tokenKey = 'service-request-token';
export const session = {
  get: () => sessionStorage.getItem(tokenKey),
  set: (token: string) => sessionStorage.setItem(tokenKey, token),
  clear: () => sessionStorage.removeItem(tokenKey),
};

async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(session.get() ? { Authorization: `Bearer ${session.get()}` } : {}),
      ...init.headers,
    },
  });
  if (response.status === 204) return undefined as T;
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || `Request failed (${response.status})`);
  return body as T;
}

export const authApi = {
  login: (email: string, password: string) => api<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (name: string, email: string, password: string) => api<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
  me: () => api<User>('/auth/me'),
};

export const requestsApi = {
  meta: () => api<Meta>('/meta'),
  list: (filters: { status?: string; priority?: string }) => {
    const query = new URLSearchParams();
    if (filters.status) query.set('status', filters.status);
    if (filters.priority) query.set('priority', filters.priority);
    return api<ServiceRequest[]>(`/requests${query.size ? `?${query}` : ''}`);
  },
  get: (id: string) => api<ServiceRequest>(`/requests/${id}`),
  create: (fields: RequestFields) => api<ServiceRequest>('/requests', { method: 'POST', body: JSON.stringify(fields) }),
  update: (id: string, fields: RequestFields) => api<ServiceRequest>(`/requests/${id}`, { method: 'PATCH', body: JSON.stringify(fields) }),
  status: (id: string, status: string) => api<ServiceRequest>(`/requests/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  remove: (id: string) => api<void>(`/requests/${id}`, { method: 'DELETE' }),
  summary: () => api<Summary>('/dashboard/summary'),
};
