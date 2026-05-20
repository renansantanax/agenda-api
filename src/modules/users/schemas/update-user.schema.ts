// users/schemas/update-user.schema.ts
import { z } from "zod";

export const updateUserSchema = z
  .object({
    name: z
      .string()
      .min(2, "Nome precisa ter pelo menos 2 caracteres")
      .optional(),
    email: z.email("Email inválido").optional(),
    password: z
      .string()
      .min(6, "Senha precisa ter pelo menos 6 caracteres")
      .optional(),
  })
  .refine((data) => data.name || data.email || data.password, {
    message: "Informe pelo menos um campo para atualizar",
  });

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
