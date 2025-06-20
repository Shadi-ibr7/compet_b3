import { DefaultSession, DefaultUser } from "next-auth"
import { UserRole } from "./common"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: UserRole
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    role: UserRole
    linkPhoto?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: UserRole
    linkPhoto?: string
  }
}
