import JWT from "jsonwebtoken";

const createKeyPair = async ({
  payload,
  publicKey,
  privateKey,
}: {
  payload: any;
  publicKey: any;
  privateKey: any;
}): Promise<
  | {
      accessToken: string;
      refreshToken: string;
    }
  | any
> => {
  try {
    const accessToken = JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "2 days",
    });

    const refreshToken = JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "7 days",
    });

    return { accessToken, refreshToken };
  } catch (error) {
    return Promise.reject(error);
  }
};

export default createKeyPair;
