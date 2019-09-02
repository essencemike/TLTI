<template>
  <div id="app" class="app">
    <router-view />
  </div>
</template>
<script>
import moment from 'moment';
import 'moment/locale/zh-cn';

// tslint:disable-next-line
const chrome = require('../chrome/chrome').default;

moment.locale('zh-cn');
export default {
  props: {
    config: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      config: this.config,
    };
  },

  provide() {
    return {
      config: this.config,
    };
  },

  mounted() {
    const { config } = this;
    // tslint:disable-next-line
    chrome.storage.onChanged.addListener((changes) => {
      Object.keys(changes).forEach((key) => {
        config[key] = changes[key].newValue;
      });
    });
    this.config = config;
  },
};
</script>

<style lang="less">
html, body {
  width: 100%;
  height: 100%;
  min-width: 960px;
  overflow: hidden;
}
.app {
  width: 100%;
  height: 100%;
  font-size: 16px;
  font-family: Helvetica Neue, Helvetica, STHeiti, Microsoft YaHei, Verdana, Arial, Tahoma, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
