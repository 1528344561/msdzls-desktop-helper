/**
 * vuepress-theme-reco@2.0.0-rc.26 自带组件的本地副本。
 * 原文件：node_modules/vuepress-theme-reco/lib/client/components/Series/SeriesItem.js
 * 由 .vuepress/config.ts 里的 vite 插件（resolveId）顶掉原件。
 *
 * 改动：把组件从「函数式」改成带 setup() 的「有状态」组件，其余逻辑照抄。
 *
 * 原因：原件是函数式组件，在 SSR 预渲染阶段 useRoute() 返回 undefined，
 * isActiveLink 直接读 route.hash 抛 TypeError；Vue 的 SSR 捕获异常后会把整棵
 * 子树丢掉，于是构建照样 exit 0，但静态 HTML 里 .series-container 是个空壳——
 * 侧边栏一个条目都没有，无 JS 环境和搜索引擎爬虫看到的就是没有导航。
 *
 * 为什么不是简单加个 `if (!route) return false` 守卫：那样条目能渲染出来，
 * 但服务端算出的 active 恒为 false，和客户端不一致。Vue 对 hydration 时的
 * class 不匹配只检查、不修正（生产构建下明确说 "The DOM will not be rectified
 * in production due to performance overhead"），结果是当前页永远不高亮。
 * 改成有状态组件后 setup() 里的 useRoute() 在 SSR 下正常，两边结果一致。
 *
 * 升级主题时请对照上游此文件重新 diff。
 */
import { defineComponent, h } from 'vue';
import { IconFolder } from '@components/icons/index.js';
import { useRoute } from 'vuepress/client';
import Link from '@components/Link.vue';
import Xicons from '@components/global/Xicons.vue';
const normalizePath = (path) => decodeURI(path)
    .replace(/#.*$/, '')
    .replace(/(index)?\.(md|html)$/, '');
const isActiveLink = (route, link) => {
    // route 兜底：改成有状态组件后正常拿得到，留着只为不再出现整棵子树被吞的情况。
    if (link === undefined || !route) {
        return false;
    }
    if (route.hash === link) {
        return true;
    }
    const currentPath = normalizePath(route.path);
    const targetPath = normalizePath(link);
    return currentPath === targetPath;
};
const isActiveItem = (route, item) => {
    if (item.children) {
        return item.children.some((child) => isActiveItem(route, child));
    }
    if (isActiveLink(route, item.link)) {
        return true;
    }
    return false;
};
const togglecollapsible = (e, item, level) => {
    if (level !== 1)
        return;
    item.collapsible = !!!item.collapsible;
    const currentNode = e.target.closest('.series-heading');
    const arrowNode = currentNode.querySelector('.arrow');
    const nextNode = currentNode.nextElementSibling;
    if (item.collapsible) {
        arrowNode.classList.remove('down');
        arrowNode.classList.add('right');
        nextNode.style.display = 'none';
    }
    else {
        arrowNode.classList.remove('right');
        arrowNode.classList.add('down');
        nextNode.style.display = 'block';
    }
};
const renderItem = (item, level, props) => {
    if (item.link) {
        return h(Link, {
            ...props,
            item,
        });
    }
    const titleTag = level === 1 ? 'h5' : 'h6';
    // if the item only has text, render it as `<p>`
    return h(titleTag, { ...props, onClick: (e) => togglecollapsible(e, item, level) }, [
        h(Xicons, {
            icon: level === 1 ? IconFolder : '',
            text: item.text,
            textSize: level === 1 ? 16 : 14
        }),
        level !== 1 ? null : h('span', {
            class: !!item.collapsible ? 'arrow right' : 'arrow down',
        }),
    ]);
};
const renderChildren = (item, level) => {
    if (!item.children?.length) {
        return null;
    }
    return h('ul', {
        style: {
            display: !!item.collapsible ? 'none' : 'block',
        },
    }, item.children.map((child) => h('li', h(SeriesItem, {
        item: child,
        level
    }))));
};
export const SeriesItem = defineComponent({
    name: 'SeriesItem',
    props: {
        item: {
            type: Object,
            required: true,
        },
        level: {
            type: Number,
            required: true,
        },
    },
    setup(props) {
        // 关键：useRoute() 必须在 setup() 里调用。原件把它放在函数式组件的
        // 渲染函数中，SSR 下 inject 拿不到路由。
        const route = useRoute();
        return () => {
            const { item, level } = props;
            const active = level === 1 ? isActiveItem(route, item) : false;
            if (item.children) {
                return [
                    h('section', {
                        class: 'series-group series-item',
                    }, [
                        renderItem(item, level, {
                            class: {
                                'series-heading': true,
                                [`series-level-${level}`]: true,
                                active,
                            },
                        }),
                        renderChildren(item, level + 1),
                    ]),
                ];
            }
            return [
                renderItem(item, level + 1, {
                    class: {
                        'series-item': true,
                        active,
                    },
                }),
            ];
        };
    },
});
