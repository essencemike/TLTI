
import Vue from 'vue';

declare interface Global {
  vbus: Vue;
}

declare global {
  interface Window {
    GLOBAL: Global;
    mozRequestAnimationFrame?: any;
    msRequestAnimationFrame?: any;
    detachEvent?: any;
    attachEvent?: any;
  }

  interface Document {
    documentMode?: any;
    detachEvent?: any;
    attachEvent?: any;
  }

  interface HTMLElement {
    attachEvent?: any;
    detachEvent?: any;
    currentStyle?: any;
    filters?: any;
  }
}
