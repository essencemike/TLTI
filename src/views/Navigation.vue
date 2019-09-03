<template lang="pug">
.navigation-wrapper(@click="handleClickContextMenu")
  .nav-header
    | 常用工具导航列表
    small (右键点击（或按住Alt）可以删除，拖动可以调整顺序)
  .nav-box
    .nav-content(ref="navContent")
      a(
        v-for="(item, index) in navContent",
        :key="index",
        target="_top",
        draggable="true",
        :class="{doc: item.type === 'doc'}",
        @contextmenu.prevent="handleContextMenu",
        @dragstart="onDragStart",
        @dragend="onDragEnd",
        @dragOver="onDragOver",
        :href="getHref(item)",
      )
        span
          img(:alt="item.label", @error="handleError", :src="item.icon")
          p {{ item.label }}
          i.keyDown(v-if="optionDown", @click="onKeyDownOption(item)")
      a.add-icon(@click="onShowEdit")
        img(alt="", src="~@/assets/add-icon.png")
  el-dialog(
    title="添加导航",
    :visible.sync="addNavDialog",
    append-to-body,
    destroy-on-close,
    :before-close="handleClose",
  )
    el-form(ref="navForm", :model="navForm", :rules="navRules", label-width="80px")
      el-form-item(label="网址Icon", prop="icon")
        el-input(v-model="navForm.icon", placeholder="请输入网址Icon地址，example: http://example.png")
      el-form-item(label="网址标题", prop="label")
        el-input(v-model="navForm.label", placeholder="请输入网址标题")
      el-form-item(label="网址", prop="value")
        el-input(v-model="navForm.value", placeholder="请输入网址")
    .example-header
      | 已收集的导航列表
      small （点击选择）
    .example-list
      span(v-for="(item, index) in navs", :key="index", @click="handleAddNav(item)")
        img(:alt="item.label", @error="handleError", :src="item.icon")
        p {{ item.label }}
    span.dialog-footer(slot="footer")
      el-button(@click="handleClose") 取消
      el-button(type="primary", @click="addNav") 确定
</template>
<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator';
import { Form } from 'element-ui';

import website from '@/source/website.json';
import websiteIcon from '@/assets/website.svg';

@Component
export default class Navigation extends Vue {
  static typeName = 'navigation';

  @Inject() readonly config!: any;

  navContent: any[] = this.config.dbs.nav;

  optionDown: boolean = false;

  parentElm: Element | undefined = undefined;
  dragOverElm: Element | undefined = undefined;

  addNavDialog: boolean = false;

  navs: any[] = [];

  navForm: any = {
    label: '',
    value: '',
    icon: '',
  };

  navRules: any = {
    label: [
      { required: true, message: '请输入网址标题', trigger: 'blur' },
    ],
    value: [
      { required: true, message: '请输入网址标题', trigger: 'blur' },
    ],
  };

  beforeDestroy() {
    document.removeEventListener('keydown', this.handleClickOption, true);
    document.removeEventListener('keyup', this.handleClickOptionUp, true);
  }

  mounted() {
    window.addEventListener('resize', this.handleResize, true);
    document.addEventListener('keydown', this.handleClickOption, true);
    document.addEventListener('keyup', this.handleClickOptionUp, true);

    const { navContent } = this;
    const { storage, dbs } = this.config;

    if (navContent.length === 0) {
      const defaultNav = (website[0] && website[0].children) || [];
      navContent.push(...defaultNav);

      dbs.nav = navContent;
      storage.set({ dbs });
      this.navContent = navContent;
    }

    this.$nextTick(() => {
      this.handleResize();
    });
  }

  getHref(item: any) {
    return this.optionDown ? '#' : item.value;
  }

  handleClickOption(e: KeyboardEvent) {
    const key = e.keyCode || e.which || e.charCode;
    if (e.key === 'Alt' || key === 18) {
      this.optionDown = true;
    }
  }

