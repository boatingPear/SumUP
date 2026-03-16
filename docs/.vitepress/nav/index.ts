import type { DefaultTheme } from "vitepress";

export default <DefaultTheme.NavItem[]>[
    { 
        text: 'Home', 
        link: '/' 
    },
    { 
        text: '例子', 
        link: '/examples/index' 
    },
    {
        text: '前端',
        activeMatch:'/frontend/',
        items: [
            {
                text: "react",  
                items: [
                    {
                        text: "react基础",
                        link: "/frontend/react/basic/"
                    }       
                ]
            },
            {
                text: '工具',
                link: '/frontend/tools/'
            },    
            // { text: '组件库' },
            // { text: '工程化' },
            {
                text: '其他',
                activeMatch:'/frontend/other/',
                items: [
                    { text: '微信小程序', link: '/frontend/other/wxapp' }, 
                ]
            },
            {
                text: "经验总结",
                link: "/frontend/experience/ai-frontent-dev"
            }
        ]
    },
    {
        text: '后端',
        activeMatch: "/server/",
        items: [
            {
                text: "java",
                activeMatch:'/server/java/',
                items: [
                    { text: 'java基础', link: '/server/java/basic/' },
                ]
            }
        ]
    },
    { 
        text: '资源', 
        link: '/resource/index'
    },
    {
        text: "流水账",
        items: [
            { 
                text: '2026年',
                link: "/listOfEvents/2026/"
            },
        ]
    },
    {
        text: "其他",
        items: [
            {
                text: "前端ai开发经验",
                link: "/others/ai-frontent-dev"
            },
            {
                text: "agent开发转型起飞",
                link: "/others/agent-dev-takeoff"
            }
        ]
    }
    // {
    //     text: '运维',
    //     items: []
    // },
    // {
    //     text: '产品',
    //     items: []
    // },
    // {
    //     text: '个人记录', 
    //     items: []
    // }
];
