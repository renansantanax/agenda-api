import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

export function validate(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      return res
        .status(400)
        .json({ errors: z.flattenError(parsed.error).fieldErrors });
    }

    req.body = parsed.data;
    next();
  };
}
