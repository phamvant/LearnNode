import { BadRequestError } from "../core/error.response";
import { postgresSingleton } from "../database/init.postgres";

class ApiKeyService {
  static findApiKey = async (apiKey: string) => {
    const objKey = await postgres
      .query({
        text: `SELECT * FROM "ApiKey"`,
      })
      .catch((error: any) => {
        console.log(error);
        throw new BadRequestError({ message: "Query failed" });
      });

    return objKey.rows[0];
  };
}

export default ApiKeyService;
