import { JwtService } from "@nexus/shared";
import { logger } from "../configs/logger.js";

const jwt = new JwtService(logger);

export default jwt;

