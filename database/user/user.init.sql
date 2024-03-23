CREATE TYPE permission AS ENUM (
  'PERMISSION_0000',
  'PERMISSION_1111',
  'PERMISSION_2222'
);
----------------------ApiKey----------------------
CREATE TABLE public."ApiKey" (
  apikey_key VARCHAR(100) PRIMARY KEY,
  apikey_status BOOLEAN DEFAULT TRUE,
  apikey_permission permission []
);
INSERT INTO public."ApiKey" (
    apikey_key,
    apikey_status,
    apikey_permission
  )
VALUES (
    'xxx',
    TRUE,
    ARRAY ['PERMISSION_0000']::permission []
  );
UPDATE public."ApiKey"
SET "apikey_permission" = array_append("apikey_permission", 'PERMISSION_1111')
WHERE "apikey_key" = 'xxx';
----------------------User----------------------
CREATE TABLE public."User" (
  user_id VARCHAR(36) NOT NULL,
  user_email VARCHAR(30) NOT NULL,
  user_name VARCHAR(30) NOT NULL,
  user_password VARCHAR(50) NOT NULL,
  user_username VARCHAR(30) NOT NULL,
  user_verified BOOLEAN NOT NULL,
  user_status VARCHAR(10) NOT NULL,
  user_roles VARCHAR(15) [] NULL
);
ALTER TABLE public."User"
ADD CONSTRAINT "User_pkey" PRIMARY KEY (user_id);
----------------------KeyToken----------------------
CREATE TABLE public."KeyToken" (
  keytoken_user_id VARCHAR(36) NOT NULL,
  keytoken_public_key TEXT NOT NULL,
  keytoken_used_refresh_token TEXT []
);
ALTER TABLE public."KeyToken"
ADD CONSTRAINT "KeyToken_pkey" PRIMARY KEY (keytoken_user_id);
ALTER TABLE public."KeyToken"
ADD CONSTRAINT "KeyToken_fkey" FOREIGN KEY (keytoken_user_id) REFERENCES "User"(user_id) ON DELETE CASCADE;
----------------------Index----------------------
-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"(user_email);
-- CreateIndex
CREATE UNIQUE INDEX "KeyToken_userId_key" ON "KeyToken"(keytoken_user_id);
-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_key_key" ON "ApiKey"(apikey_key);