const processConfig = {
  PORT: process.env["PORT"],
  NAME: process.env["NAME"],
  SERVICE: process.env["CLIENT_ID"],
  ENVIROMENT: process.env["NODE_ENV"],
  DATABASEURI: process.env["MONGOURI"],
  REDIS_URI: process.env["REDIS_URI"],
  KAFKA: {
    BROKER: process.env["KAFKA_BROKER"],
    GROUP_ID: process.env["GROUP_ID"],
  },
};

export default processConfig;
