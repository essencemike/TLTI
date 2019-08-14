/**
 * 自定义的 Vue 类型推导
 * 在 interface Vue 中定义实例化的方法
 * 在 interface VueConstructor 中定义 Vue 的静态方法
 * 在 interface ComponentOptions 中定义 Vue 的配置
 */
import Vue from 'vue';

declare module "vue/types/vue" {
  interface Vue {
    $api: any;
    $app_axios: any;
  }
  
  interface VueConstructor {
  }
}

declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {}
}
