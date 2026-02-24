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
                link: "/server/java/basic/grammar"
            },
            {
                text: "IDEA开发工具",
                link: "/server/java/basic/ideaCodeTool"
            },
            {
                text: "运算符和表达式",
                link: "/server/java/basic/operatorExpression"
            }
        ]
    }
]