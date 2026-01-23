const processConfig = {
  PORT: process.env["PORT"],
  NAME: process.env["NAME"],
  SERVICE: process.env["CLIENT_ID"],
  ENVIROMENT: process.env["NODE_ENV"],
  JWTs: {
    ACCESS: {
      SECRET: process.env["JWT_ACCESS_SECRET"],
      DURATION: process.env["JWT_ACCESS_EXPIRES_IN"],
    },
    REFRESH: {
      SECRET: process.env["JWT_REFRESH_SECRET"],
      DURATION: process.env["JWT_REFRESH_SECRET_EXPIRES_IN"],
    },
    VERIFICATION: {
      SECRET: process.env["VERIFICATION_KEY"],
      DURATION: process.env["VERIFICATION_EXPIRES"],
    },
  },
  COOKIE: {
    SECRET: process.env["COOKIE_KEY"],
  },
  BCRYPTROUNDS: process.env["BCRYPT_ROUNDS"],
  DATABASEURI: process.env["MONGOURI"],
  REDIS_URI: process.env["REDIS_URI"],
  KAFKA: {
    BROKER: process.env["KAFKA_BROKER"],
    GROUP_ID: process.env["GROUP_ID"],
  },
};

export default processConfig;
