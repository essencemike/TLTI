<template lang="pug">
.eui-time--wrapper
  span.eui-time__hours(v-if="!timeObj.today") {{ `${timeObj.month}/${timeObj.day}` }}
  span.eui-time__hours {{ timeObj.hours < 10 ? `0${timeObj.hours}` : timeObj.hours }}
  span.eui-time__minutes {{ timeObj.minutes < 10 ? `0${timeObj.minutes}` : timeObj.minutes }}
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class EuiTime extends Vue {
  @Prop({ type: String, default: '' }) time!: string;

  get timeObj() {
    const date = this.time ? new Date(this.time) : new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const today = this.isToday(`${year}/${month}/${day}`);

    return { hours, minutes, year, month, day, today };
  }

  isToday(str: string): boolean {
    const d = new Date(str.replace(/-/g, '/'));
    const todaysDate = new Date();

    if (d.setHours(0, 0, 0, 0) === todaysDate.setHours(0, 0, 0, 0)) {
      return true;
    }
    return false;
  }
}
</script>
<style lang="less" scoped>
.eui-time__hours {
  color: #a5a5a5;
}

.eui-time__minutes {
  color: #a5a5a5;

  &::before {
    content: ':';
    display: inline-block;
    position: relative;
    top: -1px;
    padding: 0 1px;
  } 
}
</style>