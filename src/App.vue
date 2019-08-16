<template>
  <div id="app" class="app">
    <router-view />
  </div>
</template>
<script>
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
export default {
  data() {
    return {};
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
