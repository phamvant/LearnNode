import { BadRequestError } from "../core/error.response";
import postgres from "../database/init.postgres";

class ApiKeyService {
  static findApiKey = async (apiKey: string) => {
    const objKey = await postgres
      .query({
        text: `SELECT * FROM "public"."ApiKey" WHERE "key"=$1`,
        values: [apiKey],
      })
      .catch((error: any) => {
        console.log(error);
        throw new BadRequestError({ message: "Query failed" });
      });

    return objKey.rows[0];
  };
}

export default ApiKeyService;
