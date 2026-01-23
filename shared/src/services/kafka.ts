import { KafkaJS } from "@confluentinc/kafka-javascript";
import type { Logger } from "pino";
import {
  SchemaRegistryClient,
  AvroSerializer,
  AvroDeserializer,
  SerdeType,
} from "@confluentinc/schemaregistry";
import EventEmitter from "events";
import {
  KafkaTopicToInterfaceMapping,
  KafkaTopicToSchemaMapping,
} from "../utils/index.js";
import type { UserRegistationInterface } from "../types/index.js";

const { Kafka } = KafkaJS;

export class UnifiedKafkaService {
  public readonly eventEmitter: EventEmitter;
  private kafka: KafkaJS.Kafka;
  private producer: KafkaJS.Producer;
  private consumer: KafkaJS.Consumer;
  private logger: Logger;
  private serializer: AvroSerializer;
  private deserializer: AvroDeserializer;
  private registry = new SchemaRegistryClient({
    baseURLs: ["http://localhost:8081"],
  });
  private mapTopicToSchema = (topic: string): string => {
    return KafkaTopicToSchemaMapping[`${topic as keyof typeof KafkaTopicToSchemaMapping}`];
  };
  private mapTopicToInterface = (topic: string): any => {
    return KafkaTopicToInterfaceMapping[`${topic as keyof typeof KafkaTopicToInterfaceMapping}`];
  };
  constructor(
    brokers: string[],
    clientId: string,
    groupId: string,
    logger: Logger
  ) {
    this.kafka = new Kafka({
      kafkaJS: {
        brokers: brokers,
        clientId: clientId,
      },
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ "group.id": groupId });
    this.logger = logger;
    this.serializer = new AvroSerializer(this.registry, SerdeType.VALUE, {
      useLatestVersion: true,
    });
    this.deserializer = new AvroDeserializer(
      this.registry,
      SerdeType.VALUE,
      {}
    );
    this.eventEmitter = new EventEmitter();
  }
  protected async connect(): Promise<void> {
    await this.producer.connect();
    await this.consumer.connect();
    this.logger.info("Kafka Services Connected");
  }
  protected async disconnect(): Promise<void> {
    await this.producer.disconnect();
    await this.consumer.disconnect();
    this.logger.info("Kafka Services disconnected");
  }
  protected produceMessage = async (topic: string, data: UserRegistationInterface): Promise<void> => {
    await this.registry.register(`${topic}-value`, {
      schemaType: "AVRO",
      schema: this.mapTopicToSchema(topic),
    });

    const serializedData = await this.serializer.serialize(topic, data);

    this.producer.send({
      topic: topic,
      messages: [{ value: serializedData }],
    });
  };
  protected consumeMessage = async (topic: string): Promise<void> => {
    const expectedTopicType = this.mapTopicToInterface(topic);
    await this.consumer.subscribe({ topic: topic });
    await this.consumer.run({
      eachMessage: async ({ message }) => {
        const rawMessage = message.value as Buffer;
        try {
          const decodedValue = (await this.deserializer.deserialize(
            topic,
            rawMessage
          )) as Omit<ReturnType<typeof expectedTopicType>, "topic">;
          this.eventEmitter.emit("message.received", {
            ...decodedValue,
            topic: topic,
          }) as typeof expectedTopicType;
          this.logger.info(`Message decoded ${decodedValue}`);
        } catch (err) {
          this.logger.error(`Failed to deserialize message: ${err}`);
        }
      },
    });
  };
}
 