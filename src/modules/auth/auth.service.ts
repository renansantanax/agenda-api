import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as usersRepository from "../users/users.repository.js";

async function login(email: string, password: string) {
  const user = await usersRepository.findByEmail(email);

  if (!user) {
    throw new Error("Email ou senha inválidos");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error("Email ou senha inválidos");
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: (process.env.JWT_EXPIRES_IN ?? "1d") as any },
  );

  return { token };
}

export { login };
