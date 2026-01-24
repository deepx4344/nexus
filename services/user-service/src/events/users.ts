import { logger } from "../configs/logger.js";
import kafkaServices from "../services/kafka.js";
import userService from "../services/users.js";

kafkaServices.eventEmitter.on("message.received", async (data) => {
  try {
    await userService.create(data);
  } catch (err) {
    logger.error(`Something went wrong ${err}`);
  }
});
