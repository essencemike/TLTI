import Vue from 'vue';
import VueI18n from 'vue-i18n';


import enLocale from './en';
import zhLocale from './zh';

Vue.use(VueI18n);

// 自动设置语言
const navLang = navigator.language;
const localLang = (navLang === 'zh' || navLang === 'en') ? navLang : false;
// const lang = Cookies.get('language') || localLang || 'zh';
const lang = 'zh';

const messages = {
  en: {
    ...enLocale,
    // ...elementEnLocale,
  },
  zh: {
    ...zhLocale,
    // ...elementZhLocale,
  },
};

const i18n = new VueI18n({
  locale: lang,
  messages,
});

export default i18n;
