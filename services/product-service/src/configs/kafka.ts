import kafkaServices from "../services/kafka.js";
import { logger } from "./logger.js";

const connectToKafka = async (): Promise<void> => {
  try {
    await kafkaServices.startConnection();
    logger.info("Kafka Server connected");

    process.on("SIGINT", async () => {
      await kafkaServices.endConnection();
      logger.info("Kafka server disconnected");
      process.exit(0);
    });
  } catch (err) {
    logger.error(`Something went wrong ${err}`);
    await kafkaServices.endConnection();
    process.exit(1);
  }
};
export default connectToKafka;
