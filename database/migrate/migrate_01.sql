SELECT *
FROM "Product" as "p"
  RIGHT JOIN "User" as "u" ON "p"."shop_id" = "u"."id"