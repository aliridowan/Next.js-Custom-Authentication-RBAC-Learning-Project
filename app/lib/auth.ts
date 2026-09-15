import bcrypt from "bcryptjs"
import { prisma } from "./db"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { User } from "../api/types"
import { Role } from "../api/types"

const JWT_SECRET = process.env.JWT_SECRET!

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 12)
}

export const verifypassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword)
}

export const genareteToken = (userId: string): string => {

  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" })
}

export const vefifyToken = (token: string): { userId: string } => {

  return jwt.verify(token, JWT_SECRET) as { userId: string }
}

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const cookiesStore = await cookies();
    const token = cookiesStore.get("token")?.value;
    if (!token) return null

    const decode = vefifyToken(token)

    const userFromdb = await prisma.user.findUnique({ where: { id: decode.userId } })
    if (!userFromdb) return null

    const { password, ...user } = userFromdb;

    return user as User

  } catch (error) {
    console.log("Error", error)
    return null
  }
}

export const checkUserPermission = (user: User, requiredRole: Role): boolean => {
  const roleHierarchy = {
    [Role.GUEST]: 0,
    [Role.USER]: 1,
    [Role.MANAGER]: 2,
    [Role.ADMIN]: 3,
  };

  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
}



