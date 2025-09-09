import { z } from 'zod';

export const editProfileSchema = z.object({
  name: z.string().min(1, 'Имя обязательно').max(100, 'Имя слишком длинное'),
});

export type EditProfileFormData = z.infer<typeof editProfileSchema>;
