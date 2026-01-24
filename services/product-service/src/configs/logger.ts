import { createLogger } from "@nexus/shared";
import processConfig from "./env.js";

const { logger, httpMiddleware } = createLogger({
  serviceName: processConfig.SERVICE!.toLowerCase(),
  env: (processConfig.ENVIROMENT as any) || "development",
});

export { logger, httpMiddleware };
