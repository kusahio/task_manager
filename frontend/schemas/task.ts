import z from 'zod';

export const taskSchema = z.object({
  title: z.string().trim().min(1, 'El título es obligatorio'),
  description: z.string().trim().optional(),
  tags: z.array(z.number()).optional(),
  deadline: z.string().optional(),  
})

export type TaskSchema = z.infer<typeof taskSchema>