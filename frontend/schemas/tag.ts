import {z} from 'zod'

export const tagSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .max(50, 'El nombre no puede tener más de 50 caracteres'),
  color: z
    .string()
    .regex(/^#([0-9A-F]{3}){1,2}$/i, 'Debe ser un color hexadecimal válido (ej: #FF0000)')
    .optional()
    .or(z.literal(''))
})

export type TagSchemaType = z.infer<typeof tagSchema>