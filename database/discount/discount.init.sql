CREATE TYPE t_discount_type AS ENUM ('fixed_amout', 'other');
CREATE TYPE t_discount_applies_to AS ENUM ('all', 'specific');
----------------------Discount=--------------------
--                                               --
--                                               --
--                                               --
----------------------Discount=--------------------
CREATE TABLE public."Discount" (
  discount_id SERIAL PRIMARY KEY,
  discount_name TEXT NOT NULL,
  discount_description TEXT NOT NULL,
  discount_type t_discount_type NOT NULL,
  discount_value FLOAT NOT NULL,
  discount_code VARCHAR(50),
  discount_start_date TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL,
  discount_end_date TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL,
  discount_max_uses INT NOT NULL,
  discount_uses_count INT NOT NULL DEFAULT 0,
  discount_users_used INT NOT NULL DEFAULT 0,
  discount_max_uses_per_user INT NOT NULL,
  discount_min_order_value INT,
  discount_shop_id VARCHAR(36) NOT NULL,
  discount_is_active BOOLEAN DEFAULT FALSE NOT NULL,
  discount_applies_to t_discount_applies_to NOT NULL,
  discount_product_id VARCHAR(36) NOT NULL
);
----------------------DiscountConstrain-----------------------
--                                                          --
--                                                          --
--                                                          --
----------------------DiscountConstrain-----------------------
ALTER TABLE public."Discount"
ADD CONSTRAINT "discount_fk_1" FOREIGN KEY (discount_shop_id) REFERENCES "User"(user_id);
ALTER TABLE public."Discount"
ADD CONSTRAINT "discount_fk_2" FOREIGN KEY (discount_product_id) REFERENCES "Product"(product_id);