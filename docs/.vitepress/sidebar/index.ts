import type { DefaultTheme } from "vitepress";
import guide from "./guide";
import module from "./module";
import frontendReactBasic from "./frontend/react/basic"
import frontendTools from "./frontend/tools";
import frontendOtherWxapp from "./frontend/other/wxapp";
import serverJavaBasic from "./server/java/basic/";
import listOfEvents from "./listOfEvents";

/**
 * 侧边栏
 */
export default <DefaultTheme.SidebarMulti>{
  //指南
  "/guide/": guide,
  //模块
  "/module/": module,
  // 前端-react-基础
  "/frontend/react/basic/": frontendReactBasic,
  // 前端-工具
  "/frontend/tools/": frontendTools,
  // 前端-其他-微信小程序
  "/frontend/other/wxapp/": frontendOtherWxapp,
  // 后端-java-基础
  "/server/java/basic/": serverJavaBasic,
  // 流水账
  "/listOfEvents/": listOfEvents,
};  