  handleClickOptionUp(e: KeyboardEvent) {
    const key = e.keyCode || e.which || e.charCode;
    if (e.key === 'Alt' || key === 18) {
      this.optionDown = false;
    }
  }

  handleResize() {
    const el = this.$refs.navContent as HTMLElement;
    if (el) {
      this.handleResizeContent(el);
    }
  }

  handleContextMenu(e: Event) {
    e.preventDefault();
    this.optionDown = !this.optionDown;
    return false;
  }

  handleClickContextMenu(e: Event) {
    const { optionDown } = this;
    if (optionDown) {
      e.preventDefault();
    }
    this.optionDown = false;
  }

  handleResizeContent(node: HTMLElement) {
    if (!node) return;
    let width = document.body.clientWidth;
    let rightWidth = width - 363;
    width -= 100;
    if (width > 1024) width = 1024;
    if (width < 600) width = 600;
    if (rightWidth > 1024) rightWidth = 1024;
    if (rightWidth < 600) rightWidth = 600;
    const subWidth = width / 6;
    let paddingHorizontal = (subWidth - 90) / 2;
    if (paddingHorizontal < 20) paddingHorizontal = 20;
    node.style.maxHeight = '504px';
    node.style.width = `${rightWidth}px`;
    const child = node.children;

    for (const c of child) {
      const item = c as HTMLElement;
      if (item) {
        item.style.width = `${subWidth}px`;
        item.style.paddingLeft = `${paddingHorizontal}px`;
        item.style.paddingRight = `${paddingHorizontal}px`;
        const img = item.getElementsByTagName('img');
        if (img && img.length > 0) {
          img[0].style.height = `${img[0].clientWidth}px`;
        }
      }
    }
  }

  onDragStart(e: DragEvent) {
    this.parentElm = (e.target as HTMLElement).parentNode as Element;
    (e.target as Element).classList.add('is-drod');
  }

  onDragEnd(e: DragEvent) {
    const { navContent } = this;
    const { storage, dbs } = this.config;
    const child = this.parentElm!.children;
    (e.target as Element).classList.remove('is-drod');
    let overIndex: number = 0;
    let currentIndex = 0;

    for (let i = 0; i < child.length; i++) {
      if (child[i] === this.dragOverElm) overIndex = i;
      if (child[i] === e.target) currentIndex = i;
    }

    if (currentIndex > -1 && overIndex > -1) {
      const curData = navContent[currentIndex];
      if (currentIndex > overIndex) {
        navContent.splice(currentIndex, 1);
        navContent.splice(overIndex, 0, curData);
      }

      if (currentIndex < overIndex) {
        navContent.splice(overIndex + 1 >= child.length ? overIndex : overIndex + 1, 0, curData);
        navContent.splice(currentIndex, 1);
      }

      dbs.nav = navContent;
      storage.set({ dbs });
    }

    currentIndex = 0;
    overIndex = 0;
  }

  onDragOver(e: DragEvent) {
    this.dragOverElm = e.target as Element;
  }

  handleError(e: any) {
    return e.target.src = websiteIcon;
  }

  onKeyDownOption(item: any) {
    const { storage, dbs } = this.config;
    const { navContent } = this;
    const itemfilter = navContent.filter((editItem) => editItem.value !== item.value);
    dbs.nav = itemfilter;
    storage.set({ dbs });
    this.navContent = itemfilter;
  }

  onShowEdit() {
    this.addNavDialog = true;
    const navs: any[] = [];
    (website || []).forEach((item, i) => {
      if (i !== 0) {
        const children = item.children || [];
        navs.push(...children);
      }
    });
    this.navs = navs;
  }

  handleClose() {
    this.addNavDialog = false;
    this.navs = [];
    this.resetForm();
  }

  resetForm() {
    const form = this.$refs.navForm as Form;
    form && form.resetFields();
    this.navForm = {
      icon: '',
      label: '',
      value: '',
    };
  }

