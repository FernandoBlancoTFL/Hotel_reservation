export type UserRole = 'GUEST' | 'RECEPTIONIST' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  documentId?: string;
}