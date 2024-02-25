CREATE TYPE permission AS ENUM (
  'PERMISSION_0000',
  'PERMISSION_1111',
  'PERMISSION_2222'
);
----------------------ApiKey----------------------
CREATE TABLE public."ApiKey" (
  key VARCHAR(100) PRIMARY KEY,
  status BOOLEAN DEFAULT TRUE,
  permission permission []
);
INSERT INTO "public"."ApiKey" ("key", "status", "permission")
VALUES (
    'xxx',
    TRUE,
    ARRAY ['PERMISSION_0000']::permission []
  );
UPDATE public."ApiKey"
SET "permission" = array_append("permission", 'PERMISSION_1111')
WHERE "key" = 'xxx';
----------------------User----------------------
CREATE TABLE public."User" (
  id VARCHAR(36) NOT NULL,
  email VARCHAR(30) NOT NULL,
  name VARCHAR(30) NOT NULL,
  password VARCHAR(50) NOT NULL,
  username VARCHAR(30) NOT NULL,
  verified BOOLEAN NOT NULL,
  status VARCHAR(10) NOT NULL,
  roles VARCHAR(15) [] NULL
);
ALTER TABLE public."User"
ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);
----------------------KeyToken----------------------
CREATE TABLE public."KeyToken" (
  userId VARCHAR(36) NOT NULL,
  publicKey TEXT NOT NULL,
  usedRefreshToken TEXT []
);
ALTER TABLE public."KeyToken"
ADD CONSTRAINT "KeyToken_pkey" PRIMARY KEY (userId);
ALTER TABLE public."KeyToken"
ADD CONSTRAINT "KeyToken_fkey" FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE CASCADE;
----------------------Index----------------------
-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
-- CreateIndex
CREATE UNIQUE INDEX "KeyToken_userId_key" ON "KeyToken"(userId);
-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_key_key" ON "ApiKey"("key");