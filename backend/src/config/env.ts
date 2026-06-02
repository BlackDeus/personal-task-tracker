import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { existsSync } from 'node:fs';

const backendRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');
const envPath = join(backendRoot, '.env');

if (!existsSync(envPath)) {
  console.error(
    '\n[config] Файл backend/.env не знайдено.\n' +
      '       Скопіюйте:  copy backend\\.env.example backend\\.env\n' +
      '       і вкажіть DB_PASSWORD та DB_PORT для вашого MySQL/MariaDB.\n',
  );
} else {
  const result = dotenv.config({ path: envPath });
  if (result.error) {
    console.error('[config] Не вдалося прочитати .env:', result.error.message);
  }
}

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  port: parseInt(process.env.PORT ?? '3001', 10),
  db: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '3306', 10),
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? 'task_tracker',
  },
  jwt: {
    secret: required('JWT_SECRET', 'dev-secret-change-in-production'),
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  },
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
};

export function logDbConfig(): void {
  console.log(
    `[config] DB ${env.db.user}@${env.db.host}:${env.db.port}/${env.db.database}` +
      (env.db.password ? ' (password set)' : ' (password NOT set)'),
  );
}
