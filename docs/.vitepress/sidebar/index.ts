import type { DefaultTheme } from "vitepress";
import guide from "./guide";
import module from "./module";

/**
 * 侧边栏
 */
export default <DefaultTheme.SidebarMulti>{
  //指南
  "/guide/": guide,
  //模块
  "/module/": module,
};
