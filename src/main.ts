import Vue from 'vue';

// 引入第三方组件库
import {
  Loading,
  MessageBox,
  Message,
  Notification,
  Icon,
  Switch,
  Divider,
  Tabs,
  TabPane,
  Select,
  Option,
  OptionGroup,
  Row,
  Col,
  Card,
} from 'element-ui';

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

Vue.prototype.$ELEMENT = { size: 'medium', zIndex: 3000 };

Vue.use(Icon);
Vue.use(Switch);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Divider);
Vue.use(Select);
Vue.use(Option);
Vue.use(OptionGroup);
Vue.use(Row);
Vue.use(Col);
Vue.use(Card);

Vue.use(Loading.directive);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
