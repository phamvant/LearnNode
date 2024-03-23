----------------------Product----------------------
CREATE TABLE public."Product" (
  product_id VARCHAR(36) PRIMARY KEY,
  product_category_id INT NOT NULL,
  product_shop_id VARCHAR NOT NULL,
  product_name TEXT NOT NULL,
  product_thumb TEXT NOT NULL,
  product_description TEXT NOT NULL,
  product_variation_id INT,
  product_price double precision NOT NULL,
  product_rating FLOAT DEFAULT 4.5 NOT NULL,
  product_slug TEXT,
  product_isdraft BOOLEAN DEFAULT TRUE,
  product_ispublished BOOLEAN DEFAULT FALSE
);
----------------------Category----------------------
CREATE TABLE public."Category" (
  category_id SERIAL PRIMARY KEY,
  category_name VARCHAR(50) NOT NULL,
  category_parent_id INT REFERENCES "Category"(category_id) ON DELETE CASCADE
);
----------------------Variation----------------------
CREATE TABLE public."Variation" (
  variation_id SERIAL PRIMARY KEY,
  variation_category_id INT NOT NULL,
  variation_shop_id VARCHAR(36),
  variation_name VARCHAR(100) NOT NULL,
  variation_value varchar(50) NOT NULL
);
INSERT INTO public."Variation" (
    "variation_category_id",
    "variation_name",
    "variation_value"
  )
VALUES (1, 'color', 'red');
INSERT INTO public."Variation" (
    "variation_category_id",
    "variation_name",
    "variation_value"
  )
VALUES (1, 'color', 'green');
INSERT INTO public."Variation" (
    "variation_category_id",
    "variation_name",
    "variation_value"
  )
VALUES (1, 'color', 'blue');
INSERT INTO public."Variation" (
    "variation_category_id",
    "variation_name",
    "variation_value"
  )
VALUES (1, 'size', 'S');
INSERT INTO public."Variation" (
    "variation_category_id",
    "variation_name",
    "variation_value"
  )
VALUES (1, 'size', 'M');
INSERT INTO public."Variation" (
    "variation_category_id",
    "variation_name",
    "variation_value"
  )
VALUES (1, 'size', 'L');
CREATE TABLE public."ProductVariation" (
  product_variation_id SERIAL PRIMARY KEY,
  product_variation_product_id VARCHAR(36),
  product_variation_variation_id INT NOT NULL
);
----------------------Inventory----------------------
CREATE TABLE public."Inventory" (
  inventory_id SERIAL PRIMARY KEY,
  inventory_product_id VARCHAR(36) NOT NULL,
  inventory_quantity INTEGER NOT NULL,
  inventory_created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  inventory_updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
----------------------ProductConstraint----------------------
ALTER TABLE public."Product"
ADD CONSTRAINT "product_shop_fk" FOREIGN KEY (product_shop_id) REFERENCES "User"(user_id);
ALTER TABLE public."Product"
ADD CONSTRAINT "product_category_fk" FOREIGN KEY (product_category_id) REFERENCES "Category"(category_id);
INSERT INTO public."Category" (category_name)
VALUES ('Clothes');
INSERT INTO public."Category" (category_name)
VALUES ('Electronics');
----------------------ProductInventoryConstrain----------------------
ALTER TABLE public."Inventory"
ADD CONSTRAINT "product_inventory_fkey" FOREIGN KEY (inventory_product_id) REFERENCES public."Product" (product_id) ON DELETE CASCADE;
----------------------VariationConstrain----------------------
ALTER TABLE public."Variation"
ADD CONSTRAINT "variation_category_fk" FOREIGN KEY (variation_category_id) REFERENCES "Category"(category_id);
ALTER TABLE public."Variation"
ADD CONSTRAINT "variation_shop_fk" FOREIGN KEY (variation_shop_id) REFERENCES "User"(user_id);
----------------------ProductVariationConstrain----------------------k
ALTER TABLE public."ProductVariation"
ADD CONSTRAINT "product_variation_fk" FOREIGN KEY (product_variation_product_id) REFERENCES public."Product" (product_id) ON DELETE CASCADE;
ALTER TABLE public."ProductVariation"
ADD CONSTRAINT "variation_type_fk" FOREIGN KEY (product_variation_variation_id) REFERENCES public."Variation" (variation_id) ON DELETE CASCADE;
----------------------ProductIndex----------------------
--gin (Generalized Inverted Index)
--to_tsvector (Special data type optimized for full-text search. The tsvector contains lexemes (words) from the document along with their positions and weights.)
CREATE INDEX idx_product_fts ON "Product" USING gin(
  to_tsvector(
    'english',
    product_name || ' ' || product_description
  )
);