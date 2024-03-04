----------------------Product----------------------
CREATE TABLE public."Product" (
  id VARCHAR(36) PRIMARY KEY,
  category_id INT NOT NULL,
  shop_id VARCHAR NOT NULL,
  name TEXT NOT NULL,
  thumb TEXT NOT NULL,
  description TEXT NOT NULL,
  variation_id INT,
  price double precision NOT NULL,
  rating FLOAT DEFAULT 4.5 NOT NULL,
  slug TEXT,
  isdraft BOOLEAN DEFAULT TRUE,
  ispublished BOOLEAN DEFAULT FALSE
);
----------------------Category----------------------
CREATE TABLE public."Category" (
  id SERIAL PRIMARY KEY,
  category_name VARCHAR(50) NOT NULL,
  parent_category_id INT REFERENCES "Category"(id) ON DELETE CASCADE
);
----------------------Variation----------------------
CREATE TABLE public."Variation" (
  id SERIAL PRIMARY KEY,
  category_id INT NOT NULL,
  shop_id VARCHAR(36),
  name VARCHAR(100) NOT NULL,
  value varchar(50) NOT NULL
);
INSERT INTO "public"."Variation" ("category_id", "name", "value")
VALUES (1, 'color', 'red');
INSERT INTO "public"."Variation" ("category_id", "name", "value")
VALUES (1, 'color', 'green');
INSERT INTO "public"."Variation" ("category_id", "name", "value")
VALUES (1, 'color', 'blue');
INSERT INTO "public"."Variation" ("category_id", "name", "value")
VALUES (1, 'size', 'S');
INSERT INTO "public"."Variation" ("category_id", "name", "value")
VALUES (1, 'size', 'M');
INSERT INTO "public"."Variation" ("category_id", "name", "value")
VALUES (1, 'size', 'L');
CREATE TABLE public."ProductVariation" (
  id SERIAL PRIMARY KEY,
  product_id VARCHAR(36),
  variation_id INT NOT NULL
);
----------------------Inventory----------------------
CREATE TABLE public."Inventory" (
  id SERIAL PRIMARY KEY,
  product_id VARCHAR(36) NOT NULL,
  quantity INTEGER NOT NULL,
  "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
----------------------ProductConstraint----------------------
ALTER TABLE public."Product"
ADD CONSTRAINT "product_shop_fk" FOREIGN KEY (shop_id) REFERENCES "User"(id);
ALTER TABLE public."Product"
ADD CONSTRAINT "product_category_fk" FOREIGN KEY (category_id) REFERENCES "Category"(id);
INSERT INTO "public"."Category" ("category_name")
VALUES ('Clothes');
INSERT INTO "public"."Category" ("category_name")
VALUES ('Electronics');
----------------------ProductInventoryConstrain----------------------
ALTER TABLE public."Inventory"
ADD CONSTRAINT "product_inventory_fkey" FOREIGN KEY (product_id) REFERENCES public."Product" (id) ON DELETE CASCADE;
----------------------VariationConstrain----------------------
ALTER TABLE public."Variation"
ADD CONSTRAINT "variation_category_fk" FOREIGN KEY (category_id) REFERENCES "Category"(id);
ALTER TABLE public."Variation"
ADD CONSTRAINT "variation_shop_fk" FOREIGN KEY (shop_id) REFERENCES "User"(id);
----------------------ProductVariationConstrain----------------------k
ALTER TABLE public."ProductVariation"
ADD CONSTRAINT "product_variation_fk" FOREIGN KEY (product_id) REFERENCES public."Product" (id) ON DELETE CASCADE;
ALTER TABLE public."ProductVariation"
ADD CONSTRAINT "variation_type_fk" FOREIGN KEY (variation_id) REFERENCES public."Variation" (id) ON DELETE CASCADE;
----------------------ProductIndex----------------------
--gin (Generalized Inverted Index)
--to_tsvector (Special data type optimized for full-text search. The tsvector contains lexemes (words) from the document along with their positions and weights.)
CREATE INDEX idx_product_fts ON "Product" USING gin(
  to_tsvector('english', name || ' ' || description)
);