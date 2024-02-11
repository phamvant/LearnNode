----------------------Product----------------------

CREATE TABLE public."Product" (
  id VARCHAR(255) NOT NULL,
  name VARCHAR(30) NOT NULL,
  thumb TEXT NOT NULL,
  description TEXT NOT NULL,
  price double precision NOT NULL,
  shop_id VARCHAR NOT NULL
);

ALTER TABLE public."Product"
ADD CONSTRAINT "Product_pkey"
PRIMARY KEY (id);

ALTER TABLE public."Product"
ADD CONSTRAINT "Product_fkey"
FOREIGN KEY (shop_id) REFERENCES "User"(id);

----------------------ProductInventory----------------------

CREATE TABLE public."ProductInventory" (
  productId VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

ALTER TABLE public."ProductInventory"
ADD CONSTRAINT "ProductInventory_pkey"
PRIMARY KEY (productId);

ALTER TABLE public."ProductInventory" 
ADD CONSTRAINT "ProductProductInventory_fkey"
FOREIGN KEY (productId) REFERENCES "Product"(id) ON DELETE CASCADE;
