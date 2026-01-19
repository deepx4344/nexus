import "dotenv/config"
import app from "./app.js";
import processConfig from "./configs/env.js";
import validateConfig from "@shared/configs/validateEnv.mjs";

const PORT: number = Number(processConfig.PORT);

validateConfig(processConfig).then(() => {
  console.log("Env variables all configured correctly");
  app.listen(PORT, () => {
    console.log(`Api-gateway Started on port ${PORT}`);
  });
});
