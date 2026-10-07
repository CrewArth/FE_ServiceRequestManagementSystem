import { ROLES, type Role } from './roles';

export const dashboardPath = (role: Role) => role === ROLES.ADMIN ? '/admin' : '/employee';
