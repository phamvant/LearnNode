import { BadRequestError } from "../../core/error.response";
import postgres from "../../database/init.postgres";
import { toCamel } from "../../utils";

const findApiKey = async (apiKey: string) => {
  const objKey = await postgres
    .query({
      text: `SELECT * FROM "ApiKey" WHERE apikey_key=$1`,
      values: [apiKey],
    })
    .catch((error: any) => {
      console.log(error);
      throw new BadRequestError({ message: "Query failed" });
    });

  return toCamel(objKey.rows)[0];
};

const ApiKeyService = {
  findApiKey,
};

export default ApiKeyService;
