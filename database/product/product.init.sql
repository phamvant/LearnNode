----------------------Product----------------------
CREATE TABLE public."Product" (
  id VARCHAR(36) PRIMARY KEY,
  category_id INT NOT NULL,
  shop_id VARCHAR NOT NULL,
  name VARCHAR(30) NOT NULL,
  thumb TEXT NOT NULL,
  description TEXT NOT NULL,
  variation_id INT,
  price double precision NOT NULL,
  rating FLOAT DEFAULT 4.5 NOT NULL,
  slug TEXT,
  isdraft BOOLEAN DEFAULT TRUE,
  ispublished BOOLEAN DEFAULT FALSE
);
----------------------ProductCategory----------------------
CREATE TABLE public."ProductCategory" (
  id SERIAL PRIMARY KEY,
  category_name VARCHAR(50) NOT NULL,
  parent_category_id INT REFERENCES "ProductCategory"(id) ON DELETE CASCADE
);
----------------------ProductVariation----------------------
CREATE TABLE public."ProductVariation" (
  id SERIAL PRIMARY KEY,
  category_id INT NOT NULL,
  shop_id VARCHAR(36),
  name VARCHAR(100) NOT NULL,
  value varchar(50) NOT NULL
);
----------------------ProductInventory----------------------
CREATE TABLE public."ProductInventory" (
  quantity INTEGER NOT NULL,
  product_id VARCHAR(36) NOT NULL,
  "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
----------------------ProductConstraint----------------------
ALTER TABLE public."Product"
ADD CONSTRAINT "product_shop_fk" FOREIGN KEY (shop_id) REFERENCES "User"(id);
ALTER TABLE public."Product"
ADD CONSTRAINT "product_category_fk" FOREIGN KEY (category_id) REFERENCES "ProductCategory"(id);
ALTER TABLE public."Product"
ADD CONSTRAINT "product_variation_fk" FOREIGN KEY (variation_id) REFERENCES "ProductCategory"(id);
INSERT INTO "public"."ProductCategory" ("category_name")
VALUES ('Clothes');
INSERT INTO "public"."ProductCategory" ("category_name")
VALUES ('Electronics');
----------------------ProductInventoryConstrain----------------------
ALTER TABLE public."ProductInventory"
ADD CONSTRAINT "product_inventory_fkey" FOREIGN KEY (product_id) REFERENCES public."Product" (id) ON DELETE CASCADE;
----------------------ProductVariationConstrain----------------------
ALTER TABLE public."ProductVariation"
ADD CONSTRAINT "variation_category_fk" FOREIGN KEY (category_id) REFERENCES "ProductCategory"(id);
ALTER TABLE public."ProductVariation"
ADD CONSTRAINT "variation_shop_fk" FOREIGN KEY (shop_id) REFERENCES "User"(id);