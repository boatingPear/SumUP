/* .vitepress/theme/index.ts */
import DefaultTheme from 'vitepress/theme'
import Layout from './components/Layout.vue'

import "./style/index.css"

export default {
  extends: DefaultTheme,
  Layout,
  // ...DefaultTheme, //或者这样写也可
}