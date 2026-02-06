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
                text: '工具集成',
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
            }
        ]
    },
    // {
    //     text: '后端',
    //     items: []
    // },
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
