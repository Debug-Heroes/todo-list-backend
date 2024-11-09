CREATE DATABASE IF NOT EXISTS db_todo_list;
\c db_todo_list;

CREATE SCHEMA IF NOT EXISTS sch_todo_list;

CREATE TABLE IF NOT EXISTS sch_todo_list.users(
  id VARCHAR(100) DEFAULT(gen_random_uuid()) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS sch_todo_list.tasks(
  id VARCHAR(100) DEFAULT(gen_random_uuid()) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  text TEXT,
  user_id VARCHAR(100),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_user_id ON sch_todo_list.tasks(user_id);

CREATE TABLE IF NOT EXISTS sch_todo_list.categories(
  id VARCHAR(100) DEFAULT(gen_random_uuid()) PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);
