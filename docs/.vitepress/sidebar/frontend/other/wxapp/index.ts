import type { DefaultTheme } from "vitepress"

export default <DefaultTheme.SidebarItem>[
    {
        text: "基础",
        link: "/frontend/other/wxapp/"
    },  
    {
        text: "特殊效果",
        collapsed: false,
        items: [
            {
                text: "wxml元素截图",
                link: "/frontend/other/wxapp/wxmlScreenshot"
            }
        ]
    }
]