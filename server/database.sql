CREATE TABLE users (
    user_id BIGSERIAL PRIMARY KEY NOT NULL,
    username VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL,
    password VARCHAR(200) NOT NULL,
    UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
  user_id SERIAL PRIMARY KEY,
  token TEXT
);    