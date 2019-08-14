/**
 * 全局基本配置 / 开关
 */

// 当前宿主平台， 兼容多平台应该通过一些特定函数来取得
export const HOST_PLATFORM = 'WEB';

// node 的开发环境
export const NODE_ENV = process.env.NODE_ENV || 'production';

// node 开发环境的简化， 判断是否是开发环境
export const __DEV__ = NODE_ENV === 'development';

// 开发环境是否跳过token检测
export const PASS_TOKEN = process.env.VUE_APP_PASS_TOKEN === 'true';

// 跟后端联调的统一标识
export const BASE_API = process.env.VUE_APP_BASE_API;

// 是否强制所有请求访问本地 MOCK， 每个请求也可以单独控制是否请求 MOCK
export const AJAX_LOCALLY_ENABLE = false;

// 是否开启监控
export const MONITOR_ENABLE = true;

// 是否开启请求参数打印
export const CONSOLE_REQUEST_ENABLE = true;

// 是否开启响应参数打印
export const CONSOLE_RESPONSE_ENABLE = true;

// 是否开启监控记录打印
export const CONSOLE_MONITOR_ENABLE = true;
