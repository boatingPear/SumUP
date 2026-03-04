import type { DefaultTheme } from "vitepress"

export default <DefaultTheme.SidebarItem>[
    {
        text: "介绍",
        link: "/frontend/react/basic/"
    },
    {
        text: "核心基础",
        items: [
           {
                text: "核心基础"
           },
           {
                text: "Hooks深入掌握"
           },
        ]
    },
    {
        text: "高级特性",
        items: [
           {
                text: "React19核心新特性"
           },
           {
                text: "并发特性与性能优化"
           },   
           {
                text: "状态管理方案"
           },
        ]
    },
    {
        text: "实战应用",
        items: [
           
        ]
    },
    {
        text: "工程化与扩展",
        items: [
           
        ]   
    },
    {
        text: "深度学习",
        items: [
           
        ]
    },
]