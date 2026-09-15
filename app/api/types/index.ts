export enum Role {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  USER = "USER",
  GUEST = "GUEST"
}

export interface User {
  id: string,
  name: string,
  email: string,
  // password: string,
  role: Role,
  team?: Team,
  teamId?: string,
  createdAt: Date,
  updatedAt: Date,
}

export interface Team {
  id: string,
  name: string,
  description?: string | null,
  code: string,
  members: User[],
  createdAt: Date,
  updatedAt: Date,
}

export interface AuthConetxtType {
  user: User | null,
  // login: (formData: FormData) => Promise<void>,
  logout: () => void,
  hasPermission: (requiredRole: Role) => boolean

}

export interface UserWithPassword extends User {
  password: string
}
