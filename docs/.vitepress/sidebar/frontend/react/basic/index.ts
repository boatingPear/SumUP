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
                text: "React简介与特点",
                link: "/frontend/react/basic/part1/01-React简介与特点.md"
            }
        ]
    },
    {
        text: "Hooks深入掌握"
    },
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