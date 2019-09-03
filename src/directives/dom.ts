import Vue from 'vue';

const isServer = Vue.prototype.$isServer;

export  const on = (function() {
  if (!isServer && document.addEventListener) {
    return (element: Element | Document | Window | HTMLElement, event: string, handler: any) => {
      if (element && event && handler) {
        element.addEventListener(event, handler, true);
      }
    };
  } else {
    return (element: Window | Document | HTMLElement, event: string, handler: any) => {
      if (element && event && handler) {
        element.attachEvent(`on${event}`, handler);
      }
    };
  }
})();
