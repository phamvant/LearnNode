INSERT INTO public."ApiKey" (
    apikey_key,
    apikey_status,
    apikey_permission
  )
VALUES (
    'xxx',
    TRUE,
    ARRAY ['PERMISSION_0000']::permission []
  );
UPDATE public."ApiKey"
SET "apikey_permission" = array_append("apikey_permission", 'PERMISSION_1111')
WHERE "apikey_key" = 'xxx';
------------------------------------------------
INSERT INTO "User" (
    user_id,
    user_email,
    user_name,
    user_password,
    user_username,
    user_verified,
    user_status,
    user_roles
  )
VALUES (
    '00270e35-ea1a-4d0b-a143-af89881014c2',
    'thuan@gmail.com',
    'pham',
    '1',
    'pvt',
    FALSE,
    'active',
    ARRAY ['0000']
  );
------------------------------------------------
INSERT INTO "KeyToken" (
    keytoken_user_id,
    keytoken_public_key,
    keytoken_used_refresh_token
  )
VALUES (
    '00270e35-ea1a-4d0b-a143-af89881014c2',
    '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApz7w0YoClbg2OMxDQEd4\n/MysRo9SPd/VXkPaL1Hyq/Q+mVCBrl6S36hhAz7ufR4E11AQIGnnl1MuSIWz5Ij5\nsHNX88NX9OPfZ+bWIEkddl5/tv1a5W3WRAfm1ssJZI2z75eW2l87B/Ea04QmKMyI\n9GbYvC3WMF+mX6jNG6ZgDeLq9m/lRO3TiuFVjr6LHL6Dv9pLxFd/sTWTqWob7kPq\nL5qFAvaaVoR9yU3g2eZ9ZcTDqNQiaImL6huT/1VQ2U8UFUyP33Ms0CJqM9CK3vl1\nJHFz/sV55+fGzIOivuRq/Zv2ARZb976nZx3/s1Whudgd2i6UskvxrGqac84Welm8\nUQIDAQAB\n-----END PUBLIC KEY-----\n',
    ARRAY ['eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwMDI3MGUzNS1lYTFhLTRkMGItYTE0My1hZjg5ODgxMDE0YzIiLCJlbWFpbCI6InRodWFuQGdtYWlsLmNvbSIsImlhdCI6MTcxMTUzOTEyNCwiZXhwIjoxNzEyMTQzOTI0fQ.Hw4mvlpNuPTjXZiUvW9gppiPxldLTTgVPjOwwo2oH88x-AXm-VC1uj52h-SZOh257bgjodD8kBSFDj5k1poyI8abQb1f47YdSTR7sfS6aBvDklSVtm9k9jDro7mUkIG0W6TSY6CcxcXgCdW3WGLHKMFzgJDkbNPKDEusv6dl4_GeR_6osFdIJOQSG0NqiAmV3Xp9PJyla8GicwSNl0smImhaUHpb0W_7MQQlC5OVNNAlhw91HX4HuZgP9qlDamgZ9hVtUe6nHthfDlAzS6czm1vvZZPiUJsXv3Sqm8an83KqqvSoNoAl55lZ_b029IosYdySVOll8B9RX8fWlO3uDA']
  );
-------------------------------------------------
INSERT INTO public."Category" (category_name)
VALUES ('Clothes');
INSERT INTO public."Category" (category_name)
VALUES ('Electronics');
-------------------------------------------------
INSERT INTO public."Variation" ("variation_name", "variation_value")
VALUES ('color', 'red');
INSERT INTO public."Variation" ("variation_name", "variation_value")
VALUES ('color', 'green');
INSERT INTO public."Variation" ("variation_name", "variation_value")
VALUES ('color', 'blue');
INSERT INTO public."Variation" ("variation_name", "variation_value")
VALUES ('size', 'S');
INSERT INTO public."Variation" ("variation_name", "variation_value")
VALUES ('size', 'M');
INSERT INTO public."Variation" ("variation_name", "variation_value")
VALUES ('size', 'L');
-------------------------------------------------
INSERT INTO "CategoryVariation" (
    category_variation_category_id,
    category_variation_variation_id
  )
VALUES (1, 1);
INSERT INTO "CategoryVariation" (
    category_variation_category_id,
    category_variation_variation_id
  )
VALUES (1, 2);
INSERT INTO "CategoryVariation" (
    category_variation_category_id,
    category_variation_variation_id
  )
VALUES (1, 3);
INSERT INTO "CategoryVariation" (
    category_variation_category_id,
    category_variation_variation_id
  )
VALUES (2, 4);
INSERT INTO "CategoryVariation" (
    category_variation_category_id,
    category_variation_variation_id
  )
VALUES (2, 5);
INSERT INTO "CategoryVariation" (
    category_variation_category_id,
    category_variation_variation_id
  )
VALUES (2, 6);