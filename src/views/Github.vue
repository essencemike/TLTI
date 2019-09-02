<template lang="pug">
.tlti.wrapper
  .source-navbar
    .source-box
      .source-title
        a(target="_blank", rel="noopener noreferrer", href="https://github.com/trending") Github Trending
      .status(v-if="loading")
        i.el-icon-loading
      .since-select
        el-select(v-model="since", style="width: 96px", @change="handleSinceChange")
          el-option(v-for="item in option", :value="item.value", :label="item.label")
      .lang-select
        el-select(v-model="lang", style="width: 140px", filterable, @change="handleLangChange")
          el-option-group(key="hot", label="热门语言")
            el-option(v-for="item in suggestItems", :value="item.value", :label="item.label")
          el-option-group(key="all", label="所有语言")
            el-option(v-for="item in optionLang", :value="item.value", :label="item.label")
  .entry-list.github-trending__content
    el-row(:gutter="10")
      el-col(:span="12", v-for="(item, index) in content", :key="index")
        el-card(shadow="hover")
          h3
            a(:href="item.html_url") {{ item.full_name }}
          .repo-description
            div {{ item.description }}
          div
            span.repo-language(v-if="item.language")
              span(:style="{backgroundColor: item.color}")
              | {{ item.language }}
            span.repo-star
              svg(viewBox="0 0 14 16" version="1.1" width="14" height="16" role="img")
                path(fillRule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z")
              span {{ item.stargazers_count }}
            span.repo-forked
              svg(viewBox="0 0 10 16", version="1.1", width="10", height="16", role="img")
                path(fillRule="evenodd" d="M8 1a1.993 1.993 0 0 0-1 3.72V6L5 8 3 6V4.72A1.993 1.993 0 0 0 2 1a1.993 1.993 0 0 0-1 3.72V6.5l3 3v1.78A1.993 1.993 0 0 0 5 15a1.993 1.993 0 0 0 1-3.72V9.5l3-3V4.72A1.993 1.993 0 0 0 8 1zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3 10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3-10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z")
              span {{ item.forked }}
            span.repo-todayStar
              svg(viewBox="0 0 14 16" version="1.1" width="14" height="16" role="img")
                path(fillRule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z")
              span {{ item.todayStar }}
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import cheerio from 'cheerio';
import { fetchInterval, fetchTimely } from '@/utils';
import optionLang from './../source/trending.json';

const githubList = localStorage.getItem('github-list');

@Component
export default class Github extends Vue {
  option: any[] = [
    { label: '今天', value: '' },
    { label: '本周', value: 'weekly' },
    { label: '本月', value: 'monthly' },
  ];
  loading: boolean = false;
  content: any = githubList ? JSON.parse(githubList) : null;
  optionLang: any[] = optionLang;
  suggest: string[] = ['javascript', 'css', 'html', 'typescript', 'vue', 'go', 'python'];
  since: string = '';
  lang: string = '';
  mount: boolean = false;

  get suggestItems() {
    return this.optionLang.filter((item: any) => this.suggest.includes(item.value));
  }

  beforeDestroy() {
    this.mount = false;
  }

  mounted() {
    this.mount = true;
    this.getTrending();
  }

  getURL() {
    const { since, lang } = this;
    let url = 'https://github.com/trending';
    if (lang) url = `${url}/${lang}`;
    if (since) url = `${url}?since=${since}`;
    return url;
  }

  getTrending(type?: string) {
    let dataType = type;
    let localContent = localStorage.getItem('github-list');
    if (!localContent) dataType = 'select'; // 判断是否直接选择
    else {
      localContent = JSON.parse(localContent);
    }

    this.loading = true;
    const getData = dataType === 'select'
      ? fetchTimely(this.getURL())
      : fetchInterval({
        url: this.getURL(),
        intervals: 3,
        intervalsType: 'github-trending',
      });

    getData.then((response) => {
      (response as any).replace(/<body\b[^>]*>([\s\S]*?)<\/body>/gi, (node: any, body: any) => {
        response = body;
        return node;
      });

      // tslint:disable-next-line
      response = (response as any).replace(/<a\b[^>]+\bhref="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (node: any, url: any, text: any) => {
        if (/^\//.test(url)) {
          node = `<a href="https://github.com${url}">${text}</a>`;
        }
        return node;
      });

      const resultData: any[] = [];
      const $ = cheerio.load(response as string);

      $('.Box-row').each((idx, item) => {
        // 不需要头像，避免被和谐
        /* tslint:disable */
        const fullName = $(item).find('h1 a').text().replace(/(\n|\s)/g, '');
        const href = $(item).find('h1 a').attr('href').replace(/(\n|\s)/g, '');
        const language = $(item).find('span[itemprop=programmingLanguage]').text().replace(/(\n|\s)/g, '');
        const languageColor = $(item).find('span.repo-language-color');
        const stargazersCount = $(item).find('svg[aria-label="star"].octicon.octicon-star').parent().text().replace(/(\n|\s)/g, '');
        const forked = $(item).find('svg[aria-label="fork"].octicon.octicon-repo-forked').parent().text().replace(/(\n|\s)/g, '');
        const todayStar = $(item).find('.float-sm-right svg.octicon.octicon-star').parent().text().replace(/(\n|,)/g, '').trim();
        const description = $(item).find('p.text-gray').text().replace(/(\n)/g, '').trim();
        /* tslint:enable */

        let color = '';
        if (language && languageColor && languageColor.css) {
          color = languageColor.css('background-color');
        }

        resultData.push({
          full_name: fullName,
          language,
          color,
          description,
          forked,
          stargazers_count: stargazersCount,
          todayStar,
          html_url: href,
          rank: idx + 1,
        });
      });

      if (!resultData) return;
      localStorage.setItem('github-list', JSON.stringify(resultData));
      if (!this.mount) return;
      this.loading = false;
      this.content = resultData;
    }).catch(() => {
      this.loading = false;
      if (!this.mount) return;
      this.content = this.content || '请求错误，请检查网络，或者重新刷新请求数据！';
    });
  }

  handleSinceChange(item: string) {
    this.loading = false;
    this.since = item;
    this.getTrending('select');
  }

  handleLangChange(item: string) {
    this.loading = false;
    this.since = item;
    this.getTrending('select');
  }
}
</script>
<style lang="less" scoped>
.wrapper {
  height: 100%;
}

.source-navbar,
.source-navbar .source-box {
  display: flex;
  align-items: center;
}

.source-navbar {
  min-height: 44px;
  background-color: #fff;
  z-index: 250;
  border-left: 1px solid #ececec;
  border-bottom: 1px solid #e8e8e8;
}

.source-box {
  width: 100%;
  padding: 0 20px;
}

.status {
  margin-right: 10px;
}

.source-title {
  flex: 1 1 auto;
  font-size: 24px;
  font-weight: 500;
  color: #808080;

  a {
    color: #808080;
    text-decoration: none;
    cursor: pointer;
    &:hover {
      color: #0080d0;
    }
  }
}

.since-select {
  margin-right: 20px;
}

.github-trending__content {
  height: calc(100% - 44px);
  padding: 10px;
  overflow: auto;

  & /deep/ .el-card {
    margin-bottom: 10px;
  }

  a {
    text-decoration: none;
  }

  h3 a {
    font-size: 14px;
    line-height: 18px;
    font-weight: bold;
    color: #0366d6;
    display: block;
    transition: color .3s;
    &:hover {
      text-decoration: underline;
    }
  }

  .repo-description {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    padding: 8px 0;
    line-height: 20px;
    font-size: 14px;
    height: 66px;
    color: #333;
    margin-right: 20px;
    margin-bottom: 5px;
    overflow: hidden;
  }

  .repo-star, .repo-language, .repo-forked, .repo-todayStar {
    display: inline-block;
    margin-right: 8px !important;

    svg {
      vertical-align: middle;
      margin-right: 5px;
      height: 14px;
      margin-top: -3px;
    }
  }

  .repo-language {
    span {
      border-radius: 50%;
      display: inline-block;
      height: 12px;
      position: relative;
      top: 1px;
      width: 12px;
      margin-right: 5px;
    }
  }
}
</style>