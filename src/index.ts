export const enum Permission {
  PERMISSION_0000 = "PERMISSION_0000",
  PERMISSION_1111 = "PERMISSION_1111",
  PERMISSION_2222 = "PERMISSION_2222",
}

export const HEADER = {
  API_KEY: "x-api-key",
  CLIENTID: "x-client-id",
  AUTHORIZATION: "authorization",
};

export interface JwtPayload {
  [key: string]: any;
  userId?: string;
  iss?: string | undefined;
  sub?: string | undefined;
  aud?: string | string[] | undefined;
  exp?: number | undefined;
  nbf?: number | undefined;
  iat?: number | undefined;
  jti?: string | undefined;
}

export const KeyTokenTable = `public."KeyToken"`;

// export const DEBUGING = 1;
export const DEBUGING = 0;
