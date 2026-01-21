import type{ CorsOptions } from "cors";
import processConfig from "../configs/env.js";

const corsOptions: CorsOptions = {
  origin: processConfig.CLIENT,
  optionsSuccessStatus: 204,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
export default corsOptions;
