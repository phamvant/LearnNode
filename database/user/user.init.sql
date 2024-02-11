CREATE TYPE permission AS ENUM (
  'PERMISSION_0000',
  'PERMISSION_1111',
  'PERMISSION_2222'
);

----------------------ApiKey----------------------

CREATE TABLE public."ApiKey" (
  key VARCHAR(255) PRIMARY KEY,
  status BOOLEAN DEFAULT TRUE,
  permission permission[]
);

----------------------User----------------------

CREATE TABLE public."User" (
  id VARCHAR(255) NOT NULL,
  email VARCHAR(30) NOT NULL,
  name VARCHAR(30) NOT NULL,
  password VARCHAR(255) NOT NULL,
  username VARCHAR(30) NOT NULL,
  verified BOOLEAN NOT NULL,
  status VARCHAR(10) NOT NULL,
  roles VARCHAR(15)[] NULL
);

ALTER TABLE public."User"
ADD CONSTRAINT "User_pkey"
PRIMARY KEY (id);

----------------------KeyToken----------------------

CREATE TABLE public."KeyToken" (
  userId VARCHAR(255) NOT NULL,
  publicKey TEXT NOT NULL,
  usedRefreshToken TEXT[] NOT NULL
);

ALTER TABLE public."KeyToken"
ADD CONSTRAINT "KeyToken_pkey"
PRIMARY KEY (userId);

ALTER TABLE public."KeyToken"
ADD CONSTRAINT "KeyToken_fkey"
FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE CASCADE;

----------------------Index----------------------

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "KeyToken_userId_key" ON "KeyToken"(userId);

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_key_key" ON "ApiKey"("key");