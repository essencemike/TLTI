<template lang="pug">
.tlti.tlti-info
  el-tabs(v-model="type", stretch, @tab-click="handleChange")
    el-tab-pane(label="开源中国", name="oschina")
      .entry-list(v-html="newList")
    el-tab-pane(label="掘金", name="juejin")
      jue-jin(:news-list="juejinList")
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { fetchInterval } from '@/utils';
// tslint:disable-next-line
const chrome = require('../../chrome/chrome').default;

// tslint:disable-next-line
const messageIcon = '<svg class="icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2904"><path d="M768 384C732.672 384 704 412.672 704 448 704 483.328 732.672 512 768 512 803.328 512 832 483.328 832 448 832 412.672 803.328 384 768 384L768 384ZM512 832C474.624 832 438.528 827.648 403.84 820.256L253.184 910.816 255.2 762.368C139.712 692.928 64 578.112 64 448 64 235.936 264.576 64 512 64 759.424 64 960 235.936 960 448 960 660.096 759.424 832 512 832L512 832ZM512 0C229.248 0 0 200.608 0 448 0 589.408 75.04 715.328 192 797.408L192 1024 416.288 887.904C447.328 893.024 479.264 896 512 896 794.752 896 1024 695.424 1024 448 1024 200.608 794.752 0 512 0L512 0ZM256 384C220.672 384 192 412.672 192 448 192 483.328 220.672 512 256 512 291.328 512 320 483.328 320 448 320 412.672 291.328 384 256 384L256 384ZM512 384C476.672 384 448 412.672 448 448 448 483.328 476.672 512 512 512 547.328 512 576 483.328 576 448 576 412.672 547.328 384 512 384L512 384Z" p-id="2905"></path></svg>';
// tslint:disable-next-line
const juejinParams = '{"operationName":"","query":"","variables":{"first":20,"after":"","order":"POPULAR"},"extensions":{"query":{"id":"21207e9ddb1de777adeaca7a2fb38030"}}}';

@Component
export default class TltiInfo extends Vue {
  type: string = 'oschina';
  newType: string = '';
  visible: boolean = true;
  newPage: number = 1;
  mount: boolean = false;
  newList: any = '';
  juejinList: any = '';

  mounted() {
    this.mount = true;
    this.newList = this.getNewListStore();
    this.getNewsList();
  }

  beforeDestroy() {
    this.mount = false;
    this.juejinList = '';
    this.newList = '';
  }

  handleChange(tab: any, event: any) {
    if (tab.name === 'juejin') {
      this.getJuejinList();
    }

    if (tab.name === 'oschina') {
      this.getNewsList();
    }
  }

  /**
   * 获取本地缓存中的数据
   * @params type String = 'osc-list' | 'juejin-list'
   */
  getNewListStore(type: string = 'osc-list') {
    const { newType } = this;
    const list = localStorage.getItem(`${type}${newType}`) || 'null';
    return type === 'juejin-list' ? JSON.parse(list) : list;
  }

