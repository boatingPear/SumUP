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
            },
            {
                text: "知识加油站",
                link: "/server/java/basic/primary/supplement"
            }
        ]
    },
    {
        text: "Java中级",
        collapsed: true,
        items: [
            {
                text: "面向对象",   
                link: "/server/java/basic/intermediate/objectOriented"   
            },
            {
                text: "抽象类",
                link: "/server/java/basic/intermediate/abstractClass"
            },
            {
                text: "接口",
                link: "/server/java/basic/intermediate/interface"
            },
            {
                text: "枚举",
                link: "/server/java/basic/intermediate/enum"
            },
            {
                text: "常用类",
                link: "/server/java/basic/intermediate/commonClass"
            },
            {
                text: "内部类",
                link: "/server/java/basic/intermediate/innerClass"
            },
            {
                text: "常用API",
                link: "/server/java/basic/intermediate/commonAPI"
            },
            {
                text: "知识加油站",
                link: "/server/java/basic/intermediate/supplement"
            }
        ]
    },
    {
        text: "Java高级",
        collapsed: true,
        items: [
            {
                text: "集合类",
                link: "/server/java/basic/high/collectionClass"
            },
            {
                text: "泛型",
                link: "/server/java/basic/high/genericity"
            },
            {
                text: "知识加油站",
                link: "/server/java/basic/high/supplement"
            }
        ]
    },
    {
        text: "Java进阶篇一",
        items: [
            {
                text: "Stream流",
                link: "/server/java/basic/advanced1/stream"
            },
            {
                text: "方法引用",
                link :"/server/java/basic/advanced1/methodReference"
            },
            {
                text: "异常处理",
                link: "/server/java/basic/advanced1/exception"
            },
            {
                text: "File类",
                link: "/server/java/basic/advanced1/file"
            },
            {
                text: "IO流",
                link: "/server/java/basic/advanced1/io"
            }
        ]
    }
]