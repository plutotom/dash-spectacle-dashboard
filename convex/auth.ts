import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      profile(params) {
        return {
          email: params.email as string,
          name: params.name as string,
          // New users default to "user" role
          // First user or manually promoted users become "admin"
          role: "user",
        };
      },
    }),
    GitHub({
      profile(profile) {
        return {
          email: profile.email,
          name: profile.name || profile.login,
          role: "user",
        };
      },
    }),
    Google({
      profile(profile) {
        return {
          email: profile.email,
          name: profile.name,
          role: "user",
        };
      },
    }),
  ],
});
