import { defineConfig } from 'vitepress'
import nav from "./nav"
import sidebar from "./sidebar"

// import "./theme/index.css"

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "SumUP",
  description: "个人总结",
  head: [],
  lang: 'zh-CN',
  // 所有的文档都放在src目录下
  srcDir: './src',
  base: "/",
  vite: {
    server: {
      host: '0.0.0.0',
    }
  },
  //markdown样式
  markdown: {
    lineNumbers: true,
    container: {
      tipLabel: "提示",
      warningLabel: "警告",
      dangerLabel: "危险",
      infoLabel: "信息",
      detailsLabel: "详细信息",
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    // 顶部导航菜单
    nav,
    // 侧边栏菜单
    sidebar,
    // 文档页脚文本
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },
    outline: {
      level: [2, 4], // 显示2-4级标题
      label: "当前页大纲"
    },
    returnToTopLabel: "返回顶部",
    // 文档搜索
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: "搜索文档",
                buttonAriaLabel: "搜索文档",
              },
              modal: {
                noResultsText: "无法找到相关结果",
                resetButtonTitle: "清除查询条件",
                footer: {
                  selectText: "选择",
                  navigateText: "切换",
                  closeText: "关闭",
                },
              },
            },
          },
        },
      },
    },
    // 社交链接
    socialLinks: [
      { icon: 'gitee', link: 'https://gitee.com/dabai-pear' },
      { icon: 'github', link: 'https://github.com/boatingPear' }
    ]
  }
})
