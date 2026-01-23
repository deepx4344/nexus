import { createProxyMiddleware } from "http-proxy-middleware";
import processConfig from "./env.js";
import { logger } from "./logger.js";

const SERVICES: typeof processConfig.SERVICES = processConfig.SERVICES;

const apiGatewayProxy = createProxyMiddleware({
  target: SERVICES.FALLBACK,
  changeOrigin: true,
  router: (req) => {
    logger.info(`Attempting to route to ${req.url}`);
    if (req.url?.startsWith("/users")) return SERVICES.USERS;
    if (req.url?.startsWith("/auth")) return SERVICES.AUTH;
    if (req.url?.startsWith("/email")) return SERVICES.EMAIL;
    if (req.url?.startsWith("/payment")) return SERVICES.PAYMENT;
    if (req.url?.startsWith("/order")) return SERVICES.ORDER;
    if (req.url?.startsWith("/product")) return SERVICES.PRODUCT;
  },
  logger: logger,
});

export default apiGatewayProxy;
