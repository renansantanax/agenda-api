import z from "zod";

export const createClientSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  phone: z.string().regex(/^\d{3}9\d{8}$/, {
    message:
      "O celular deve ter o DDD com 3 dígitos seguido de 9 e mais 8 números",
  }),
});

export const updateClientSchema = z
  .object({
    name: z
      .string()
      .min(2, "Nome precisa ter pelo menos 2 caracteres")
      .optional(),
    phone: z
      .string()
      .regex(/^\d{3}9\d{8}$/, {
        message:
          "O celular deve ter o DDD com 3 dígitos seguido de 9 e mais 8 números",
      })
      .optional(),
  })
  .refine((data) => data.name || data.phone, {
    message: "Informe pelo menos um campo para atualizar",
  });

export type UpdateClientDto = z.infer<typeof updateClientSchema>;
export type CreateClientDto = z.infer<typeof createClientSchema>;
