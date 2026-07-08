import type { DefaultTheme } from "vitepress"
import reactBasic from "./react/basic"
import browser from "./browser"
import tools from "./tools"
import wxapp from "./other/wxapp"

export default <DefaultTheme.SidebarMulti>{
  "/frontend/react/basic/": reactBasic,
  "/frontend/browser/": browser,
  "/frontend/tools/": tools,
  "/frontend/other/wxapp/": wxapp,
}
