import { z } from 'zod';

export const envSchema = z.object({
  // Application
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),

  // Database
  POSTGRES_DB: z.string().min(1, 'POSTGRES_DB is required'),
  POSTGRES_USER: z.string().min(1, 'POSTGRES_USER is required'),
  POSTGRES_PASSWORD: z.string().min(1, 'POSTGRES_PASSWORD is required'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  // Optional API Port for Host (used in test environment)
  API_PORT_HOST: z.coerce.number().optional(),
});

export type Environment = z.infer<typeof envSchema>;

export function validate(config: Record<string, unknown>) {
  try {
    return envSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join(', ');
      throw new Error(`Environment validation failed: ${errors}`);
    }
    throw error;
  }
}
