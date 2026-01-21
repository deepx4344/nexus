import type { Logger } from "pino";
export class EnvValidator {
  constructor(private logger: Logger) {}

  public async validateConfig(config: any): Promise<void> {
    let notvalid: boolean = false;
    const keys = Object.keys(config) as Array<keyof typeof config>;
    keys.forEach((key) => {
      const check = config[key];
      if (check === undefined || check === null || check === "") {
        notvalid = true;
        this.logger.error(
          `FATAL: Could not resolve Env variable for "${key as string}"`
        );
      } else {
        if (typeof check !== "string") {
          this.validateConfig(check);
        }
      }
    });
    if (notvalid) {
      process.exit(1);
    }
  }
}
