/**
 * 全局的路由拦截配置
 */
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

import { appRouter } from '@/routes';
import store from '@/plugins/store';

NProgress.configure({ showSpinner: false });


export function routerBeforeEachFn(to: any, form: any, next: any) {
  // 显示进度条
  NProgress.start();

  next();

  NProgress.done();
}

export function routerAfterEachFn(to: any, form: any) {
  // 不保留滚动位置
  const el = document.querySelector('.app-main-wrapper');
  if (el) {
    setTimeout(() => {
      el.scrollTop = 0;
    }, 300);
  }
  NProgress.done();
}
