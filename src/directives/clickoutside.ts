import Vue from 'vue';
import { on } from './dom';

const isServer = Vue.prototype.$isServer;
const nodeList: any[] = [];
const ctx = '@@clickoutsideContext';

let startClick: any;
let seed = 0;

!isServer && on(document, 'mousedown', (e: any) => (startClick = e));
!isServer && on(document, 'mouseup', (e: any) => {
  nodeList.forEach((node: any) => node[ctx].documentHandler(e, startClick));
});

function createDocumentHandler(el: HTMLElement, binding: any, vnode: any) {
  return function(mouseup: any = {}, mousedown: any = {}) {
    if (!vnode ||
      !vnode.context ||
      !mouseup.target ||
      !mousedown.target ||
      el.contains(mouseup.target) ||
      el.contains(mousedown.target) ||
      el === mouseup.target ||
      ((vnode.context as any).popperElm &&
      ((vnode.context as any).popperElm.contains(mouseup.target) ||
      (vnode.context as any).popperElm.contains(mousedown.target)))) return;

    if (binding.expression &&
      el[ctx].methodName &&
      vnode.context[el[ctx].methodName]) {
      vnode.context[el[ctx].methodName]();
    } else {
      el[ctx].bindingFn && el[ctx].bindingFn();
    }
  };
}

export default {
  bind(el: HTMLElement, binding: any, vnode: any) {
    nodeList.push(el);
    const id = seed++;
    el[ctx] = {
      id,
      documentHandler: createDocumentHandler(el, binding, vnode),
      methodName: binding.expression,
      bindingFn: binding.value,
    };
  },

  update(el: HTMLElement, binding: any, vnode: any) {
    el[ctx].documentHandler = createDocumentHandler(el, binding, vnode);
    el[ctx].methodName = binding.expression;
    el[ctx].bindingFn = binding.value;
  },

  unbind(el: HTMLElement) {
    const len = nodeList.length;

    for (let i = 0; i < len; i++) {
      if (nodeList[i][ctx].id === el[ctx].id) {
        nodeList.splice(i, 1);
        break;
      }
    }
    delete el[ctx];
  },
};


