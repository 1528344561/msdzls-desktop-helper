import{_ as n,c as i,a as s,b as o,d as t,e as l,r as a,o as d}from"./app-CW88tD03.js";const c={},p={class:"custom-container tip"},h={href:"http://recoluan.gitlab.io",target:"_blank",rel:"noopener noreferrer"},g={href:"https://github.com/recoluan/vuepress-theme-reco/blob/master/LICENSE",target:"_blank",rel:"noopener noreferrer"};function u(m,e){const r=a("ExternalLinkIcon");return d(),i("div",null,[e[7]||(e[7]=s("p",null,[s("img",{src:"https://img.shields.io/badge/vuepress-0.14.8-brightgreen.svg",alt:"vuepress"}),s("img",{src:"https://img.shields.io/badge/leancloud--storage-3.10.1-orange.svg",alt:"leancloud-storage"}),s("img",{src:"https://img.shields.io/badge/valine-1.3.4-blue.svg",alt:"valine"})],-1)),s("div",p,[e[5]||(e[5]=o('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 8h.01"></path><path d="M11 12h1v4h1"></path></g></svg><p class="custom-container-title">介绍</p>',2)),s("ol",null,[e[3]||(e[3]=s("li",null,[t("这是一个vuepress主题，旨在添加博客所需的分类、TAB墙、分页、评论等能；"),s("br")],-1)),e[4]||(e[4]=s("li",null,[t("主题追求极简，根据 vuepress 的默认主题修改而成，官方的主题配置仍然适用；"),s("br")],-1)),s("li",null,[e[1]||(e[1]=t("你可以打开 ")),s("a",h,[e[0]||(e[0]=t("午后南杂")),l(r)]),e[2]||(e[2]=t(" 来查看效果。"))])])]),e[8]||(e[8]=o('<h2 id="play-together" tabindex="-1"><a class="header-anchor" href="#play-together"><span>Play Together</span></a></h2><h3 id="_0-x" tabindex="-1"><a class="header-anchor" href="#_0-x"><span>0.x</span></a></h3><p><code>vuepress-theme-reco@0.x</code> 是基于 <code>vuepress@0.x</code> 的博客主题。</p><p><code>vuepress@0.x</code> 功能比较简单，只适合书写简单的文档，但好在支持主题自定义，而个人又希望能够用它来书写博客，原因就是它足够的简洁，毫无疑问，这也符合很多程序员的观念，也就是在这种情况下，<code>vuepress-theme-reco@0.x</code> 的第一个版本经过一个通宵而产生。</p><p>主题开源不久，很多朋友通过各种联系方式，给到很多好的意见和建议，所以我个人也在积极地更新。</p><p>因为我是一名前端开发工程师，开发的过程中，总是想着能不能加入一些炫酷的效果，有很多次都是添加上又去掉，反反复复，最后都是被 <strong>简洁</strong> 的这个原则阻止掉，毕竟，现在我是将它当作一个产品来看待，并不是一个技术或者是技巧的尝试项目。</p><h3 id="_1-x" tabindex="-1"><a class="header-anchor" href="#_1-x"><span>1.x</span></a></h3><p>随着不断有用户过来询问：为什么 <code>vuepress-theme-reco@0.x</code> 不能在 <code>vuepress@1.x</code> 上使用？本来只是打算对 <code>vuepress-theme-reco@0.x</code> 进行简单的bug修复的我，终究还是忍不住，开始了 <code>vuepress-theme-reco@1.x</code> 的开发。又是在一个寂静的凌晨两点半（晚上就是出活快），我默默地开始了。</p><p>主题升级的关键也就是 <code>@vuepress/plugin-blog</code> 这款官方插件，它不需要再去麻烦地过滤数据，将分类和标签的相关信息直接存在 <code>$categories</code> 和 <code>$tags</code> 这两个全局变量中。借助于 <code>@vuepress/plugin-blog</code>，分类和标签功能更容易实现，但也有了一些局限。接下来两三天的时间，都是在进行功能的迁移和一些bug的修复。</p><p><code>vuepress-theme-reco@0.x</code> 的开发中，更加深刻地明白了模块化和组件化编程的重要性，如果当初没有把一些功能进行封装，而是直接简单的复制，这次升级也不会这么顺利。模块拆分的越细，使用就会越灵活。</p><h3 id="cli" tabindex="-1"><a class="header-anchor" href="#cli"><span>CLI</span></a></h3><p>还是衷心地希望能有更多的朋友参与进来，更快地去完善它。接下来时间允许的情况下，我会开源一款自动生成博客的脚手架，略过配置步骤，直接书写优质内容，这也是我后来逐渐形成的一种信念，就是希望能让这款主题，功能越完善，使用越来越简单。</p><h2 id="license" tabindex="-1"><a class="header-anchor" href="#license"><span>License</span></a></h2>',13)),s("p",null,[s("a",g,[e[6]||(e[6]=t("MIT")),l(r)])])])}const x=n(c,[["render",u],["__file","guide.html.vue"]]),b=JSON.parse('{"path":"/blogs/other/guide.html","title":"vuepress-theme-reco","lang":"en-US","frontmatter":{"title":"vuepress-theme-reco","date":"2019/04/09","categories":["reco"]},"headers":[{"level":2,"title":"Play Together","slug":"play-together","link":"#play-together","children":[{"level":3,"title":"0.x","slug":"_0-x","link":"#_0-x","children":[]},{"level":3,"title":"1.x","slug":"_1-x","link":"#_1-x","children":[]},{"level":3,"title":"CLI","slug":"cli","link":"#cli","children":[]}]},{"level":2,"title":"License","slug":"license","link":"#license","children":[]}],"git":{"createdTime":1741851114000,"updatedTime":1741916106000,"contributors":[{"name":"Jueshi","email":"1528344561@qq.com","commits":2}]},"filePathRelative":"blogs/other/guide.md"}');export{x as comp,b as data};
