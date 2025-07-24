export interface User {
  id: string
  username: string
  name: string
  email?: string
  role: 'ADMIN' | 'CABELEIREIRO'
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginResponse {
  access_token: string
  user: User
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}