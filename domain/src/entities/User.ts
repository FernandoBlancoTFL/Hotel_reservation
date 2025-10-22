import { Email } from '../value-objects/Email';

export enum UserRole {
  GUEST = 'GUEST',
  RECEPTIONIST = 'RECEPTIONIST',
  ADMIN = 'ADMIN'
}

type Permission = 
  | 'CREATE_ROOM' 
  | 'UPDATE_ROOM' 
  | 'DELETE_ROOM' 
  | 'VIEW_ALL_ROOMS'
  | 'CREATE_RESERVATION' 
  | 'CANCEL_OWN_RESERVATION'
  | 'CANCEL_ANY_RESERVATION'
  | 'VIEW_OWN_RESERVATIONS'
  | 'VIEW_ALL_RESERVATIONS'
  | 'CHECK_IN'
  | 'CHECK_OUT'
  | 'MANAGE_USERS';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    'CREATE_ROOM',
    'UPDATE_ROOM',
    'DELETE_ROOM',
    'VIEW_ALL_ROOMS',
    'CREATE_RESERVATION',
    'CANCEL_OWN_RESERVATION',
    'CANCEL_ANY_RESERVATION',
    'VIEW_OWN_RESERVATIONS',
    'VIEW_ALL_RESERVATIONS',
    'CHECK_IN',
    'CHECK_OUT',
    'MANAGE_USERS'
  ],
  [UserRole.RECEPTIONIST]: [
    'CREATE_ROOM',
    'UPDATE_ROOM',
    'VIEW_ALL_ROOMS',
    'CREATE_RESERVATION',
    'CANCEL_ANY_RESERVATION',
    'VIEW_ALL_RESERVATIONS',
    'CHECK_IN',
    'CHECK_OUT'
  ],
  [UserRole.GUEST]: [
    'CREATE_RESERVATION',
    'CANCEL_OWN_RESERVATION',
    'VIEW_OWN_RESERVATIONS'
  ]
};

export class User {
  private _id: string;
  private _email: Email;
  private _passwordHash: string;
  private _name: string;
  private _phone: string;
  private _documentId: string;
  private _role: UserRole;
  private _createdAt: Date;

  constructor(
    id: string,
    email: Email,
    passwordHash: string,
    name: string,
    phone: string,
    documentId: string,
    role: UserRole
  ) {
    if (!name || name.trim() === '') {
      throw new Error('Name cannot be empty');
    }

    if (!passwordHash || passwordHash.trim() === '') {
      throw new Error('Password hash cannot be empty');
    }

    this._id = id;
    this._email = email;
    this._passwordHash = passwordHash;
    this._name = name.trim();
    this._phone = phone;
    this._documentId = documentId;
    this._role = role;
    this._createdAt = new Date();
  }

  get id(): string {
    return this._id;
  }

  get email(): Email {
    return this._email;
  }

  get passwordHash(): string {
    return this._passwordHash;
  }

  get name(): string {
    return this._name;
  }

  get phone(): string {
    return this._phone;
  }

  get documentId(): string {
    return this._documentId;
  }

  get role(): UserRole {
    return this._role;
  }

  get createdAt(): Date {
    return new Date(this._createdAt);
  }

  hasRole(role: UserRole): boolean {
    return this._role === role;
  }

  can(permission: Permission): boolean {
    return ROLE_PERMISSIONS[this._role].includes(permission);
  }

  updateProfile(name: string, phone: string): void {
    if (!name || name.trim() === '') {
      throw new Error('Name cannot be empty');
    }
    this._name = name.trim();
    this._phone = phone;
  }

  changePassword(newPasswordHash: string): void {
    if (!newPasswordHash || newPasswordHash.trim() === '') {
      throw new Error('Password hash cannot be empty');
    }
    this._passwordHash = newPasswordHash;
  }
}