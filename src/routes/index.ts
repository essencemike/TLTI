/**
 * 在这里配置路由信息
 * 路由中 meta 除了原生参数外可配置的参数:
 * meta: {
 *  hidden: (false) 设为true后在左侧菜单不会显示该页面选项
 *  title: '' i18n 国际化
 *  alwaysShow: (false) 设为true后，无论children有几个都显示父页面，设为false后，只有children大于1个的时候才显示父页面
 *  activeMenu: '' 当菜单隐藏时， 设置他的高亮菜单
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  href: '' 设置此链接后，点击将打开新的页面
 * }
 */
import Layout from '@/views/Layout.vue';

// 不作为 Layout 组件的子页面展示的页面单独写，如下：
// export const login = {
//   path: '/login',
//   name: 'Login',
//   component: () => import('@/views/Login/Login.vue'),
// };

export const appRouter = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
      },
      {
        path: 'github',
        name: 'Github',
        component: () => import('@/views/Github.vue'),
      },
      {
        path: 'history',
        name: 'History',
        component: () => import('@/views/History.vue'),
      },
    ],
  },
  { path: '*', redirect: '/', hidden: true },
];

export default [
  ...appRouter,
];
