const processConfig = {
  PORT: process.env["PORT"],
  SERVICES: {
    AUTH: process.env["AUTH_SERVICE"],
    USERS: process.env["USERS_SERVICE"],
    EMAIL: process.env["EMAIL_SERVICE"],
    FALLBACK: process.env["FALLBACK"],
  },
  CLIENT: process.env["CLIENT"],
  ENVIROMENT: process.env["NODE_ENV"],
};

export default processConfig;
