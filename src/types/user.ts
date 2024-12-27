export type UserRole = 'super_admin' | 'admin' | 'manager' | 'user'

export interface SystemUser {
  id: string
  name: string
  email: string
  role: UserRole
  status: 'active' | 'inactive'
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserData {
  name: string
  email: string
  password: string
  role: UserRole
  status: 'active' | 'inactive'
} 