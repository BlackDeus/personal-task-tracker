-- =============================================================================
-- Task Tracker — повний SQL-скрипт для HeidiSQL (MySQL / MariaDB)
-- =============================================================================
--
-- ЯК ЗАПУСТИТИ В HEIDISQL:
--   1. Підключіться до MySQL/MariaDB (File → New session)
--   2. Меню: File → Load SQL file... → оберіть цей файл
--      АБО скопіюйте весь скрипт у вкладку Query
--   3. Натисніть Execute (F9) або кнопку ▶
--
-- ТЕСТОВИЙ КОРИСТУВАЧ:
--   Email:    test@example.com
--   Пароль:   password123
--
-- УВАГА: скрипт видаляє базу task_tracker та створює її заново!
-- =============================================================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';
SET time_zone = '+00:00';

-- -----------------------------------------------------------------------------
-- База даних
-- -----------------------------------------------------------------------------

DROP DATABASE IF EXISTS task_tracker;

CREATE DATABASE task_tracker
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE task_tracker;

-- -----------------------------------------------------------------------------
-- Видалення таблиць (якщо існують)
-- -----------------------------------------------------------------------------

DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS users;

-- -----------------------------------------------------------------------------
-- Таблиця: users
-- -----------------------------------------------------------------------------

CREATE TABLE users (
  id            INT UNSIGNED      NOT NULL AUTO_INCREMENT,
  username      VARCHAR(100)      NOT NULL,
  email         VARCHAR(255)      NOT NULL,
  password_hash VARCHAR(255)      NOT NULL,
  created_at    TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  CONSTRAINT uq_users_email UNIQUE (email),
  INDEX idx_users_username (username),
  INDEX idx_users_created_at (created_at)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Користувачі системи';

-- -----------------------------------------------------------------------------
-- Таблиця: tasks
-- -----------------------------------------------------------------------------

CREATE TABLE tasks (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  user_id     INT UNSIGNED  NOT NULL,
  title       VARCHAR(200)  NOT NULL,
  description TEXT          NULL,
  priority    ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
  status      ENUM('active', 'completed')   NOT NULL DEFAULT 'active',
  deadline    DATE          NULL,
  category    ENUM('work', 'personal', 'shopping', 'health', 'education', 'other')
                            NOT NULL DEFAULT 'other',
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),

  CONSTRAINT fk_tasks_user
    FOREIGN KEY (user_id)
    REFERENCES users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  INDEX idx_tasks_user_id (user_id),
  INDEX idx_tasks_status (status),
  INDEX idx_tasks_priority (priority),
  INDEX idx_tasks_category (category),
  INDEX idx_tasks_deadline (deadline),
  INDEX idx_tasks_user_status (user_id, status),
  INDEX idx_tasks_user_deadline (user_id, deadline)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Задачі користувачів';

SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------------------------------
-- Тестові дані: користувач
-- Пароль: password123 (bcrypt, 12 rounds)
-- -----------------------------------------------------------------------------

INSERT INTO users (id, username, email, password_hash, created_at) VALUES
(
  1,
  'Тестовий Користувач',
  'test@example.com',
  '$2b$12$U0Xqf0ZJ8yzJx4SUV6ZGne4a6AD7TNbHLwAarxychbLvdMfIJ1LFK',
  '2026-01-15 10:00:00'
);

-- -----------------------------------------------------------------------------
-- Тестові дані: задачі
-- -----------------------------------------------------------------------------

INSERT INTO tasks (user_id, title, description, priority, status, deadline, category, created_at, updated_at) VALUES
(
  1,
  'Підготувати презентацію для команди',
  'Слайди про Q1 результати та плани на наступний квартал.',
  'high',
  'active',
  '2026-06-05',
  'work',
  '2026-05-28 09:00:00',
  '2026-05-30 14:00:00'
),
(
  1,
  'Купити продукти на тиждень',
  'Молоко, хліб, яйця, овочі, фрукти.',
  'medium',
  'active',
  '2026-05-31',
  'shopping',
  '2026-05-29 18:30:00',
  '2026-05-29 18:30:00'
),
(
  1,
  'Записатися на прийом до лікаря',
  'Щорічний медичний огляд.',
  'medium',
  'active',
  '2026-06-10',
  'health',
  '2026-05-27 11:00:00',
  '2026-05-27 11:00:00'
),
(
  1,
  'Пройти курс TypeScript — модуль 3',
  'Generics, utility types, type guards.',
  'low',
  'active',
  '2026-06-20',
  'education',
  '2026-05-25 20:00:00',
  '2026-05-30 10:00:00'
),
(
  1,
  'Оплатити комунальні послуги',
  NULL,
  'high',
  'completed',
  '2026-05-25',
  'personal',
  '2026-05-20 08:00:00',
  '2026-05-24 16:45:00'
),
(
  1,
  'Зустріч з друзями',
  'Кафе біля парку, 18:00.',
  'low',
  'completed',
  '2026-05-24',
  'personal',
  '2026-05-22 12:00:00',
  '2026-05-24 21:00:00'
),
(
  1,
  'Оновити резюме',
  'Додати новий проєкт та навички React/Node.js.',
  'medium',
  'active',
  NULL,
  'work',
  '2026-05-30 08:00:00',
  '2026-05-30 08:00:00'
);

-- -----------------------------------------------------------------------------
-- Перевірка результату
-- -----------------------------------------------------------------------------

SELECT 'users' AS table_name, COUNT(*) AS row_count FROM users
UNION ALL
SELECT 'tasks', COUNT(*) FROM tasks;

SELECT
  u.id          AS user_id,
  u.username,
  u.email,
  COUNT(t.id)   AS tasks_count
FROM users u
LEFT JOIN tasks t ON t.user_id = u.id
GROUP BY u.id, u.username, u.email;

-- =============================================================================
-- Готово! Увійдіть у застосунок:
--   Email:  test@example.com
--   Пароль: password123
-- =============================================================================
