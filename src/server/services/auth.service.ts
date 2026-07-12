import { userRepository } from "@/server/repositories/user.repository";
import { verifyPassword } from "@/server/lib/password";
import { signAccessToken, signRefreshToken } from "@/server/lib/jwt";
import { UnauthorizedError } from "@/server/lib/errors";
import type { LoginInput } from "@/server/dto/auth.dto";
import type { User } from "@prisma/client";

export type PublicUser = Omit<User, "passwordHash">;

function toPublicUser(user: User): PublicUser {
  const { passwordHash: _passwordHash, ...publicUser } = user;
  return publicUser;
}

export const authService = {
  async login(input: LoginInput) {
    const user = await userRepository.findByEmail(input.email);

    // Same error for "no such user" and "wrong password" — don't leak which
    // one it was, so credential stuffing can't enumerate valid emails.
    if (!user || !user.isActive) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const passwordValid = await verifyPassword(input.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken({ sub: user.id, role: user.role, email: user.email, name: user.name }),
      signRefreshToken(user.id),
    ]);

    return { user: toPublicUser(user), accessToken, refreshToken };
  },

  async refreshAccessToken(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedError("Session no longer valid");
    }
    const accessToken = await signAccessToken({
      sub: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
    });
    return { user: toPublicUser(user), accessToken };
  },

  async getCurrentUser(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user || !user.isActive) throw new UnauthorizedError();
    return toPublicUser(user);
  },
};
