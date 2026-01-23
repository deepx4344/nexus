const processConfig = {
  PORT: process.env["PORT"],
  SERVICES: {
    AUTH: process.env["AUTH_SERVICE"],
    USERS: process.env["USER_SERVICE"],
    EMAIL: process.env["EMAIL_SERVICE"],
    ORDER: process.env["ORDER_SERVICE"],
    PAYMENT: process.env["PAYMENT_SERVICE"],
    PRODUCT: process.env["PRODUCT_SERVICE"],
    FALLBACK: process.env["FALLBACK"],
  },
  CLIENT: process.env["CLIENT"],
  ENVIROMENT: process.env["NODE_ENV"],
  COOKIE: {
    SECRET: process.env["COOKIE_KEY"],
  },
  JWTs: {
    ACCESS_SECRET: process.env["JWT_ACCESS_SECRET"],
  },
  REDIS_URI: process.env["REDIS_URI"],
};

export default processConfig;
