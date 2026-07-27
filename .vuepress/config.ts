import { defineUserConfig } from "vuepress";
import recoTheme from "vuepress-theme-reco";
import { viteBundler } from '@vuepress/bundler-vite'
import { webpackBundler } from '@vuepress/bundler-webpack'
import { getDirname, path } from 'vuepress/utils'

const __dir = getDirname(import.meta.url)

/**
 * 顶掉主题的 SeriesItem：原件是函数式组件，SSR 预渲染时 useRoute() 返回 undefined，
 * isActiveLink 读 route.hash 直接抛 TypeError，Vue 的 SSR 会把整棵子树吞掉——
 * 构建照样 exit 0，但静态 HTML 里 .series-container 是个空壳，侧边栏条目一个不剩。
 * 详见 theme-overrides/SeriesItem.js 顶部注释。
 *
 * Series/index.vue 用相对路径 './SeriesItem.js' 引它，alias 是按原始 specifier
 * 匹配的，够不着完整路径，所以这里用 resolveId 靠 importer 认人。
 */
const recoSeriesItemSsrFix = {
  name: 'reco-series-item-ssr-fix',
  enforce: 'pre' as const,
  resolveId(source: string, importer?: string) {
    if (
      source === './SeriesItem.js' &&
      importer
        ?.replace(/\\/g, '/')
        .includes('vuepress-theme-reco/lib/client/components/Series/')
    ) {
      return path.resolve(__dir, 'theme-overrides/SeriesItem.js')
    }
    return null
  },
}

