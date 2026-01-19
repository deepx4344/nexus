import "dotenv/config";

import processConfig from "./configs/env.js";
import app from "./app.js";
import validateConfig from "@shared/configs/validateEnv.mjs";
import connectDB from "./configs/db.js";
import { logger } from "./configs/logger.js";

const PORT: number = Number(processConfig.PORT);

validateConfig(processConfig, logger).then(() => {
  logger.info("All Env variables configured correctly");
  connectDB().then(() => {
    app.listen(PORT, () => {
      logger.info(`Auth-service started on port ${PORT}`);
    });
  });
});
