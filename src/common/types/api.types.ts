import type { Role } from '../constants/roles';

export type User = { id: string; name: string; email: string; role: Role };
export type AuthResponse = { token: string; user: User };
export type ServiceRequest = {
  id: string; title: string; description: string; category: string; priority: string;
  status: string; overdue: boolean; ownerId: string; owner: Pick<User, 'id' | 'name' | 'email'>;
  createdAt: string; updatedAt: string;
};
export type RequestFields = { title: string; description: string; category: string; priority: string };
export type Meta = { categories: string[]; priorities: string[]; statuses: string[] };
export type Summary = {
  total: number; open: number; inProgress: number; resolved: number;
  highPriority: number; overdue: number; lastOverdueCheck: string | null;
};