export default defineUserConfig({
  title: "美食桌面版帮助文档",
  // title: "Rainy Blog",

  description: "美食大战老鼠桌面版官网帮助文档",

  // 本机 8080 被另一个服务（sub2api）占着，但它只绑 IPv6 通配 [::]，
  // vite 绑 IPv4 通配 0.0.0.0 能成功、不认为冲突，所以不会自动换端口；
  // 而 Windows 的 localhost 优先解析到 ::1，浏览器打开 localhost:8080
  // 命中的是那个服务，不是本站。换个端口避开。
  port: 8099,
  // 注意：reco 主题会在 onInitialized 里用 app.options.bundler = viteBundler(...)
  // 整个换掉 bundler，这里传的 options 会被丢弃，只有「选 vite 还是 webpack」这个
  // 选择本身生效。要给 vite 传配置得走下面 recoTheme 的 viteBundlerOptions。
  // 见 node_modules/vuepress-theme-reco/lib/node/resolveBundlerConfig.js
  bundler: viteBundler(),
  // bundler: webpackBundler(),
  
  head: [
    ['link', { rel: 'icon', href: 'https://q.ms.huanlecdn.com/4399/cdn.123u.com/images/2/4/0x24a10800.png' }]
    ,['script', {
      defer: '',
      src: 'https://umami.rainysnow.com/script.js',
      'data-website-id': '4a8a1af4-c021-45e3-8a33-8b798e1d362f'
    }],
    ['link', { href: 'https://cdn.jsdelivr.net/npm/@docsearch/css@alpha', rel: 'stylesheet' }],
    ['script', { async: '', src: 'https://cdn.jsdelivr.net/npm/@docsearch/js@alpha' }],
    // 首帧前落地配色与雨量，避免刷新时闪一下默认主题
    [
      'script',
      {},
      `(function(){try{var d=document.documentElement;var list=['midnight','neon','moss','amber','mist'];var p=localStorage.getItem('rainy-palette');if(list.indexOf(p)<0){p='midnight'}d.setAttribute('data-palette',p);if(p==='mist'){d.classList.remove('dark')}else{d.classList.add('dark')}var r=localStorage.getItem('rainy-rain-level');d.style.setProperty('--rain-opacity',r==='0'?'0':(r==='1'?'0.55':'1'))}catch(e){document.documentElement.setAttribute('data-palette','midnight')}})();`,
    ],
  ],
  theme: recoTheme({
    // 主题只认这里传的 vite 配置，见上面 bundler 处的说明
    viteBundlerOptions: {
      viteOptions: {
        // Windows 下依赖预构建目录的原子重命名会被锁定，导致 504 Outdated Optimize Dep；
        // 关闭开发期预构建，改由 Vite 按模块即时处理，避免首页动态模块加载失败。
        optimizeDeps: {
          noDiscovery: true,
        },
        plugins: [recoSeriesItemSsrFix],
      },
    },
    colorMode: "dark",
    autoSetSeries: true,
    logo: "https://q.ms.huanlecdn.com/4399/cdn.123u.com/images/2/4/0x24a10800.png",
    author: "Rainy",
    authorAvatar: "https://q1.qlogo.cn/g?b=qq&nk=2254399813&s=100",
    docsRepo: "https://github.com/1528344561/msdzls-desktop-helper",
    docsBranch: "main",
    docsDir: "",
    lastUpdated: false,
    lastUpdatedText: "",
    // series 为原 sidebar
    series: {
      "/docs/guide/":[
        {
          text:"快速上手",
          children:[{
            text:"安装",
            children:[
              {
                text:"前置知识",
                link:"pre_knowledge"
              },{
                text:"Flash",
                link:"install_flash.md"
              },{
                text:"开始安装",
                link:"introduce"
              }
            
            ]
          },
          {
            text:"无法打开?",
            link:"main_window_enter_failed",
            children:[{
              text:"打不开主程序",
              link:"main_window_enter_failed"
            },{
              text:"打不开游戏窗口",
              link:"game_window_enter_failed"
            },{
              "text":"无法进入游戏",
              "link":"game_enter_failed"
            },{
              "text":"游戏偶尔崩溃",
              "link":"game_crash"
            }]
          },{
            "text":"软件配置与迁移",
            "link":"config"
          },{
            "text":"常用网站",
            'link':"friend_link"
          },{
            "text":"BUG反馈",
            'link':"bug_report"
          }]
        },
        {
          text:"初级使用",
          children:[{
            text:"自动练级",
            link:"auto_level_up"
          },{
            text:"一键挂机",
            link:"auto_play"
          },{
            text:"自定义战斗序列 · 推荐",
            link:"auto_fight_list"
          },
          {
            text:"公会任务",
            link:"guild_task"
          },{
            text:"挂机魔塔",
            link:"auto_mota"
          },{
            text:"粉红保罗",
            link:"pink_paul"
          },{
            text:"温馨礼包",
            link:"warm_gift"
          },{
            text:"WPE",
            link:"wpe"
          }]
        },
        {
          text:"高级功能",
          children:[{
            text:"高级功能 · 推荐",
            link:"advanced"
          }]
        },
        {
          text:"自动化",
          children:[{
            text:"全自动签到",
            link:"auto_sign"
          },{
            text:"全自动公会任务",
            link:"auto_guild_task"
          },{
            text:"全自动挂机刷图",
            link:"auto_guaji"
          }]
        }
      ],
      "/docs/theme-reco/": [
        {
          text: "module one",
          children: ["home", "theme"],
        },
        {
          text: "module two",
          children: ["api", "plugin"],
        },
      ],
    },
    navbar: [
      { text: "首页", link: "/" , icon: 'IconHome'},
      {text: "立即下载", link: "/docs/guide/download", icon: 'IconDownload'},
      {text: "更新日志", link: "/docs/guide/update_log", icon: 'IconUpdate'},
      {text: "关于", link: "/docs/about/", icon: 'IconAbout'},
      // { text: "Categories", link: "/categories/reco/1.html" },
      // { text: "Tags", link: "/tags/tag1/1.html" },
      // {
      //   text: "Docs",
      //   children: [
      //     { text: "vuepress-reco", link: "/docs/theme-reco/theme" },
      //     { text: "vuepress-theme-reco", link: "/blogs/other/guide" },
      //   ],
      // },
    ],
    bulletin: {
      body: [
        {
          type: "text",
          content: `桌面版已支持 QQ 游戏大厅`,
          style: "font-size: 12px;",
        },
        {
          type: "hr",
        },
        // {
        //   type: "title",
        //   content: "0.96.7",
        // },
        {
          type: "text",
          content: `
          <ul>
            <li>自动战斗序列, 解放双手!</li>
            <li>自动过动态验证, 无忧挂机!</li>
            <li>WPE神装, 星三神</li>
            <li>1级VIP签到</li>
          </ul>`,
          style: "font-size: 12px;",
        },
        {
          type: "hr",
        },
        {
          type: "title",
          content: "QQ 群",
        },
        {
          type: "text",
          content: `
          <ul>
            <li>QQ群1：560363912</li>
            <li>QQ群2：1032262153</li>
          </ul>`,
          style: "font-size: 12px;",
        },
        {
          type: "hr",
        },
        {
          type: "title",
          content: "GitHub",
        },
        {
          type: "text",
          content: `
          <ul>
            <li><a href="https://report.rainysnow.com">Issues[问题反馈]</a></li>
          </ul>`,
          style: "font-size: 12px;",
        },
        {
          type: "hr",
        },
        {
          type: "buttongroup",
          children: [
            {
              text: "打赏",
              link: "https://jz.sumk.top",
            },
          ],
        },
      ],
    },
  }),
  // debug: true,
});
