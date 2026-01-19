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
  isBlacklisted = async (token: string, access: boolean): Promise<boolean> => {
    let format: string;
    if (access) {
      format = `accessBlacklist:${token}`;
    } else {
      format = `refreshBlacklist:${token}`;
    }
    const blacklisted: boolean = !!(await this.client.get(format));
    return blacklisted;
  };
  setTokenBlacklisted = async (
    token: string,
    exp: any,
    access: boolean
  ): Promise<void> => {
    let format: string;
    if (access) {
      format = `accessBlacklist:${token}`;
    } else {
      format = `refreshBlacklist:${token}`;
    }
    await this.client.set(format, "1", {
      expiration: exp,
    });
  };
}

const redisService = await RedisService.connect();
export default redisService;
