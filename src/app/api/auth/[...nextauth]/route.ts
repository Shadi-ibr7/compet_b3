import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth/credentials-config";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
