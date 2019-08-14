import Vue from 'vue';
import Router from 'vue-router';
import routes from '@/routes';
import { ROUTER_DEFAULT_CONFIG, routerBeforeEachFn, routerAfterEachFn } from '@/config';

Vue.use(Router);

// 注入默认配置和路由表
const routerInstance = new Router({
  ...ROUTER_DEFAULT_CONFIG,
  // mode: 'history',
  routes,
});

// 注入拦截器
routerInstance.beforeEach(routerBeforeEachFn);

routerInstance.afterEach(routerAfterEachFn);

export default routerInstance;
