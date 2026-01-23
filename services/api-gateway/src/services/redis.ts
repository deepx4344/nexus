import { createClient, type RedisClientType } from "redis";
import processConfig from "../configs/env.js";

class RedisService {
  private client: RedisClientType;
  private constructor(client: RedisClientType) {
    this.client = client;
  }
  public static async connect(): Promise<RedisService> {
    const serviceInstance = new RedisService(
      createClient({
        url: processConfig.REDIS_URI,
      }) as RedisClientType
    );
    await serviceInstance.client.connect();
    return serviceInstance;
  }
  isTokenBlacklisted = async (token: string): Promise<boolean> => {
    let format = `accessBlacklist:${token}`;
    const blacklisted: boolean = !!(await this.client.get(format));
    return blacklisted;
  };
}

const redisService = await RedisService.connect();
export default redisService;
