interface Config {
  development: {
    DB: {
      HOST: string;
    };
    APP: {
      PORT: number | undefined;
    };
  };
  production: {
    DB: {
      HOST: string | undefined;
    };
    APP: {
      PORT: number | undefined;
    };
  };
}

const development: Config["development"] = {
  DB: {
    HOST: process.env.DATABASE_TYPE_DEV || "file:./dev.db",
  },
  APP: {
    PORT: process.env.SERVER_PORT_DEV
      ? parseInt(process.env.SERVER_PORT_DEV, 10)
      : undefined,
  },
};

const production: Config["production"] = {
  DB: {
    HOST: process.env.DATABASE_TYPE_PRO,
  },
  APP: {
    PORT: process.env.SERVER_PORT_PRO
      ? parseInt(process.env.SERVER_PORT_PRO, 10)
      : undefined,
  },
};

const CONFIG = { development, production };
const env = process.env.NODE_ENV || "development";

export default CONFIG[env as keyof Config];
