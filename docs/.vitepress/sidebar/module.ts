import type { DefaultTheme } from "vitepress";

/**
 * 模块
 */
export default <DefaultTheme.SidebarItem[]>[
  {
    text: "介绍",
    collapsed: false,
    link: "/module/index",
  },
  {
    text: "suitex-webui",
    collapsed: false,
    items: [
      {
        text: "静态路由",
        link: "/module/webui/staticRoutes",
      },
      {
        text: "工作台",
        link: "/module/webui/dashboard",
      },
      {
        text: "个人中心",
        link: "/module/webui/userCenter",
      },
      {
        text: "开发帮助",
        link: "/module/webui/devHelp",
      },
      {
        text: "平台管理",
        link: "/module/webui/platformMng",
      },
      {
        text: "系统管理",
        link: "/module/webui/systemMng",
      },
    ],
  },
  {
    text: "扩展模块",
    collapsed: false,
    items: [
      {
        text: "Drawio 插件",
        link: "/module/expansion/drawio",
      },
      {
        text: "发送短信",
        link: "/module/expansion/nsms",
      },
      {
        text: "发送邮件",
        link: "/module/expansion/mail",
      },
      {
        text: "单点登录",
        link: "/module/expansion/sso",
      },
      {
        text: "敏感词过滤",
        link: "/module/expansion/dfa",
      },
    ],
  },
];
