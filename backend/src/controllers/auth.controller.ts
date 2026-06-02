import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { type SignOptions } from 'jsonwebtoken';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { env } from '../config/env.js';
import { pool } from '../db/pool.js';
import type { UserRow } from '../types/index.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SALT_ROUNDS = 12;

interface UserIdRow extends RowDataPacket {
  id: number;
}

function signToken(userId: number, email: string): string {
  const options: SignOptions = { expiresIn: env.jwt.expiresIn as SignOptions['expiresIn'] };
  return jwt.sign({ userId, email }, env.jwt.secret, options);
}

function publicUser(user: UserRow) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.created_at,
  };
}

export async function register(req: Request, res: Response): Promise<void> {
  const { username, email, password } = req.body as {
    username?: string;
    email?: string;
    password?: string;
  };

  if (!username?.trim() || !email?.trim() || !password) {
    res.status(400).json({ error: 'Ім\'я, email та пароль обов\'язкові' });
    return;
  }

  if (username.trim().length < 2 || username.trim().length > 100) {
    res.status(400).json({ error: 'Ім\'я має бути від 2 до 100 символів' });
    return;
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    res.status(400).json({ error: 'Невалідний формат email' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ error: 'Пароль має бути щонайменше 6 символів' });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();

  const [existing] = await pool.execute<UserIdRow[]>(
    'SELECT id FROM users WHERE email = ? LIMIT 1',
    [normalizedEmail],
  );

  if (existing.length > 0) {
    res.status(409).json({ error: 'Користувач з таким email вже існує' });
    return;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const [result] = await pool.execute<ResultSetHeader>(
    'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
    [username.trim(), normalizedEmail, passwordHash],
  );

  const userId = result.insertId;

  const [rows] = await pool.execute<(UserRow & RowDataPacket)[]>(
    'SELECT id, username, email, password_hash, created_at FROM users WHERE id = ?',
    [userId],
  );

  const user = rows[0];
  const token = signToken(user.id, user.email);

  res.status(201).json({
    token,
    user: publicUser(user),
  });
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email?.trim() || !password) {
    res.status(400).json({ error: 'Email та пароль обов\'язкові' });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();

  const [rows] = await pool.execute<(UserRow & RowDataPacket)[]>(
    'SELECT id, username, email, password_hash, created_at FROM users WHERE email = ? LIMIT 1',
    [normalizedEmail],
  );

  if (rows.length === 0) {
    res.status(401).json({ error: 'Невірний email або пароль' });
    return;
  }

  const user = rows[0];
  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid) {
    res.status(401).json({ error: 'Невірний email або пароль' });
    return;
  }

  const token = signToken(user.id, user.email);

  res.json({
    token,
    user: publicUser(user),
  });
}

export function logout(_req: Request, res: Response): void {
  res.json({ message: 'Успішний вихід' });
}

export async function getMe(req: Request, res: Response): Promise<void> {
  const userId = req.user!.userId;

  const [rows] = await pool.execute<(UserRow & RowDataPacket)[]>(
    'SELECT id, username, email, password_hash, created_at FROM users WHERE id = ? LIMIT 1',
    [userId],
  );

  if (rows.length === 0) {
    res.status(404).json({ error: 'Користувача не знайдено' });
    return;
  }

  res.json({ user: publicUser(rows[0]) });
}
