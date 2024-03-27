CREATE TYPE t_cart_state_type AS enum (
  'active',
  'completed',
  'failed',
  'pending'
);
CREATE TABLE public."Cart" (
  cart_id SERIAL NOT NULL PRIMARY KEY,
  cart_state t_cart_state_type DEFAULT 'active',
  cart_user_id VARCHAR(36) NOT NULL,
  cart_total INT NOT NULL DEFAULT 0
);
ALTER TABLE "Cart"
ADD CONSTRAINT "cart_fkey" FOREIGN KEY (cart_user_id) REFERENCES "User"(user_id);
CREATE TABLE public."CartProduct" (
  cart_product_id SERIAL NOT NULL PRIMARY KEY,
  cart_product_cart_id INT NOT NULL,
  cart_product_product_id VARCHAR(36) NOT NULL,
  cart_product_quantity INT DEFAULT 1 NOT NULL,
  cart_product_created_at TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  cart_product_updated_at TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
ALTER TABLE "CartProduct"
ADD CONSTRAINT "cart_product_fkey" FOREIGN KEY (cart_product_cart_id) REFERENCES "Cart"(cart_id);
ALTER TABLE "CartProduct"
ADD CONSTRAINT "cart_product_fkey_2" FOREIGN KEY (cart_product_product_id) REFERENCES "Product"(product_id);