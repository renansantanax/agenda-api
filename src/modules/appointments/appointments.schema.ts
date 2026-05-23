import z from "zod";

export const createAppointmentSchema = z.object({
  date: z.coerce.date(),
  description: z.string().optional(),
  status: z.enum(["PENDING", "DONE", "CANCELLED"], {
    message: "Status inválido.",
  }),
  userId: z.uuid(),
  clientId: z.number().int().positive("clientId deve ser um número positivo"),
});

export const updateAppointmentSchema = z
  .object({
    date: z.coerce.date().optional(),
    description: z.string().optional(),
    status: z
      .enum(["PENDING", "DONE", "CANCELLED"], {
        message: "Status inválido.",
      })
      .optional(),
  })
  .refine((data) => data.date || data.description || data.status, {
    message: "Informe pelo menos um campo para atualizar",
  });

export type CreateAppointmentDTO = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentDTO = z.infer<typeof updateAppointmentSchema>;
