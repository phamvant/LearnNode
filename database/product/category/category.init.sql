----------------------Houseware----------------------

CREATE TABLE public."Houseware" (
  id VARCHAR(255) NOT NULL,
  brand VARCHAR(255) NOT NULL,
  color VARCHAR(255) NOT NULL,
  material VARCHAR(255) NULL
);

ALTER TABLE public."Houseware"
ADD CONSTRAINT "Houseware_pkey"
PRIMARY KEY (id);

----------------------Electronic----------------------

CREATE TABLE public."Electronic" (
  id VARCHAR(255) NOT NULL,
  brand VARCHAR(255) NOT NULL,
  color VARCHAR(255) NOT NULL,
  material VARCHAR(255) NULL
);

ALTER TABLE public."Electronic"
ADD CONSTRAINT "Electronic_pkey"
PRIMARY KEY (id);

----------------------Clothes----------------------

CREATE TABLE public."Clothes" (
  id VARCHAR(255) NOT NULL,
  brand VARCHAR(255) NOT NULL,
  size INTEGER NOT NULL,
  material VARCHAR(255) NULL
);

ALTER TABLE public."Clothes"
ADD CONSTRAINT "Clothes_pkey"
PRIMARY KEY (id);
