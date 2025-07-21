import { defineUserConfig } from "vuepress";
import recoTheme from "vuepress-theme-reco";
import { viteBundler } from '@vuepress/bundler-vite'
import { webpackBundler } from '@vuepress/bundler-webpack'

export default defineUserConfig({
  // title: "美食桌面版帮助文档",
  title: "Rainy Blog",

  description: "Just playing around",
  bundler: viteBundler(),
  // bundler: webpackBundler(),
  
  head: [
    ['link', { rel: 'icon', href: 'https://q.ms.huanlecdn.com/4399/cdn.123u.com/images/2/4/0x24a10800.png' }]
  ],
  theme: recoTheme({
    autoSetSeries: true,
    logo: "https://q.ms.huanlecdn.com/4399/cdn.123u.com/images/2/4/0x24a10800.png",
    author: "Rainy",
    authorAvatar: "https://q1.qlogo.cn/g?b=qq&nk=2254399813&s=100",
    docsRepo: "https://github.com/1528344561/msdzls-desktop-helper",
    docsBranch: "main",
    docsDir: "",
    lastUpdated: true,
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
              "text":"无法进入",
              "link":"game_enter_failed"
            },{
              "text":"游戏偶尔崩溃",
              "link":"game_crash"
            }]
          },{
            "text":"软件配置",
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
            text:"自定义战斗序列[荐]",
            link:"auto_fight_list"
          },
          {
            text:"公会任务",
            link:"guild_task"
          },{
            text:"挂机魔塔",
            link:"auto_mota"
          },{
            text:"温馨礼包",
            link:"warm_gift"
          },{
            text:"WPE",
            link:"wpe"
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
          content: `🎉🎉🎉 桌面版0.96.0版本已经发布，大家可以尽情尝鲜了，并且希望大家在 QQ 群踊跃反馈使用体验，我会在第一时间响应。`,
          style: "font-size: 12px;",
        },
        {
          type: "hr",
        },
        {
          type: "title",
          content: "更新计划 0.96.2",
        },{
          type: "text",
          content: `
          <ul>
            <li>自动战斗序列,解放双手!</li>
            <li>WPE神装,星三神</li>
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
            <li><a href="https://report.sumk.top">Issues[问题反馈]<a/></li>
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
    // algolia: {
    //   appId: '27TAXUB7WU',
    //   apiKey: 'f2dcf0e4adec00a2246224c2db10e442',
    //   indexName: 'xxx',
    //   inputSelector: '键入欲搜寻的关键词',
    //   algoliaOptions: { 'facetFilters': ["lang:$LANG"] },
    //   debug: false // Set debug to true if you want to inspect the dropdown
    // },
    // commentConfig: {
    //   type: 'valine',
    //   // options 与 1.x 的 valineConfig 配置一致
    //   options: {
    //     // appId: 'xxx',
    //     // appKey: 'xxx',
    //     // placeholder: '填写邮箱可以收到回复提醒哦！',
    //     // verify: true, // 验证码服务
    //     // notify: true,
    //     // recordIP: true,
    //     // hideComments: true // 隐藏评论
    //   },
    // },
  }),
  // debug: true,
});
