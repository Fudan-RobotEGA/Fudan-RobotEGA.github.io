import { defineThemeConfig } from 'vuepress-theme-plume'
import { navbar } from './navbar'

export default defineThemeConfig({
  logo: 'https://theme-plume.vuejs.press/plume.png',

  appearance: true,

  social: [
    { icon: 'github', link: '/' },
  ],

  profile: {
    avatar: 'https://theme-plume.vuejs.press/plume.png',
    name: '复旦大学星云EGA战队',
    description: '复旦大学RoboMaster战队——星云EGA的官方网站。',
  },

  navbar,

})
