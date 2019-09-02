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

// tslint:disable-next-line
const chrome = require('../chrome/chrome').default;

// tslint:disable-next-line
const storage = chrome.storage.sync;

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

storage.get(['tlticonfig', 'visible', 'conf', 'dbs'], (items: any) => {
  // 默认订单菜单，新闻是否展示， 目前全部展示，TODO: 后续会增加显示，隐藏的功能
  if (!items.visible) items.visible = {};
  if (items.visible.header === undefined) items.visible.header = true;
  if (items.visible.newBar === undefined) items.visible.newBar = true;

  // 数据存储
  if (!items.dbs) items.dbs = {};
  if (items.dbs.nav === undefined) items.dbs.nav = [];

  // 默认选中的栏目
  if (!items.conf) items.conf = {};
  // 默认是否在新标签页显示
  if (items.conf.isNewTab === undefined) items.conf.isNewTab = true;
  // 默认是否在新标签页显示
  if (items.conf.historyTabType === undefined) items.conf.historyTabType = 'today';
  // 默认展示页面
  if (items.conf.pageType) items.conf.pageType = 'document';
  // 默认新闻展示tab类型
  if (items.conf.oscType) items.conf.oscType = '';

  // Github 趋势榜设置
  if (!items.conf.githubSince) items.conf.githubSince = '';
  if (!items.conf.githubLang) items.conf.githubLang = '';

  items.storage = storage;

  if (!/#normal$/.test(location.hash) && items.conf.isNewTab === false) {
    // tslint:disable-next-line
    chrome.tabs.update({ url: 'chrome-search://local-ntp/local-ntp.html' });
  } else {
    new Vue({
      router,
      store,
      i18n,
      render: (h) => h(App, { props: { config: items } }),
    }).$mount('#app');
  }
});
