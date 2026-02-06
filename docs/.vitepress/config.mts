import { defineConfig } from 'vitepress'
import nav from "./nav"
import sidebar from "./sidebar"

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "SumUp",
  description: "个人总结",
  head: [],
  lang: 'zh-CN',
  // 所有的文档都放在src目录下
  srcDir: './src',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    // 顶部导航菜单
    nav,
    // 侧边栏菜单
    sidebar,
    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
