import {
  UnifiedKafkaService,
  type UserRegistationInterface,
} from "@nexus/shared";
import processConfig from "../configs/env.js";
import { logger } from "../configs/logger.js";
import type { Logger } from "pino";

const serviceKafkaDetails: typeof processConfig.KAFKA = processConfig.KAFKA;

class KafkaServices extends UnifiedKafkaService {
  constructor(
    brokers: string[],
    clientId: string,
    groupId: string,
    logger: Logger
  ) {
    super(brokers, clientId, groupId, logger);
  }
  startConnection = async (): Promise<void> => {
    await super.connect();
  };
  endConnection = async (): Promise<void> => {
    await super.disconnect();
  };
  consumeUserRegistrationMessage = async (): Promise<void> => {
    this.consumeMessage("user-registered");
  };
}
const kafkaServices = new KafkaServices(
  [serviceKafkaDetails.BROKER!],
  processConfig.SERVICE!,
  serviceKafkaDetails.GROUP_ID!,
  logger
);
export default kafkaServices;
