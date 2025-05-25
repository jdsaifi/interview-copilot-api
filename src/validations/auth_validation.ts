import { z } from 'zod';

/** login schema */
export const validateLoginSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string()
    })
}); // END
