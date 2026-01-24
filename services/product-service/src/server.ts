import "dotenv/config";

import processConfig from "./configs/env.js";
import app from "./app.js";
import { EnvValidator } from "@nexus/shared";
import connectDB from "./configs/db.js";
import { logger } from "./configs/logger.js";
import connectToKafka from "./configs/kafka.js";

const PORT: number = Number(processConfig.PORT);
const validate = new EnvValidator(logger);

validate.validateConfig(processConfig).then(() => {
  logger.info("All Env variables configured correctly");
  connectToKafka().then(() => {
    connectDB().then(() => {
      app.listen(PORT, () => {
        logger.info(`Auth-service started on port ${PORT}`);
      });
    });
  });
});
