<template lang="pug">
.layout
  .navbar
    .logo TLTI
    router-link.nav-router.nav-list(to="/home", active-class="nav-router-active") 导航
    router-link.nav-router.github-trending(to="github", active-class="nav-router-active") Github 趋势榜
    router-link.nav-router.chrome-history(to="history", active-class="nav-router-active") 历史记录
    .app-menu
      i.el-icon-more(@click="show")
      ul.item-list(v-clickoutside="hide", v-show="panel")
        li.item.section
          .title 应用选项
        li.item
          .title 在新标签页显示
          el-switch(v-model="newtabs", @change="onChange")
        li.item.divider
          el-divider
        li.item.section
          .title 关于应用
        li.item(@click="handleOpen")
          .title 问题帮助
        li.item(@click="openSource")
          .title 开源许可
        li.item
          .title
            a(href="https://github.com/essencemike/TLTI/issues", target="_blank") 意见反馈
        li.item
          .title
            a(href="https://github.com/essencemike/TLTI", target="_blank") 应用主页
  .main-wrapper
    tlti-info
    .tlti.tlti-other
      transition(name="fade", mode="out-in")
        router-view
  el-dialog(
    title="问题与帮助",
    :visible.sync="dialogVisible",
    :before-close="handleClose"
  )
    .content
      ul.help-list(style="transform: translate(0px, 0px) translateZ(0px)")
        li.help-item
          .question
            .icon
            .text 为什么一打开新标签页就显示TLTI？如何取消？
          .answer 为使用户能更便捷地发现内容，TLTI被设计为一款新标签页插件，如果不想在新标签页显示，可以在界面右上角的菜单中取消「在新标签页显示」。
        li.help-item
          .question
            .icon
            .text 为什么取消「在新标签页显示」后其它的新标签页插件还是不能显示？
          .answer 浏览器官方并没有提供动态设置新标签页占用的接口，所以这里的取消「在新标签页显示」也仅仅是让页面跳转到原生新标签页而已。若之前已经装过新标签页插件，可以先卸载原有插件，待TLTI安装成功后再安装，这时TLTI就会被覆盖。
    span.dialog-footer(slot="footer")
      el-button(type="primary", @click="dialogVisible = false") 关闭
</template>
<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator';

import TltiInfo from './TltiInfo.vue';

@Component({
  components: {
    TltiInfo,
  },
})
export default class Layout extends Vue {
  @Inject() readonly config!: any;
  newtabs: boolean = this.config.conf.isNewTab;
  panel: boolean = false;
  dialogVisible: boolean = false;

  onChange() {
    const { storage, conf } = this.config;
    conf.isNewTab = !conf.isNewTab;
    storage.set({ conf }, () => {
      this.newtabs = conf.isNewTab;
    });
  }

  show() {
    this.panel = true;
  }

  hide() {
    this.panel = false;
  }

  openSource() {
    const text = '本项目的开源许可是 MIT, 站在巨人的肩膀上，感谢开源中国， 掘金，以及一系列的第三方开源库。';
    this.$alert(text, '开源许可', {
      confirmButtonText: '关闭',
    });
  }

  handleOpen() {
    this.dialogVisible = true;
  }

  handleClose() {
    this.dialogVisible = false;
  }
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
    margin-left: 10px;
  }

  .chrome-history {
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
  /* display: none; */

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

.content {
  position: relative;
  width: 100%;
  height: 336px;
  overflow: hidden;
}
.help-item {
  .question {
    display: flex;
    margin: 12px 0 6px;
    font-size: 14px;
    line-height: 2;
    font-weight: 700;
    color: #333;

    &:first-child {
      margin-top: 0;
    }

    .icon {
      flex: 0 0 auto;
      margin: 6px 12px 0 0;
      width: 12px;
      height: 12px;
      background-image: url('~@/assets/16x16.png');
      background-repeat: no-repeat;
      background-size: cover;
    }
  }
  .answer {
    padding: 0 0 12px 25px;
    font-size: 15px;
    line-height: 2; 
  }
}
</style>
