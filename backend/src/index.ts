import cors from 'cors';
import express from 'express';
import { env, logDbConfig } from './config/env.js';
import { testConnection } from './db/pool.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.routes.js';
import tasksRoutes from './routes/tasks.routes.js';

const app = express();

app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  }),
);
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', tasksRoutes);

app.use(errorHandler);

async function start() {
  logDbConfig();

  try {
    await testConnection();
    console.log('Database connected');
  } catch (error) {
    const err = error as NodeJS.ErrnoException & { code?: string };
    console.error('\nDatabase connection failed.');

    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error(
        '  → Перевірте DB_USER та DB_PASSWORD у файлі backend/.env\n' +
          '  → Якщо .env відсутній: copy backend\\.env.example backend\\.env',
      );
    } else if (err.code === 'ECONNREFUSED') {
      console.error(
        `  → MySQL/MariaDB не запущено або невірний порт (зараз: ${env.db.port})\n` +
          '  → Перевірте DB_PORT у backend/.env (типово 3306 або 3307)',
      );
    } else if (err.code === 'ER_BAD_DB_ERROR') {
      console.error(
        `  → База "${env.db.database}" не існує.\n` +
          '  → Запустіть backend/database/schema.sql у HeidiSQL',
      );
    } else {
      console.error(error);
    }

    process.exit(1);
  }

  app.listen(env.port, () => {
    console.log(`Server running on http://localhost:${env.port}`);
  });
}

start();
