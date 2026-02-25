import type { DefaultTheme } from "vitepress"

export default <DefaultTheme.SidebarItem>[
    {
        text: "介绍",
        link: "/server/java/basic/"
    },
    {
        text: "Java基础",
        items: [
            {
                text: "语法",
                link: "/server/java/basic/primary/grammar"
            },
            {
                text: "IDEA开发工具",
                link: "/server/java/basic/primary/ideaCodeTool"
            },
            {
                text: "运算符和表达式",
                link: "/server/java/basic/primary/operatorExpression"
            },
            {
                text: "控制语句",
                link: "/server/java/basic/primary/controlStatement"
            },
            {
                text: "数组",
                link: "/server/java/basic/primary/array"
            },
            {
                text: "关键字",
                link: "/server/java/basic/primary/keyword"
            }
        ]
    },
    {
        text: "Java中级",
        items: [
            {
                text: "面向对象",   
                link: "/server/java/basic/intermediate/objectOriented"   
            }
        ]
    }
]