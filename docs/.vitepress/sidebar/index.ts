import type { DefaultTheme } from "vitepress"
import frontend from "./frontend"
import server from "./server"
import resource from "./resource"
import listOfEvents from "./listOfEvents"
import other from "./other"

/**
 * 侧边栏
 *
 * 新增规则：
 *   - 新增子模块（如 another-topic）→ 在对应分类的 index.ts 中添加
 *   - 新增顶级分类（如 design） → 在此文件添加一行 import + 展开
 */
export default <DefaultTheme.SidebarMulti>{
  ...frontend,
  ...server,
  "/resource/": resource,
  "/listOfEvents/": listOfEvents,
  ...other,
}
