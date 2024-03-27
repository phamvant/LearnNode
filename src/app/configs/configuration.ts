interface Config {
  development: {
    DB: {
      HOST: string;
      PORT: number;
      DBNAME: string;
      USERNAME: string;
      PASSWORD: string;
    };
    APP: {
      PORT: number | undefined;
    };
  };
  production: {
    DB: {
      HOST: string;
      PORT: number;
      DBNAME: string;
      USERNAME: string;
      PASSWORD: string;
    };
    APP: {
      PORT: number | undefined;
    };
  };
}

const development: Config["development"] = {
  DB: {
    HOST: process.env.DATABASE_HOST_DEV || "localhost",
    PORT: process.env.DATABASE_PORT_DEV
      ? parseInt(process.env.DATABASE_PORT_DEV, 10)
      : 5432,
    DBNAME: process.env.DATABASE_NAME_DEV || "postgres",
    USERNAME: process.env.DATABASE_USERNAME_DEV || "thuan",
    PASSWORD: process.env.DATABASE_PASSWORD_DEV || "thuan286",
  },
  APP: {
    PORT: process.env.SERVER_PORT_DEV
      ? parseInt(process.env.SERVER_PORT_DEV, 10)
      : 3000,
  },
};

const production: Config["production"] = {
  DB: {
    HOST: process.env.DATABASE_TYPE_PRO || "DATABASE_TYPE_PRO",
    PORT: process.env.DATABASE_PORT_PRO
      ? parseInt(process.env.DATABASE_PORT_PRO, 10)
      : 5432,
    DBNAME: process.env.DATABASE_NAME_PRO || "tipjs",
    USERNAME: process.env.DATABASE_USERNAME_PRO || "phamvant",
    PASSWORD: process.env.DATABASE_PASSWORD_PRO || "123",
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
