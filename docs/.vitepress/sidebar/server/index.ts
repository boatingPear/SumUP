import type { DefaultTheme } from "vitepress"
import javaBasic from "./java/basic"
import database from "./database/index"  

export default <DefaultTheme.SidebarMulti>{
  "/server/java/basic/": javaBasic,
  "/server/database/": database,
}
