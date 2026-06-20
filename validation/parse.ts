import type { ZodSchema } from 'zod';

export function validar<T>(
  schema: ZodSchema<T>,
  data: unknown
): { ok: true; data: T } | { ok: false; message: string } {
  const result = schema.safeParse(data);
  if (!result.success) {
    return { ok: false, message: result.error.issues[0]?.message ?? 'Dados invalidos.' };
  }
  return { ok: true, data: result.data };
}
