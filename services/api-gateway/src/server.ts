import "dotenv/config"
import app from "./app.js";
import processConfig from "./configs/env.js";
import {EnvValidator} from "@nexus/shared";
import { logger } from "./configs/logger.js";

const validate = new EnvValidator(logger)
const PORT: number = Number(processConfig.PORT);

validate.validateConfig(processConfig).then(() => {
  console.log("Env variables all configured correctly");
  app.listen(PORT, () => {
    console.log(`Api-gateway Started on port ${PORT}`);
  });
});