  handleAddNav(item: any) {
    this.navForm = item;
  }

  addNav() {
    const form = this.$refs.navForm as Form;
    const { navContent, navForm } = this;
    const { storage, dbs } = this.config;
    form.validate((valid) => {
      if (valid) {
        const itemfilter = navContent.filter((editItem) => editItem.value === navForm.value);
        if (itemfilter.length > 0) {
          this.addNavDialog = false;
          return true;
        }

        navContent.push(navForm);
        dbs.nav = navContent;
        storage.set({ dbs });
        this.navContent = navContent;
        this.$nextTick(() => {
          this.handleResize();
        });
        // this.resetForm();
        this.addNavDialog = false;
        return true;
      }

      return false;
    });
  }
}
</script>
<style lang="less" scoped>
.navigation-wrapper {
  position: relative;
  overflow: hidden;
  height: 100%;
  display: flex;
  width: 100%;
  flex-direction: column;
  user-select: none;

  .nav-box {
    flex: 1 1;
    align-items: center;
    display: flex;
  }

  .nav-header {
    line-height: 40px;
    padding-left: 20px;
    font-size: 16px;
    font-weight: 500;
    color: gray;

    small {
      color: gray;
      margin-left: 5px;
    }
  }
}

.nav-content {
  display: flex;
  position: relative;
  left: 50%;
  align-content: flex-start;
  transform: translate(-50%, 0);
  flex-flow: row wrap;

  a {
    display: block;
    position: relative;
    cursor: pointer;
    text-decoration: none;
    padding: 0 38px;
    outline: 0;
    top: 0;
    left: 0;
    border: 2px solid transparent;
    border-radius: 4px;
    text-align: center;
    box-sizing: border-box;

    &::before {
      content: '';
      display: block;
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: 9;
      left: 0;
    }

    &.doc img {
      padding: 10px;
    }

    p {
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #333;
      margin: 12px 0;
      font-size: 12px;
    }

    &:hover > img {
      filter: brightness(0.96);
    }

    &:active > img {
      filter: brightness(0.66);
    }

    &.add-icon {
      box-shadow: 0 0 0 0;
    }
  }

  img {
    width: 100%;
    display: block;
    margin-top: 8%;
    filter: brightness(0.99);
    border-radius: 8px;
    transition: filter .3s;
    background: #fff;
    box-shadow: 0 2px 6px rgba(0, 0, 0, .15);
  }

  .keyDown {
    height: 23px;
    width: 23px;
    border-radius: 50%;
    display: block;
    position: absolute;
    background-color: #fff;
    border: 1px solid rgba(27, 31, 35, 0.15);
    box-shadow: 0 3px 12px rgba(27, 31, 35, 0.15);
    top: 0;
    right: 0;
    z-index: 19;

    &::before, &::after {
      content: '';
      display: block;
      position: absolute;
      height: 2px;
      width: 60%;
      top: 10px;
      left: 4px;
      border-radius: 3px;
      background-color: #333;
    }

    &::before {
      transform: rotate(45deg);
    }

    &::after {
      transform: rotate(-45deg);
    }
  }
}

.example-list {
  display: flex;
  flex-flow: row wrap;
  align-content: flex-start;
  padding: 30px 0;
  min-height: 220px;
  max-height: 220px;
  overflow: auto;

  span {
    display: inline-block;
    margin: 0 10px;
    user-select: none;
    cursor: pointer;

    &:hover > img {
      filter: brightness(0.96);
    }
    &:active > img {
      filter: brightness(0.96);
    }
  }
  img {
    border-radius: 3px;
    display: block;
    background-color: #ffffff36;
    width: 62px;
    height: 62px;
    filter: brightness(0.99);
  }

  p {
    width: 62px;
    margin: 10px 0;
    font-size: 12px;
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
</style>