import type { DefaultTheme } from "vitepress"

export default <DefaultTheme.SidebarItem>[
    {
        text: "介绍",
        link: "/server/database/"
    },
    {
        text: "mysql",
        collapsed: false,
        items: [
            {
                text: "MySQL 概述",
                link: "/server/database/mysql/overview.md"
            },
        ]
    },
]