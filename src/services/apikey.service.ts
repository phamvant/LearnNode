class ApiKeyService {
  static findApiKey = async (apiKey: string) => {
    const objKey = await postgres.query({
      text: `SELECT * FROM "ApiKey"`,
    });

    return objKey.rows[0];
  };
}

export default ApiKeyService;
