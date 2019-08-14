// 翻译 router.meta.title, 主要是用在面包屑，侧边栏导航
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export class RouterTitleMixin extends Vue {
  generateTitle(title: string) {
    const hasKey = this.$te(`route.${title}`);
    const translatedTitle = this.$t(`route.${title}`);

    return hasKey ? translatedTitle : title;
  }
}
