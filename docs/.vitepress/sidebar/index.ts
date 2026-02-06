import type { DefaultTheme } from "vitepress";
import guide from "./guide";
import module from "./module";
import frontendTools from "./frontend/tools";
import frontendOtherWxapp from "./frontend/other/wxapp";

/**
 * 侧边栏
 */
export default <DefaultTheme.SidebarMulti>{
  //指南
  "/guide/": guide,
  //模块
  "/module/": module,
  // 前端-工具
  "/frontend/tools/": frontendTools,
  // 前端-其他-微信小程序
  "/frontend/other/wxapp/": frontendOtherWxapp
};  
