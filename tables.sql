CREATE DATABASE todolist;
\c todolist;
CREATE TABLE users(
  id VARCHAR(100) DEFAULT(gen_random_uuid()) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(100) NOT NULL
);

CREATE TABLE tasks(
  id VARCHAR(100) DEFAULT(gen_random_uuid()) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  text VARCHAR(100),
  userid VARCHAR(100),
  FOREIGN KEY (userid) REFERENCES users(id)
);

CREATE TABLE categories(
  id VARCHAR(100) DEFAULT(gen_random_uuid()) PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);