  getNewsList() {
    const storage = chrome.storage.sync;
    const conf: any = {};
    const { newType, newPage, visible } = this;
    const newList = this.getNewListStore();
    if (!visible && newList) return;
    conf.oscType = newType;
    storage.set({ conf });
    fetchInterval({
      url: `http://www.oschina.net/action/ajax/get_more_news_list?newsType=${newType}&p=${newPage}`,
      intervals: 1,
    }).then((response) => {
      if (!this.mount) return;
      response = (response as string).replace(/<a\b[^>]+\bhref="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (node, url, text) => {
        if (/^\//.test(url)) {
          node = `<a href="https://www.oschina.net${url}" class="title">${text}</a>`;
        }
        return node;
      }).replace(/<img\b[^>]+\bsrc="([^"]*)"[^>]/gi, (node, url) => {
        if (/^\//.test(url)) {
          return node.replace(url, `https://static.oschina.net${url}`);
        }
        return node;
      }).replace(/<svg[\s\S]*?<\/svg>/gi, () => {
        return messageIcon;
      });

      this.newList = response;
      localStorage.setItem(`osc-list${newType}`, response as any);
    }).catch(() => {
      if (!this.mount) return;
      this.newList = this.getNewListStore() || '请求错误，请检查网络！';
    });
  }

  getJuejinList() {
    const { newType, visible } = this;
    const newList = this.getNewListStore('juejin-list');
    if (!visible && newList) return;
    fetchInterval({
      url: 'https://web-api.juejin.im/query',
      intervals: 1,
      params: {
        method: 'POST',
        headers: {
          'X-Agent': 'Juejin/Web',
          'Content-Type': 'application/json',
        },
        body: juejinParams,
      },
    }).then((response) => {
      // 所有文章
      const res = JSON.parse(response as string);
      const edges = res.data.articleFeed.items.edges;
      this.juejinList = edges;
      localStorage.setItem(`juejin-list${newType}`, JSON.stringify(edges));
    }).catch(() => {
      this.juejinList = this.getNewListStore('juejin-list') || '请求错误，请检查网络！';
    });
  }
}
</script>
<style lang="less">
.tlti-info {
  flex: 0 0 auto;
  width: 364px;
  background-color: #fff;

  & /deep/ .el-tabs__header {
    margin: 0;
  }

  & /deep/ .el-tabs,
  & /deep/ .el-tab-pane {
    height: 100%;
  }

  & /deep/ .el-tabs__item {
    height: 44px;
  }

  & /deep/ .el-tabs__content {
    height: calc(100% - 44px);
  }
}

.tlti-navbar {
  display: flex;
  align-items: center;
  min-height: 42px;
  background-color: #fff;
  border-radius: 2px;
  border-bottom: 1px solid #eee;
  z-index: 600;
}

.entry-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-size: 14px;
  padding-bottom: 15px;
  overflow: auto;

  & /deep/ .item {
    flex: 1 1 auto;
    padding: 8px 10px;
    border-bottom: 1px dashed #ececec;
    background-color: #fff;
    transition: all .3s;
    &:hover {
      background: #f7f7f7;
      .summary:after {
        background: linear-gradient(to right, rgba(255, 255, 255, 0), #f7f7f7 96%);
      }
    }

    .title {
      font-size: 14px;
      line-height: 18px;
      text-decoration: none;
      font-weight: bold;
      color: #333;
      display: block;
      transition: color .3s;
      &:hover {
        color: #0e693c;
      }

      .text-ellipsis {
        display: block;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        position: relative;
      }
    }

    .summary {
      position: relative;
      font-size: 12px;
      max-height: 36px;
      margin: 8px 0;
      color: #a0a0a0;
      overflow: hidden;
      &:after {
        position: absolute;
        bottom: 0;
        content: '';
        right: 0;
        display: block;
        width: 160px;
        height: 20px;
        background: linear-gradient(to right, rgba(255, 255, 255, 0), #fff 96%);
      }
    }

    .thumb {
      max-width: 150px;
      margin-top: -38px;
      margin-left: 11px;
      position: relative;
      z-index: 9;
      float: right;
      img {
        max-height: 40px;
        overflow: hidden;
      }
    }

    .from {
      a, img, span, svg:not([class~=hide]) {
        display: inline-block;
        vertical-align: middle;
      }

      svg {
        width: 14px !important;
        height: 12px !important;
        vertical-align: middle;
        path {
          fill: #868686;
        }
      }

      .avatar {
        overflow: hidden;
        display: block;
        width: 14px;
        min-width: 14px;
        max-width: 14px;
        height: 14px;
        border-radius: 12px;
      }

      .mr {
        margin-right: 15px;
        font-size: 9px;
        color: #9d9d9d;
        font-weight: normal;
        vertical-align: middle;

        a {
          vertical-align: initial;
          color: #a0a0a0;
          margin-left: 5px;
          margin-right: 5px;
          &:hover {
            color: #0e693c;
          }
        }
      }

      a {
        text-decoration: none;
      }
    }
  }
}
</style>
