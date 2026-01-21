import { createProxyMiddleware } from "http-proxy-middleware";
import processConfig from "./env.js";

const SERVICES: typeof processConfig.SERVICES = processConfig.SERVICES;

const apiGatewayProxy = createProxyMiddleware({
  target: SERVICES.FALLBACK,
  changeOrigin: true,
  // pathRewrite: {
  //   "^/api": "",
  // },
  router: (req) => {
    console.log("Attempting to route to ", req.url)
    if (req.url?.startsWith("/users")) return SERVICES.USERS;
    if (req.url?.startsWith("/auth")) return SERVICES.AUTH;
    if (req.url?.startsWith("/email")) return SERVICES.EMAIL;
  },
  logger: console,
});

export default apiGatewayProxy;
