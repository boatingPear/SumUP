import type { DefaultTheme } from "vitepress";

/**
 * 使用指南
 */
export default <DefaultTheme.SidebarItem[]>[
  {
    text: "开始",
    collapsed: false,
    items: [
      {
        text: "框架介绍",
        link: "/guide/index",
      },
      {
        text: "快速开始",
        link: "/guide/quick-start",
      },
      {
        text: "Git仓库配置",
        link: "/guide/git",
      },
    ],
  },
  {
    text: "suitex-services",
    collapsed: false,
    items: [
      {
        text: "事务控制",
        link: "/guide/services/transactional",
      },
      {
        text: "dao层",
        link: "/guide/services/dao",
      },
      {
        text: "文件存储",
        link: "/guide/services/file",
      },
    ],
  },
  {
    text: "suitex-webui",
    collapsed: false,
    items: [
      {
        text: "目录结构",
        link: "/guide/webui/directory-structure",
      },
      {
        text: "配置参数",
        link: "/guide/webui/config",
      },
      {
        text: "路由和菜单",
        link: "/guide/webui/router",
      },
      {
        text: "构建和部署",
        link: "/guide/webui/build",
      },
      {
        text: "自定义",
        link: "/guide/webui/custom",
      },
      {
        text: "客户化",
        link: "/guide/webui/customization",
      },
      {
        text: "脚本",
        link: "/guide/webui/scripts",
      },
      {
        text: "表单布局",
        link: "/guide/webui/layout",
      },
      {
        text: "组件",
        link: "/guide/webui/components",
      },
      {
        text: "权限",
        link: "/guide/webui/auth",
      },
      {
        text: "公共",
        link: "/guide/webui/utils",
      },
    ],
  },
  {
    text: "suitex-mobileui",
    collapsed: false,
    items: [
      {
        text: "目录结构",
        link: "/guide/mobileui/directory-structure",
      },
      {
        text: "配置参数",
        link: "/guide/mobileui/config",
      },
      {
        text: "路由和菜单",
        link: "/guide/mobileui/router",
      },
      {
        text: "构建和部署",
        link: "/guide/mobileui/build",
      },
      {
        text: "自定义",
        link: "/guide/mobileui/custom",
      },
      {
        text: "脚本",
        link: "/guide/mobileui/scripts",
      },
      {
        text: "组件",
        link: "/guide/mobileui/components",
      },
      {
        text: "公共",
        link: "/guide/mobileui/utils",
      },
    ],
  },
  {
    text: "开发规范",
    collapsed: false,
    items: [
      {
        text: "数据库",
        link: "/guide/standard/database",
      },
      {
        text: "前端",
        link: "/guide/standard/frontend",
      },
    ],
  },
  {
    text: "其他",
    collapsed: false,
    items: [
      {
        text: "常见问题",
        link: "/guide/faq",
      },
      {
        text: "版本发布",
        link: "/guide/release",
      },
    ],
  },
];
