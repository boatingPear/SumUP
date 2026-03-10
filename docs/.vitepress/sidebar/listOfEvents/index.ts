import type { DefaultTheme } from "vitepress"

export default <DefaultTheme.SidebarItem>[
    {
        text: "年度终结",
        link: "/listOfEvents/2026/"
    },
    {
        text: "三月",
        items: [
            {
                text: "十日",
                link: "/listOfEvents/2026/march/10.md"
            }
        ]
    }
]