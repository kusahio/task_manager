import { email, z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, {message: 'El email es obligatorio'})
    .email({message: 'El formato del email es inválido'}),
  password: z
    .string()
    .min(6, {message: 'El password debe tener al menos 6 caracteres'})
})

export type LoginSchemaType = z.infer<typeof loginSchema>