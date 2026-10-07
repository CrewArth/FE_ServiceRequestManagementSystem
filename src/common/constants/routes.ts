import { ROLES, type Role } from './roles';

const rolePath = (role: Role) => role === ROLES.ADMIN ? '/admin' : '/employee';

export const dashboardPath = (role: Role) => `${rolePath(role)}/dashboard`;
export const requestsPath = (role: Role) => `${rolePath(role)}/requests`;
