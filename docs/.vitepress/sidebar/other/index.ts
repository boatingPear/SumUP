import type { DefaultTheme } from "vitepress"
import trae from "./trae"
import health from "./health"

export default <DefaultTheme.SidebarMulti>{
  "/other/trae/": trae,
  "/other/health/": health,
}
