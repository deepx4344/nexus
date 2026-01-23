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
  isTokenBlacklisted = async (token: string, access: boolean): Promise<boolean> => {
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
    exp: number,
    access: boolean
  ): Promise<void> => {
    let format: string;
    if (access) {
      format = `accessBlacklist:${token}`;
    } else {
      format = `refreshBlacklist:${token}`;
    }
    await this.client.set(format, "1", {
      expiration: {
        type: "EX",
        value: exp,
      },
    });
  };
  setPasswordRecoveryCode = async (
    userId: string,
    code: number
  ): Promise<void> => {
    const format: string = `passwordRec:${userId}`;
    await this.client.set(format, code, {
      expiration: {
        type: "EX",
        value: 600,
      },
    });
  };
  getPasswordRecoveryCode = async (userId: string): Promise<number | null> => {
    const format: string = `passwordRec:${userId}`;
    const code: number | null = Number(await this.client.get(format));
    return code;
  };
}

const redisService = await RedisService.connect();
export default redisService;
