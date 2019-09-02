<template lang="pug">
.history-wrapper
  .history-header
    span.history-header__title 历史记录
    .history-header__setting
      span(@click="handleClick('today')", :class="{active: tab === 'today'}") 今天
      span(@click="handleClick('week')", :class="{active: tab === 'week'}") 一周
      span(@click="handleClick('all')", :class="{active: tab === 'all'}") 全部
      span(@click="handleClean") 清空所有
  ul.history-list
    template(v-if="list.length === 0")
      li 没有历史数据
    template(v-else)
      li(v-for="(item, index) in list", :key="index")
        .history-list__favicon(:style="getFavicon(item)")
        eui-time(:time="item.lastVisitTime")
        a(target="_blank", rel="noopener noreferrer", :href="item.url") {{ item.title || item.url }}
</template>
<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator';
import moment from 'moment';

// tslint:disable-next-line
const chrome = require('../../chrome/chrome').default;

@Component
export default class History extends Vue {
  static typeName = 'history';

  @Inject() readonly config!: any;

  list: any[] = [];
  tab: string = this.config.conf.historyTabType;

  mounted() {
    this.getHistory();
  }

  getFavicon(item: any) {
    return {
      backgroundImage: `-webkit-image-set(url("chrome://favicon/size/16@1x/${item.url}") 1x,
        url("chrome://favicon/size/16@2x/${item.url}") 2x)`,
    };
  }

  handleClick(type: string) {
    const { storage, conf } = this.config;
    conf.historyTabType = type;
    storage.set({ conf });

    this.tab = type;
    this.getHistory();
  }

  handleClean() {
    // tslint:disable-next-line
    chrome.history.deleteAll(() => {
      this.list = [];
    });
  }

  getHistory() {
    const { tab } = this;
    let microsecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
    if (tab === 'all') {
      microsecondsPerWeek = new Date().getTime() - new Date('2018/02/03 00:00:00').getTime();
    }
    if (tab === 'week') {
      microsecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
    }
    if (tab === 'today') {
      microsecondsPerWeek = new Date().getTime() - new Date(moment().startOf('day').format('yyyy-MM-DD HH:mm:ss')).getTime();
    }

    const oneWeekAgo = new Date().getTime() - microsecondsPerWeek;
    // tslint:disable-next-line
    chrome.history.search({
      text: '',
      startTime: oneWeekAgo,
    }, (historyItems: any[]) => {
      this.list = historyItems;
    });
  }
}
</script>
<style lang="less" scoped>
.history-wrapper {
  padding: 10px;
  overflow: auto;
}

.history-header {
  display: flex;
  padding: 15px 25px 25px;
  font-size: 24px;
  color: #c1c1c1;
  font-size: 18px;
  font-weight: 700;

  &__title {
    flex: 1;
  }

  &__setting {
    font-size: 12px;
    line-height: 25px;
    font-weight: normal;
    color: #868686;
    margin: 0 0 0 10px;

    span {
      display: inline-block;
      color: #868686;
      padding: 1px 4px 0 4px;
      border-radius: 2px;
      line-height: 18px;
      margin: 0 2px;
      transition: background-color 0.3s;
      cursor: pointer;

      &.active, &:hover {
        background-color: #868686;
        color: #fff;
      }
    }
  }
}

.history-list {
  margin: 0 15px;
  line-height: 32px;
  padding: 5px 0;
  background-color: #fff;

  a {
    position: relative;
    display: block;
    flex: 1;
    color: #333;
    padding: 0 10px;
    text-decoration: underline;
    transition: all .3s;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

    &:hover {
      color: #0e693c;
      background-color: #f3f3f3;
    }
  }

  li {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 10px;
    min-height: 32px;
    line-height: 32px;
    font-size: 12px;
  }

  .history-list__favicon {
    display: block;
    width: 16px;
    height: 16px;
    margin-right: 10px;
  }
}
</style>