/**
 * 路由默认配置，路由表并不从此注入
 */
export const ROUTER_DEFAULT_CONFIG = {
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ x: 0, y: 0 }),
};
