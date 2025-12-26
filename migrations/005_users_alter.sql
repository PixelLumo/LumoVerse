ALTER TABLE users
ADD COLUMN email_verified BOOLEAN DEFAULT false,
ADD COLUMN verify_token VARCHAR(255),
ADD COLUMN reset_token VARCHAR(255),
ADD COLUMN reset_expires DATETIME;
