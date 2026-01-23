import {createLogger} from "@nexus/shared";
import processConfig from "./env.js";

const { logger, httpMiddleware } = createLogger({
  serviceName: "auth-service",
  env: (processConfig.ENVIROMENT as any) || "development",
});

export { logger, httpMiddleware };