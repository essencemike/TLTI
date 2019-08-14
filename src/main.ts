import Vue from 'vue';

// 引入第三方组件库
import {
  LocaleProvider,
  message,
  Modal,
  notification,
  Skeleton,
  Icon,
  Switch,
  Divider,
  Tabs,
} from 'ant-design-vue';

// 引入样式
import 'normalize.css';
import 'font-awesome/css/font-awesome.min.css';
// import 'element-ui/lib/theme-chalk/index.css';
import '@/styles/index.less';

// 引入所有的公共组件
import '@/components';

// 引入所有的公共指令
import '@/directives';

// 引入所有的公共过滤器
import '@/filters';

// 引入插件
import router from '@/plugins/router';
import store from '@/plugins/store';
// import inject from '@/plugins/inject';

import i18n from '@/locale';

import App from './App.vue';

Vue.config.productionTip = false;

Vue.prototype.$message = message;
Vue.prototype.$notification = notification;
Vue.prototype.$info = Modal.info;
Vue.prototype.$success = Modal.success;
Vue.prototype.$error = Modal.error;
Vue.prototype.$warning = Modal.warning;
Vue.prototype.$confirm = Modal.confirm;

Vue.use(LocaleProvider);
Vue.use(Skeleton);
Vue.use(Icon);
Vue.use(Switch);
Vue.use(Tabs);
Vue.use(Tabs.TabPane);
Vue.use(Divider);

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
