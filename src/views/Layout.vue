<template lang="pug">
.layout
  .navbar
    .logo TLTI
    router-link.nav-router.nav-list(to="/home", active-class="nav-router-active") 导航
    router-link.nav-router.github-trending(to="github", active-class="nav-router-active") Github 趋势榜
    .app-menu
      i.el-icon-more
      ul.item-list
        li.item.section
          .title 应用选项
        li.item
          .title 在新标签页显示
          el-switch(v-model="newtabs", @change="onChange")
        li.item.divider
          el-divider
        li.item.section
          .title 关于应用
        li.item
          .title 问题帮助
        li.item
          .title 开源许可
        li.item
          .title 意见反馈
        li.item
          .title 应用主页
  .main-wrapper
    tlti-info
    .tlti.tlti-other
      transition(name="fade", mode="out-in")
        router-view
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import TltiInfo from './TltiInfo.vue';

@Component({
  components: {
    TltiInfo,
  },
})
export default class Layout extends Vue {
  newtabs: boolean = true;

  onChange() {}
}
</script>
<style lang="less" scoped>
.layout {
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #eceff1;
  overflow: hidden;
}

.navbar {
  position: relative;
  display: flex;
  flex: 0 0 auto;
  height: 54px;
  padding: 0 30px 0 20px;
  background-color: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, .1);
  z-index: 500;
  align-items: center;
  cursor: default;
  user-select: none;
  box-shadow: 0 0 15px 10px rgba(0, 0, 0, .03);

  .logo {
    cursor: pointer;
    text-transform: uppercase;
    color: #007fff;
    font-weight: 600;
    font-size: 32px;
    margin-right: auto;
  }

  .nav-router {
    padding: 6px 15px;
    font-size: 14px;
    color: #007fff;
    cursor: pointer;
    font-weight: 400;
    text-decoration: none;

    &:hover, &.nav-router-active {
      background-color: rgba(0, 0, 0, .05);
    }

    &:focus, &:hover {
      text-decoration: none;
    }
  }

  .github-trending {
    margin-right: 15px;
    margin-left: 10px;
  }
}

.tlti-other {
  flex: 1 1 auto;
}

.app-menu {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 15px;
  color: #767e8d;
  cursor: pointer;

  i.anticon-ellipsis {
    font-size: 24px;
    font-weight: 600;

    &:hover {
      color: rgba(0, 0, 0, .8);
    }
  }
}

.item-list {
  position: absolute;
  top: 100%;
  right: -26px;
  background-color: #fff;
  border-top: 1px solid rgba(0, 0, 0, .1);
  border-radius: 2px;
  box-shadow: 0 1px 2px 0 rgba(34, 42, 48, .1);
  overflow: hidden;
  display: none;

  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 216px;
    height: 48px;
    padding: 0 18px;

    &.section {
      display: block;
      height: 36px;
      line-height: 36px;
      font-size: 12px;
      color: #c2c5cd;
      cursor: default;
    }

    &.divider {
      height: 0;
      padding: 0;
    }

    &:hover:not(.divider):not(.section) {
      color: #000;
      background-color: #fbfbfb;
    }
  }
}

.main-wrapper {
  flex: 1 1 auto;
  display: flex;
  position: relative;
  overflow: hidden;
}
</style>
