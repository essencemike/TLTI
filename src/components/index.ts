import Vue from 'vue';

/**
 * components 组件的文件目录格式
 * ComponentName
 *  - index.vue
 * 组件目录以及文件全部以 PascalCase 格式命名
 * 所有公共组件统一在此处引入注册
 */
Vue.component('JueJin', () => import('@/components/JueJin/index.vue'));
