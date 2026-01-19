import type { Logger } from "pino";
const validateConfig = async (config: any, logger: Logger): Promise<void> => {
  let notvalid: boolean = false;
  const keys = Object.keys(config) as Array<keyof typeof config>;
  keys.forEach((key) => {
    const check = config[key];
    if (check === undefined || check === null || check === "") {
      notvalid = true;
      logger.error(
        `FATAL: Could not resolve Env variable for "${key as string}"`
      );
    } else {
      if (typeof check !== "string") {
        validateConfig(check, logger);
      }
    }
  });
  if (notvalid) {
    process.exit(1);
  }
};
export default validateConfig;
